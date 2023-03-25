import React from "react";
import { useNavigate } from "react-router-dom";

// Types
import { ConversationData } from "@/features/chat/hooks/useGetConversations/useGetConversations";

// Hooks
import { useLayout } from "@/features/ui/hooks";
import { useCurrentConversation, useGetConversations } from "@/features/chat/hooks";

// Components
import { Avatar, Flex, Text } from "@/features/ui";

type Props = {
  conversation: ConversationData;
};

export default function ConversationItem({ conversation }: Props) {
  const navigate = useNavigate();
  const { setCurrentConversation } = useGetConversations(false);
  const {setShowChat } = useLayout();

  function onClick() {
    setCurrentConversation(conversation);
    navigate(`/c/${conversation.id}`);
    setShowChat(true)
  }

  if (conversation.type === 1) {
    const { username, status } = conversation.participants[0];
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
        <Avatar size="md" status={status} showStatus/>
        <Text weight="semibold">{username}</Text>
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
        <Avatar size="md" src={conversation.avatar || undefined} showStatus={conversation.type !== 2}/>
        <Text weight="semibold" overflow="ellipsis">{conversation.name}</Text>
      </Flex>
    );
  }
}
