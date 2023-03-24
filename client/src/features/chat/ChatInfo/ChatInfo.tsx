import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { styled } from "@/stitches.config";

// Constants
import queryKeys from "@/constants/queryKeys";
import socketEvents from "@/constants/socketEvents";

// Hooks
import { useAuth, useSocket, useTheme } from "@/hooks";
import { useGetTarget, useGetConversations } from "../hooks";

// Components
import { Avatar, Box, Button, Flex, Heading, Icon } from "@/features/ui";

type Props = {
  onClickMore: () => void;
};

export default function ChatInfo({ onClickMore }: Props) {
  const { id: userId } = useAuth();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const socket = useSocket();
  const [conversationName, setConversationName] = useState<
    string | null | undefined
  >("");
  const { data: conversation, target } = useGetTarget();
  const { theme } = useTheme();
  const { data: conversations, dataUpdatedAt } = useGetConversations();

  useEffect(() => {
    if (conversation?.type != 1) {
      setConversationName(conversation?.name);
    }
  }, [id, conversation?.name]);

  useEffect(() => {
    socket.on(socketEvents.CHANGE_CONVERSATION_NAME, changeName);

    return () => {
      socket.off(socketEvents.CHANGE_CONVERSATION_NAME, changeName);
    };
  });

  useEffect(() => {
    const convoIndex =
      conversations?.findIndex((obj) => obj.id === Number(id)) || 0;
    if (
      target &&
      !conversation?.participants &&
      conversations &&
      convoIndex > 0
    ) {
      target.status = conversations[convoIndex].participants[0].status;
    }
  }, [dataUpdatedAt]);

  function changeName(name: string) {
    setConversationName(name);

    queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, (oldData: any) => {
      const data = [...oldData];
      const currentConversation = data.find(
        (conversation) => String(conversation.id) == id
      );
      currentConversation.name = conversationName;
      const filteredData = data.filter(
        (conversation) => conversation.id !== id
      );
      return [currentConversation, ...filteredData];
    });
  }

  function onConversationNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setConversationName(e.target.value);
  }

  function onConversationNameBlur(e: React.FocusEvent<HTMLInputElement>) {
    socket.emit("changeConversationName", {
      conversationId: id,
      name: conversationName,
    });
  }
  const themePreference =
    theme === "dark"
      ? {
          boxShadow: "none",
          borderBottom: "1px solid $sage7",
        }
      : undefined;

  return (
    <Container as="header" css={themePreference}>
      <Flex align="center">
        <Avatar
          size="md"
          src={
            conversation?.type == 2
              ? conversation?.avatar
              : target?.profile_picture
          }
          status={conversation?.type == 1 ? target?.status : undefined}
          showStatus={conversation?.type == 1 && !!target?.status}
        />
        <Flex
          direction="column"
          css={{ position: "relative", marginLeft: "$050" }}
        >
          <ConversationName color="text" as="h1" size="h6">
            {conversation?.type == 1 ? target?.username : conversationName}
          </ConversationName>
          {conversation?.type == 2 && conversation.owner == userId && (
            <DMInput
              maxLength={64}
              value={conversationName || ""}
              onBlur={onConversationNameBlur}
              onChange={onConversationNameChange}
            />
          )}
        </Flex>
      </Flex>
      <Box css={{ color: "$sage11" }}>
        <Button icon="center" transparent>
          <Icon icon="phone" />
        </Button>
        <Button icon="center" transparent>
          <Icon icon="video-camera" />
        </Button>
        <Button icon="center" transparent onClick={onClickMore}>
          <Icon icon="ellipsis-vertical" />
        </Button>
      </Box>
    </Container>
  );
}

const Container = styled(Box, {
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  minHeight: "3rem",
  background: "$sage1",
  paddingBlock: "$075",
  paddingInline: "$100",
  boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
});

const ConversationName = styled(Heading, {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "15.5rem",
  fontSize: "1rem",
  color: "$onBackground",
  marginLeft: "$025"
});

const DMInput = styled("input", {
  background: "$background",
  border: "none",
  borderRadius: "$025",
  color: "$onBackground",
  fontSize: "$100",
  fontFamily: "inherit",
  padding: "$025 $025",
  position: "absolute",
  top: "-$025",
  fontWeight: "$bold",
  minWidth: "15.5rem",
  textOverflow: "ellipsis",
  overflow: "hidden",

  "&:hover": {
    outline: "1px solid $sage7",
  },
});
