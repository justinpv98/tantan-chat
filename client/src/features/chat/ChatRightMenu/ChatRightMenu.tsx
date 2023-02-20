import React from "react";
import { styled } from "@/stitches.config";

import { Flex, Heading, Sidebar } from "@/features/ui";

type Props = {};

export default function ChatRightMenu({}: Props) {
  return (
    <Sidebar title="Name" titleAlignment="center" aria-live="polite">
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
