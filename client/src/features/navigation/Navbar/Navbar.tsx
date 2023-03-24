import React, { useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";
import { styled } from "@/stitches.config";
import { navRoutes } from "@/constants/routes";
import queryClient from "@/config/queryClient";
import queryKeys from "@/constants/queryKeys";

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
  const { id } = useParams();
  const { id: userId } = useAuth();
  const { data: conversations, isSuccess } = useGetConversations(true);
  useGetRelationships(true);
  const socket = useSocket();

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

  async function message(message: Message, conversation: ConversationData) {
    if (message?.author.id == userId) return;

    const conversationId = message?.conversation;

    const hasConversation = conversations?.find(
      ({ id }) => id == conversationId
    );

    if (conversations !== undefined && conversations.length >= 1) {
      if (hasConversation) {
        queryClient.setQueryData(
          queryKeys.GET_CONVERSATIONS,
          (oldData: any) => {
            const idSet = new Set();
            const convos = [hasConversation, ...oldData].filter(({ id }) =>
              idSet.has(id) ? false : idSet.add(id)
            );

            return convos;
          }
        );
      } else {
        queryClient.setQueryData(
          queryKeys.GET_CONVERSATIONS,
          (oldData: any) => {
            return [conversation, ...oldData];
          }
        );
      }
    } else {
      queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, [conversation]);
    }
  }

  async function createGroupDM(conversation: ConversationData){
    if (conversations !== undefined && conversations.length >= 1){
      queryClient.setQueryData(
        queryKeys.GET_CONVERSATIONS,
        (oldData: any) => {
          return [conversation, ...oldData];
        }
      );
    } else {
      queryClient.setQueryData(
        queryKeys.GET_CONVERSATIONS,
        (oldData: any) => {
          return [conversation];
        }
      );
    }
  }
  
  function changeConversationName(conversationId: string, name: string){
    if (conversations !== undefined && conversations.length >= 1){
      queryClient.setQueryData(
        queryKeys.GET_CONVERSATIONS,
        (oldData: any) => {
          const newData = [...oldData];
          const conversation = newData.find(conversation => conversation.id == conversationId)
          conversation.name = name;
          return newData;
        }
      );
    } else {
      return;
    }
  }




  useEffect(() => {
    socket.on("setStatus", setStatus);
    socket.on("message", message);
    socket.on("createGroupDM", createGroupDM)
    socket.on("changeConversationName", changeConversationName)

    return () => {
      socket.off("setStatus", setStatus);
      socket.off("message", message);
      socket.off("createGroupDM", createGroupDM)
      socket.off("changeConversationName")
    };
  }, [socket, isSuccess]);

  return (
    <Flex as="nav">
      <SideNavigation>
        <NavigationWrapper>
          {navRoutes.map((route) => {
            return (
              <SideNavigationItem
                label={route.label}
                path={
                  route.path +
                  (route.path === "/" ? "" : "/") +
                  (id ? `c/${id}` : "")
                }
                icon={route.icon}
                key={route.path}
              />
            );
          })}
          <li>
            <Settings isMobile />
          </li>
        </NavigationWrapper>
        <Settings />
      </SideNavigation>
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
