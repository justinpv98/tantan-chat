import { styled } from "@/stitches.config";

// Hooks
import { useCurrentConversation, useChatInfo } from "../hooks";
import { useLayout } from "@/features/ui/hooks";

// Components
import { Avatar, Box, Button, Flex, Heading, Icon } from "@/features/ui";

type Props = {
  onClickMore: () => void;
};

export default function ChatInfo({ onClickMore }: Props) {
  const {
    conversation,
    conversationName,
    target,
    userId,
    onConversationNameBlur,
    onConversationNameChange,
    themePreference,
  } = useChatInfo();
  const {setShowChat} = useLayout();

  return (
    <Container as="header" css={themePreference}>
      <ArrowButton icon="center" transparent css={{ color: "$sage11" }} onClick={() => setShowChat(false)}>
        <Icon icon="arrow-left" />
      </ArrowButton>
      <NameContainer>
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
              defaultValue={conversationName || ""}
              onBlur={onConversationNameBlur}
              onChange={onConversationNameChange}
            />
          )}
        </Flex>
      </NameContainer>
      <Box css={{ color: "$sage11" }}>
        <Button icon="center" transparent onClick={onClickMore}>
          <Icon icon="ellipsis-vertical" />
        </Button>
      </Box>
    </Container>
  );
}

const ArrowButton = styled(Button, {
  position: "absolute",
  left: "0",

  "@lg": {
    display: "none",
  },
});

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

const NameContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  paddingLeft: "$175",

  "@lg": {
    paddingLeft: "0",
  },
});

const ConversationName = styled(Heading, {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "clamp(3.5rem, 2vw, 15.5rem)",
  fontSize: "1rem",
  color: "$onBackground",
  marginLeft: "$025",

  "@lg": {
    maxWidth: "15.5rem"
  }
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
  textOverflow: "ellipsis",
  overflow: "hidden",
  maxWidth: "clamp(3.5rem, 22.5vw, 15.5rem)",

  "&:hover": {
    outline: "1px solid $sage7",
  },

  "@lg": {
    minWidth: "15.5rem",
    maxWidth: "auto",
  },
});
