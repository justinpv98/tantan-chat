import React from "react";
import { styled } from "@/stitches.config";

// Components
import { Avatar, Box, Flex, Image, Text } from "@/features/ui";
import { GIF } from "@/features/media";

// Hooks
import { useAuth } from "@/hooks";

type Props = {
  message: any;
  showUsername: boolean;
};

type GIF = {};

export default function ChatMessage({ message, showUsername }: Props) {
  const { id } = useAuth();

  function isUser() {
    return message.author.id == id;
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

  function renderAvatar(){
    if(!isUser()){
      if(showUsername){
        return <Avatar src={message.author.profile_picture} />
      } else {
        return <Box css={{width: "2.5rem", height: "2.5rem"}} />;
      }
    } else {
      return null;
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
      <Flex direction="column" css={{gap: "$025"}}>
      {!isUser() && showUsername && <Text weight="bold" css={{marginInline: "3.25rem"}} className={'username'}> {message.author.username}</Text>}
      <Flex css={{gap: "$050"}}>
      {renderAvatar()}
      {renderMessage()}
      </Flex>
      </Flex>
    </MessageContainer>
  );
}

const MessageContainer = styled("li", {
  display: "flex",
  paddingInline: "$150",
  gap: "$050",

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