import { styled } from "@/stitches.config";

// Hooks
import { useParams } from "react-router-dom";
import { useTheme } from "@/hooks";
import { useGetTarget, useGetConversations } from "../hooks";

// Components
import { Avatar, Box, Button, Flex, Heading, Icon } from "@/features/ui";
import { useEffect } from "react";

type Props = {
  onClickMore: () => void;
};

export default function ChatInfo({ onClickMore }: Props) {
  const {id} = useParams();
  const target = useGetTarget();
  const { theme } = useTheme();
  const {data, dataUpdatedAt} = useGetConversations()

  useEffect(() => {
    const convoIndex = data?.findIndex((obj) => obj.id === Number(id)) || 0
    if(target && data && convoIndex > 0){
      target.status = data[convoIndex].participants[0].status;
    }

  }, [dataUpdatedAt]);

  const themePreference = theme
    ? "dark" && {
        boxShadow: "none",
        borderBottom: "1px solid $sage7",
      }
    : undefined;

  return (
    <Container as="header" css={themePreference}>
      <Flex align="center">
        <Avatar
          size="md"
          status={target?.status}
          showStatus={!!target?.status}
        />
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
