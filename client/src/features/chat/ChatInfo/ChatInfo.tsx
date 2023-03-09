import { styled } from "@/stitches.config";

// Hooks
import { useGetTarget } from "@/hooks";

// Components
import { Avatar, Box, Button, Flex, Heading, Icon } from "@/features/ui";

type Props = {
  onClickMore: () => void;
};

export default function ChatInfo({ onClickMore }: Props) {
  const target = useGetTarget();

  return (
    <Container as="header">
      <Flex align="center">
        <Avatar size={250} />
        <Flex direction="column" css={{ marginLeft: "$050" }}>
          <Heading as="h1" size="h6">
            {target && target.username}
          </Heading>
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
