import React from "react";
import { styled } from "@/stitches.config";
import { useNavigate } from "react-router-dom";

// Types
import { ConversationData } from "@/features/chat/hooks/useGetConversations/useGetConversations";

// Hooks
import { useLayout } from "@/features/ui/hooks";
import { useGetConversations } from "@/features/chat/hooks";

// Components
import { Avatar, Box, Flex, Text } from "@/features/ui";

type Props = {
  conversation: ConversationData;
};

export default function ConversationItem({ conversation }: Props) {
  const navigate = useNavigate();
  const { setCurrentConversation } = useGetConversations(false);
  const { setShowChat } = useLayout();

  function onClick() {
    setCurrentConversation(conversation);
    navigate(`/c/${conversation.id}`);
    setShowChat(true);
  }

  if (conversation.type === 1) {
    const { username, status, profile_picture } = conversation.participants[0];
    return (
      <Flex
        justify="between"
        align="center"
        onClick={onClick}
        css={{
          borderRadius: "$050",
          cursor: "pointer",
          width: "100%",
          paddingBlock: "$050",
          paddingInline: "$050",
          "&:hover": {
            background: "$sage4",
            "& .avatar-status ": { outlineColor: "$sage4" },
          },
        }}
      >
        <Flex align="center" css={{ gap: "$050" }}>
          <Avatar size="md" status={status} src={profile_picture || ""} showStatus />
          <Text weight="semibold" overflow="ellipsis">
            {username}
          </Text>
        </Flex>

        {conversation.unread_count > 0  &&  <UnreadMessageCounter>{conversation.unread_count < 9 ? conversation.unread_count : "9+"}</UnreadMessageCounter>}
      </Flex>
    );
  } else {
    return (
      <Flex
        align="center"
        onClick={onClick}
        css={{
          borderRadius: "$050",
          cursor: "pointer",
          gap: "$050",
          width: "100%",
          paddingBlock: "$050",
          paddingInline: "$050",
          "&:hover": {
            background: "$sage4",
            "& .avatar-status ": { outlineColor: "$sage4" },
          },
        }}
      >
        <Avatar
          size="md"
          src={conversation.avatar || undefined}
          showStatus={conversation.type !== 2}
        />
        <Text weight="semibold" overflow="ellipsis">
          {conversation.name}
        </Text>
        {conversation.unread_count > 0  &&  <UnreadMessageCounter>{conversation.unread_count < 9 ? conversation.unread_count : "9+"}</UnreadMessageCounter>}
      </Flex>
    );
  }
}

const UnreadMessageCounter = styled("div", {
  borderRadius: "$round",
  background: "$primary",
  color: "$onPrimary",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "$087",
  fontWeight: "$bold",
maxWidth: "$150",
maxHeight: "$150",
  aspectRatio: 1,
  paddingBottom: "$012",
  paddingLeft: "0.5px",
  width: "22px"

});
