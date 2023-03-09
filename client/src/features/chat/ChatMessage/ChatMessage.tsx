import React from "react";
import { styled } from "@/stitches.config";

// Hooks
import { useAuth } from "@/hooks";

type Props = {
  message: any;
};

export default function ChatMessage({ message }: Props) {
  const { id } = useAuth();

  function isUser() {
    return message.author === id;
  }

  // Aria-setsize to alert the browser that the number of list items
  // are unknown
  return (
    <MessageContainer aria-setsize={-1} isUser={isUser()} className={!isUser() ? "user" : ""}>
      <Message isUser={isUser()}>{message.data}</Message>
    </MessageContainer>
  );
}

const MessageContainer = styled("li", {
  display: "flex",
  paddingInline: "$150",

  variants: {
    isUser: {
      true: {
        justifyContent: "flex-end",
        "&:not(:has(+ :not(.user)))": {
          marginBottom: "$050"
        },
      },
      false: {
        justifyContent: "flex-start",
        "&:not(:has(+ .user))": {
          marginBottom: "$050"
        },
      },
    },
  },
});

const Message = styled("p", {
  whiteSpace: "pre-line",
  borderRadius: "$050",
  padding: "$050 $075",
  maxWidth: "30rem",
  overflowWrap: "break-word",

  variants:{
    isUser:{
      true:{
        background: "$primary",
        color: "$onPrimary"
      },
      false: {
        background: "$sage4",
        color: "$onBackground"
      }
    }
  }
});
