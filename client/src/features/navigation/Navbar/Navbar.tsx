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

// Components
import { Flex, SideNavigation, SideNavigationItem } from "@/features/ui";
import Settings from "../Settings/Settings";

type Props = {};

export default function Navbar({}: Props) {
  const { id } = useParams();
  const { id: userId } = useAuth();
  const { data: conversations, isSuccess } = useGetConversations(true);
  const socket = useSocket();

  useEffect(() => {
    socket.on("setStatus", (userId, status) => {
      queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, (oldData: any) => {
        const newData = oldData.map((conversation: ConversationData) => {
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
    });

    socket.on(
      "message",
      async (message: Message, conversation: ConversationData) => {
        if (message?.author == userId) return;

        const conversationId = message?.conversation;

        const hasConversation = conversations?.find(
          ({ id }) => id == conversationId
        );

        if (conversations !== undefined && conversations.length >= 1) {
          if (hasConversation) {
            console.log('due')
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
            console.log('blue')
            queryClient.setQueryData(
              queryKeys.GET_CONVERSATIONS,
              (oldData: any) => {
                return [conversation, ...oldData];
              }
            );
          }
        } else {
          console.log('true')
          queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, [conversation]);
        }
      }
    );
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
