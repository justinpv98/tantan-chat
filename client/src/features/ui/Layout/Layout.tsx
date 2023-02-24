import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { styled } from "@/stitches.config";

// Hooks
import { useAuth, useCreateConversation, useGetConversation } from "@/hooks";

// Components
import { Navbar } from "@/features/navigation";
import { Chat, ChatRightMenu } from "@/features/chat";
import Flex from "../Flex/Flex";
import Text from "../Text/Text";


export default function Layout() {
  const { id: targetId } = useParams();
  const [showRightMenu, setShowRightMenu] = useState(false);

  function toggleRightMenu() {
    setShowRightMenu(!showRightMenu);
  }

  const { id: userId } = useAuth();
  const { data: conversationId } = useCreateConversation(
    targetId || "",
    !!targetId
  );
  const { data: conversationData } = useGetConversation(
    conversationId,
    !!conversationId
  );

  let chatInfo;
  if (conversationData?.type === "dm") {
    chatInfo = conversationData.participants.filter(
      (participant) => participant.id !== userId
    )[0];
  }

  return (
    <LayoutContainer>
      <Navbar />
      {conversationData ? (
        <Chat info={chatInfo} onClickMore={toggleRightMenu} />
      ) : (
        <Flex
          as="main"
          justify="center"
          align="center"
          css={{ background: "$sage3", color: "$sage11", width: "100%" }}
        >
          <Text size="xl" color="lowContrast" weight="bold">
            Select a chat or find a friend and start a new conversation
          </Text>
        </Flex>
      )}
      {conversationData && showRightMenu && <ChatRightMenu info={chatInfo} />}
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

const ChatFallback = styled("div", {
  background: "$sage3",
  color: "$sage11",
});
