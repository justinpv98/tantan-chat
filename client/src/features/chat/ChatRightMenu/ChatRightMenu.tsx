import { styled } from "@/stitches.config";

// Hooks
import { useAuth } from "@/hooks";
import { useGetTarget } from "@/features/chat/hooks";
import {
  useGetRelationships,

} from "@/features/friends/hooks";

// Components
import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Sidebar,
  Text,
} from "@/features/ui";
import { FriendMenuAction } from "@/features/navigation";

export default function ChatRightMenu() {

  const target = useGetTarget();
  const { data: relationships } = useGetRelationships(false);




  return (
    <Sidebar
      title={target?.username}
      titleAlignment="center"
    >
      <Flex
        direction="column"
        align="center"
        css={{ width: "100%", paddingInline: "$050" }}
      >
           <Avatar size="lg" css={{ marginBlock: "$100" }} />
       
        <Flex direction="column" css={{ width: "100%" }}>
          <FriendMenuAction />
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
