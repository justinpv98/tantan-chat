import React from "react";
import { styled } from "@/stitches.config";

// Hooks
import { useChatMessageBar } from "../hooks";

// Components
import { Box, Button, Flex, Icon } from "@/features/ui";
import { FileUploadButton, EmojiButton, GIFButton } from "@/features/media";

type Props = {
  isRefVisible: boolean;
  observedRef: React.MutableRefObject<HTMLDivElement | null>;
};

export default function ChatMessageBar({ isRefVisible, observedRef }: Props) {
  const {
    autoGrow,
    inputRef,
    message,
    onChange,
    onInput,
    onKeyDownEnter,
    onSubmit,
    setMessage,
    uploadFile,
  } = useChatMessageBar(isRefVisible, observedRef);

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
        <FileUploadButton onChange={uploadFile} />
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
