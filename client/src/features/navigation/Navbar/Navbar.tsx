import React, { useEffect, useRef } from "react";
import { useParams, Outlet } from "react-router-dom";
import { useQueryClient } from "react-query";
import { styled } from "@/stitches.config";
import { navRoutes } from "@/constants/routes";

// Constants
import queryKeys from "@/constants/queryKeys";
import socketEvents from "@/constants/socketEvents";

// Types
import { ConversationData } from "@/features/chat/hooks/useGetConversations/useGetConversations";
import { Message } from "@/features/chat/hooks/useGetMessages/useGetMessages";

// Hooks
import { useAuth, useSocket } from "@/hooks";
import { useGetConversations } from "@/features/chat/hooks";
import { useGetRelationships } from "@/features/friends/hooks";

// Components
import { Flex, SideNavigation, SideNavigationItem } from "@/features/ui";
import Settings from "../Settings/Settings";

type Props = {};

export default function Navbar({}: Props) {
  const queryClient = useQueryClient();
  const { id: conversationId } = useParams();
  const { id: userId } = useAuth();
  const { data: conversations, isSuccess } = useGetConversations(true);
  useGetRelationships(true);
  const socket = useSocket();
  const notificationSoundRef = useRef<HTMLAudioElement>(null)
  const notificationPlayerRef = useRef<HTMLButtonElement>(null)
  const notification = new URL("../../../assets/notification.mp3", import.meta.url).href

  function setStatus(userId: string, status: 1 | 2 | 3 | 4) {
    queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, (oldData: any) => {
      const newData = oldData?.map((conversation: ConversationData) => {
        const modifiedConversation = conversation;
        modifiedConversation?.participants.map((participant) => {
          if (participant.id === userId) {
            participant.status = status;
          }
          return participant;
        });
        return modifiedConversation;
      });
      return newData;
    });
  }

  function playNotificationSound(){
    notificationSoundRef.current?.play();
  }

  async function message(message: Message, conversation: ConversationData) {
    if (message?.author.id == userId) return;

    const messageConversationId = message?.conversation;

    const hasConversation = conversations?.find(
      ({ id }) => id == messageConversationId
    );


    if (conversations !== undefined && conversations.length >= 1) {
      if (hasConversation) {
        queryClient.setQueryData(
          queryKeys.GET_CONVERSATIONS,
          (oldData: any) => {
            const idSet = new Set();

            if (Number(conversationId) != hasConversation.id) {
              hasConversation.unread_count = hasConversation.unread_count + 1 || 1;
              notificationPlayerRef.current?.click();
            } else {
              hasConversation.unread_count = 0;
              socket.emit(socketEvents.READ_MESSAGES, conversationId)
            }

            const convos = [hasConversation, ...oldData].filter(({ id }) =>
              idSet.has(id) ? false : idSet.add(id)
            );

            return convos;
          }
        );
      } else {
        conversation.unread_count = 1;
        notificationPlayerRef.current?.click();

        queryClient.setQueryData(
          queryKeys.GET_CONVERSATIONS,
          (oldData: any) => {
            return [conversation, ...oldData];
          }
        );
      }
    } else {
      conversation.unread_count = 1;
      notificationPlayerRef.current?.click();
      queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, [conversation]);

    }
  }

  async function createGroupDM(conversation: ConversationData) {
    if (conversations !== undefined && conversations.length >= 1) {
      queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, (oldData: any) => {
        return [conversation, ...oldData];
      });
    } else {
      queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, (oldData: any) => {
        return [conversation];
      });
    }
  }

  function changeConversationName(conversationId: string, name: string) {
    if (conversations !== undefined && conversations.length >= 1) {
      queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, (oldData: any) => {
        const newData = [...oldData];
        const conversation = newData.find(
          (conversation) => conversation.id == conversationId
        );
        conversation.name = name;
        return newData;
      });
    } else {
      return;
    }
  }

  useEffect(() => {
    socket.on(socketEvents.SET_STATUS, setStatus);
    socket.on(socketEvents.MESSAGE, message);
    socket.on(socketEvents.CREATE_GROUP_DM, createGroupDM);
    socket.on(socketEvents.CHANGE_CONVERSATION_NAME, changeConversationName);

    return () => {
      socket.off(socketEvents.SET_STATUS, setStatus);
      socket.off(socketEvents.MESSAGE, message);
      socket.off(socketEvents.CREATE_GROUP_DM, createGroupDM);
      socket.off(socketEvents.CHANGE_CONVERSATION_NAME);
    };
  }, [socket, isSuccess, conversationId]);

  return (
    <Flex as="nav">
      <SideNavigation>
        <NavigationWrapper>
          {navRoutes.map((route, index) => {
            return (
              <SideNavigationItem
                label={route.label}
                path={
                  route.path +
                  (route.path === "/" ? "" : "/") +
                  (conversationId ? `c/${conversationId}` : "")
                }
                icon={route.icon}
                key={route.path}
                showLabel={index === 0}
              />
            );
          })}
          <li>
            <Settings isMobile side="top" />
          </li>
        </NavigationWrapper>
        <Settings />
      </SideNavigation>
      <button className="sr-only" tabIndex={0} ref={notificationPlayerRef} onClick={playNotificationSound}/>
      <audio className="sr-only" tabIndex={0} src={notification} ref={notificationSoundRef} />
      <Outlet />
    </Flex>
  );
}

const NavigationWrapper = styled("ul", {
  display: "flex",
  justifyContent: "evenly",
  width: "100%",
  gap: "$050",

  "@lg": { flexDirection: "column", height: "100%" },
});
