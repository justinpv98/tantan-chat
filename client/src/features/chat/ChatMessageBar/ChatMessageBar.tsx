import { styled } from "@/stitches.config";

import { Button, Flex, Icon } from "@/features/ui";

type Props = {};

export default function ChatMessageBar({}: Props) {
  return (
    <Flex
      as="section"
      align="center"
      gap={2}
      css={{
        width: "100%",
        maxHeight: "3.75rem",
        background: "$sage1",
        paddingBlock: "$050",
        paddingInline: "$100",
      }}
    >
      <InputContainer>
        <Button css={{ background: "none" }} icon="center" transparent>
          <Icon icon="paper-clip" />
        </Button>
        <Input placeholder="Type a message here..." />
        <Flex gap={1}>
          <Button icon="center" transparent>
            <Icon icon="gif" />
          </Button>
          <Button icon="center" transparent>
            <Icon icon="face-smile" />
          </Button>
        </Flex>
      </InputContainer>
      <Button icon="center" css={{ color: "$sage11" }} transparent>
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
  maxHeight: "3.75rem",
  background: "$sage1",
  paddingBlock: "$050",
  paddingInline: "$100",
});

const InputContainer = styled("div", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  maxHeight: "$225",
  width: "100%",
  borderRadius: "$150",
  backgroundColor: "$sage3",
  color: "$sage11",

  [`& ${Button}`]: {
    "&:hover": {
      background: "none",
    },
  },
});

export const Input = styled("input", {
  width: "100%",
  height: "$200",
  paddingBlock: "0",
  paddingInline: "$075",
  border: "none",
  borderRadius: "$150",
  fontSize: "$100",
  backgroundColor: "$sage3",
  color: "$onBackground",

  "&:focus": {
    outline: "none",
  },
});
