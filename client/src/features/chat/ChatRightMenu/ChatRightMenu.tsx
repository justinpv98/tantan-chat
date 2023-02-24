import { styled } from "@/stitches.config";

// Types
import { Participant } from "@/hooks/useGetConversation/useGetConversation";

// Components
import { Flex, Sidebar } from "@/features/ui";


type Props = {
  info?: Participant;
};

export default function ChatRightMenu({ info }: Props) {
  return (
    <Sidebar title={info?.username} titleAlignment="center" aria-live="polite">
      <Flex
        direction="column"
        align="center"
        css={{ width: "100%", paddingInline: "$100" }}
      ></Flex>
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
