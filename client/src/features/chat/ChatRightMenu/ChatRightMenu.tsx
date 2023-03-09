import { styled } from "@/stitches.config";

// Hooks
import { useGetTarget } from "@/hooks";

// Components
import { Avatar, Flex, Sidebar } from "@/features/ui";



export default function ChatRightMenu() {
  const target = useGetTarget();
  return (
    <Sidebar title={target?.username} titleAlignment="center" aria-live="polite">
      <Flex
        direction="column"
        align="center"
        css={{ width: "100%", paddingInline: "$100" }}
      >
        <Avatar size="lg" css={{marginTop: "1rem"}} />

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
