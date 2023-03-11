import React from "react";
import { useParams, Outlet } from "react-router-dom";
import { styled } from "@/stitches.config";
import { navRoutes } from "@/constants/routes";
import queryClient from "@/config/queryClient";
import queryKeys from "@/constants/queryKeys";

// Types
import { Message } from "@/features/chat/hooks/useGetMessages/useGetMessages";

// Hooks
import { useAuth, useSocket } from "@/hooks";
import { useConversations } from "@/pages/Home/hooks";

// Components
import { Flex, SideNavigation, SideNavigationItem } from "@/features/ui";

import Settings from "../Settings/Settings";
import { ConversationData } from "@/pages/Home/hooks/useConversations";

type Props = {};

export default function Navbar({}: Props) {
  const { id } = useParams();
  const { id: userId } = useAuth();
  const socket = useSocket();
  const { data: conversations } = useConversations();

  socket.on(
    "message",
    async (message: Message, conversation: ConversationData) => {
      if(message?.author === userId) return;
      const conversationId = message?.conversation;

      const hasConversation = conversations?.find(
        ({ id }) => id == conversationId
      );

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
        let spliceIndex;
        for (let i = 0; i < conversation.participants.length - 1; i++) {
          if (conversation.participants[i].id === userId) {
            spliceIndex = i;
          }
        }

        if (spliceIndex) {
          conversation.participants.splice(spliceIndex, 1);
        }

        queryClient.setQueryData(
          queryKeys.GET_CONVERSATIONS,
          (oldData: any) => [conversation, oldData]
        );
      }
    }
  );

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
