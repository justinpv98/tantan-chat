import { styled } from "@/stitches.config";

// Hooks
import { useGetTarget } from "@/features/chat/hooks";
import { useGetRelationships } from "@/features/friends/hooks";

// Components
import { Avatar, Button, Flex, Icon, Sidebar } from "@/features/ui";
import { FriendMenuAction } from "@/features/friends";
import { GroupAvatarMenuAction } from "@/features/chat";

type Props = {
  toggleRightMenu: () => void;
};
export default function ChatRightMenu({ toggleRightMenu }: Props) {
  const { data: conversation, target } = useGetTarget();
  const { data: relationships } = useGetRelationships(false);

  return (
    <Sidebar
      title={conversation?.type == 1 ? target?.username : conversation?.name}
      titleAlignment="center"
      css={{ zIndex: 200 }}
    >
      <ArrowButton
        icon="center"
        transparent
        css={{ color: "$sage11" }}
        onClick={toggleRightMenu}
      >
        <Icon icon="arrow-left" />
      </ArrowButton>
      <Flex
        direction="column"
        align="center"
        css={{ width: "100%", paddingInline: "$050" }}
      >
        <Avatar size="lg" src={conversation?.avatar || ""} css={{ marginBlock: "$100" }} />

        <Flex direction="column" css={{ width: "100%" }}>
          {conversation?.type == 1 && <FriendMenuAction />}
          {conversation?.type == 2 && <GroupAvatarMenuAction />}
        </Flex>
      </Flex>
    </Sidebar>
  );
}

export const Container = styled("div", {
  width: "100%",
  py: "$075",
  backgroundColor: "$sage1",
  borderLeft: "1px solid $sage7",
  background: "$background",

  "@lg": {
    position: "relative",
    zIndex: "$onBase",
    minWidth: "20rem",
    maxWidth: "20rem",
    minHeight: "100vh",
  },
});

const ArrowButton = styled(Button, {
  position: "absolute",
  left: "0",
  top: ".5rem",

  "@lg": {
    display: "none",
  },
});
