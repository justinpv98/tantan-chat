import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { styled } from "@/stitches.config";

// Hooks
import { useMediaQuery, useSocket } from "@/hooks";
import { useLayout } from "../hooks";
import {
  useCurrentConversation,
  useGetConversation,
} from "@/features/chat/hooks";

// Components
import { Navbar } from "@/features/navigation";
import { Chat, ChatRightMenu } from "@/features/chat";
import Flex from "../Flex/Flex";
import Text from "../Text/Text";

export default function Layout() {
  const { id: conversationId } = useParams();
  const [showRightMenu, setShowRightMenu] = useState(false);
  const isMobile = useMediaQuery("(max-width: 59.99em)");

  const socket = useSocket();
  socket.connect();

  const { showChat } = useLayout();
  const { data: conversationData } = useGetConversation(
    conversationId || "",
    !!conversationId
  );

  function toggleRightMenu() {
    setShowRightMenu(!showRightMenu);
  }


  function renderChat() {
    if (
      (conversationData && !isMobile) ||
      (conversationData && isMobile && showChat)
    ) {
      return <Chat onClickMore={toggleRightMenu} />;
    } else {
      return (
        <ChatFallback>
          <Text size="xl" color="lowContrast" weight="bold">
            Select a chat or find a friend and start a new conversation
          </Text>
        </ChatFallback>
      );
    }
  }

  return (
    <LayoutContainer>
      <Navbar />
      {renderChat()}
      {conversationData && showRightMenu && <ChatRightMenu toggleRightMenu={toggleRightMenu}/>}
    </LayoutContainer>
  );
}

const LayoutContainer = styled("div", {
  position: "relative",
  display: "grid",
  gridTemplateRows: "1fr min-content",
  minHeight: "100vh",

  "@lg": {
    display: "flex",
  },
});

const ChatFallback = styled("main", {
  display: "none",
  background: "$sage4",
  color: "$sage11",
  width: "100%",

  "@lg": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
