import { Fragment } from "react";
import { styled } from "@/stitches.config";

// Hooks
import { useAuth } from "@/hooks";
import { useGetTarget } from "@/features/chat/hooks";
import { useGetRelationships } from "@/features/friends/hooks";

// Components
import { Avatar, Button, Flex, Heading, Icon, Sidebar } from "@/features/ui";
import { FriendMenuAction } from "@/features/friends";
import { GroupAvatarMenuAction } from "@/features/chat";
import { UserItem } from "@/features/navigation";

type Props = {
  toggleRightMenu: () => void;
};
export default function ChatRightMenu({ toggleRightMenu }: Props) {
  const { id: userId } = useAuth();
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
        <Avatar
          size="lg"
          src={conversation?.avatar || ""}
          css={{ marginBlock: "$100" }}
        />

        <Flex direction="column" css={{ width: "100%", paddingInline: "$025" }}>
          {conversation?.type == 1 && <FriendMenuAction />}
          {conversation?.type == 2 && <GroupAvatarMenuAction />}
          {conversation?.type == 2 && (
            <Fragment>
              <Heading css={{ paddingInline: "$050" }} size="h4" as="h4">
                Group Members
              </Heading>
              {conversation?.participants
                .filter((participant) => participant.id != userId)
                .map((participant) => (
                  <UserItem key={participant.id} user={participant} />
                ))}
            </Fragment>
          )}
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
