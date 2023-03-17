import React from "react";
import { styled } from "@/stitches.config";

// Components
import { Image } from "@/features/ui";
import { GIF } from "@/features/media";

// Hooks
import { useAuth } from "@/hooks";

type Props = {
  message: any;
};

type GIF = {};

export default function ChatMessage({ message }: Props) {
  const { id } = useAuth();

  function isUser() {
    return message.author === id;
  }

  function renderMessage() {
    switch (message.type) {
      case 1:
        return <Message isUser={isUser()}>{message.data}</Message>;
      case 2:
        return <GIF result={message} />;
      case 3:
        return (
          <ImageContainer>
            <Image
            css={{borderRadius: "$050"}}
            src={message.media_url || ""}
            alt={message.description || "image"}
          />
          </ImageContainer>
          
        );
      default:
        break;
    }
  }

  // Aria-setsize to alert the browser that the number of list items
  // are unknown
  return (
    <MessageContainer
      aria-setsize={-1}
      isUser={isUser()}
      className={!isUser() ? "user" : ""}
    >
      {renderMessage()}
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
          marginBottom: "$050",
        },
      },
      false: {
        justifyContent: "flex-start",
        "&:not(:has(+ .user))": {
          marginBottom: "$050",
        },
      },
    },
  },
});

const Message = styled("p", {
  whiteSpace: "pre-line",
  borderRadius: "$050",
  padding: "$050 $075",
  maxWidth: "clamp(15rem, 50vw, 30rem)",
  overflowWrap: "break-word",

  "@md": {
    maxWidth: "30rem",
  },

  variants: {
    isUser: {
      true: {
        background: "$primary",
        color: "$onPrimary",
      },
      false: {
        background: "$sage4",
        color: "$onBackground",
      },
    },
  },
});

const ImageContainer = styled('div', {
  maxHeight: "320px",
  maxWidth: "300px",
})