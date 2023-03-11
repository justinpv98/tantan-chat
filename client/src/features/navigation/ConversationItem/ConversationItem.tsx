import React from "react";
import { useNavigate } from "react-router-dom";

// Types
import { ConversationData } from "@/pages/Home/hooks/useConversations";

// Hooks
import { useConversations } from "@/pages/Home/hooks";

// Components
import { Avatar, Box, Flex, Text } from "@/features/ui";

type Props = {
  conversation: ConversationData;
};

export default function ConversationItem({ conversation }: Props) {
  const navigate = useNavigate();
  const { setCurrentConversation } = useConversations(false);

  function onClick() {
    setCurrentConversation(conversation);
    navigate(`/c/${conversation.id}`);
  }

  if (conversation.type === 1) {
    const { username } = conversation.participants[0];
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
        <Avatar size="md" showStatus />
        <Text weight="medium">{username}</Text>
      </Flex>
    );
  } else {
    return <Flex></Flex>;
  }
}
