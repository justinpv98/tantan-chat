import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { styled } from "@/stitches.config";

// Hooks
import { useAuth, useSocket, useThrottle } from "@/hooks";

import { useGetConversation } from "@/features/chat/hooks";

import { useUpdateConversations } from "@/features/chat/hooks/useGetConversations/useGetConversations";

// Components
import { Button, Flex, Icon } from "@/features/ui";
import { EmojiButton, GIFButton } from "@/features/media";

type Props = {
  isRefVisible: boolean;
  observedRef: React.MutableRefObject<HTMLDivElement | null>;
};

export default function ChatMessageBar({ isRefVisible, observedRef }: Props) {
  const initialState = {
    author: "",
    conversation: "",
    data: "",
  };

  const updateConversations = useUpdateConversations();
  const [message, setMessage] = useState(initialState);

  const { id: targetId } = useParams();
  const { data } = useGetConversation(targetId || "", false);

  const { id: userId } = useAuth();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const socket = useSocket();

  const throttle = useThrottle();

  useEffect(() => {
    setMessage(initialState);
    autoGrow(inputRef?.current);
    observedRef?.current?.scrollIntoView();
  }, [targetId]);

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    throttle(() => socket.emit("typing", data?.id));
    setMessage({
      ...message,
      data: e.target.value,
    });
  }

  function onInput() {
    autoGrow(inputRef?.current);
    if (isRefVisible && observedRef?.current) {
      observedRef.current.scrollIntoView();
    }
  }

  function onKeyDownEnter(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      onSubmit(e);
    }
  }

  function onSubmit(
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();

    if (message.data) {
      let imageData;
      socket.emit("message", {
        ...message,
        author: userId,
        conversation: data?.id,
        data: message.data.trim(),
        file: imageData,
      });
      setMessage(initialState);

      if (inputRef?.current) {
        autoGrow(inputRef.current, true);
      }

      observedRef?.current?.scrollIntoView();

      if (data) {
        updateConversations(data);
      }
    }
  }

  function autoGrow(target: any, reset: boolean = false) {
    target.style.height = "100%";
    target.style.height = target.scrollHeight - 22 + "px";

    if (reset) {
      target.style.height = "3rem";
    }
  }

  return (
    <Flex
      as="section"
      align="start"
      gap={2}
      css={{
        width: "100%",
        background: "$sage1",
        paddingBlock: "$050",
        paddingInline: "$1002",
        zIndex: 1,
      }}
    >
      <InputContainer>
        <Button css={{ background: "none" }} icon="center" transparent>
          <Icon icon="paper-clip" />
        </Button>
        <form
          style={{ width: "100%" }}
          onSubmit={(e) => onSubmit(e)}
          onKeyDown={onKeyDownEnter}
        >
          <Input
            placeholder="Type a message here..."
            ref={inputRef}
            value={message.data}
            onChange={onChange}
            onInput={onInput}
          />
        </form>
        <Flex gap={1}>
          <GIFButton />
            <EmojiButton setMessage={setMessage} />
        </Flex>
      </InputContainer>
      <Button
        icon="center"
        css={{ color: "$sage11" }}
        transparent
        onClick={(e) => onSubmit(e)}
      >
        <Icon icon="paper-airplane" />
      </Button>
    </Flex>
  );
}

export const Container = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$050",
  width: "100%",
  maxHeight: "$225",
  background: "$sage1",
  paddingBlock: "$050",
  paddingInline: "$100",
});

const InputContainer = styled("div", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  height: "100%",
  maxHeight: "50vh",
  width: "100%",
  borderRadius: "$150",
  backgroundColor: "$sage4",
  color: "$sage11",
  marginLeft: "$100",
  paddingLeft: "$075",

  [`& ${Button}`]: {
    "&:hover": {
      background: "none",
    },
  },
});

export const Input = styled("textarea", {
  width: "100%",
  maxHeight: "50vh",
  paddingBlock: "$087",
  paddingInline: "$075",
  border: "none",
  borderRadius: "$150",
  font: "inherit",
  fontSize: "$100",
  backgroundColor: "$sage4",
  color: "$onBackground",
  whiteSpace: "pre-line",
  resize: "none",

  "&:focus": {
    outline: "none",
  },
});
