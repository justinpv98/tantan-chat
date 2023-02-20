import React from "react";
import { styled } from "@/stitches.config";

import Avatar from "../Avatar/Avatar";
import Box from "../Box/Box";
import Flex from "../Flex/Flex";
import { Navbar } from "@/features/navigation";

type Props = {};

export default function Layout({}: Props) {
  return (
    <LayoutContainer>
      <Navbar />
      <Flex direction="column"></Flex>
    </LayoutContainer>
  );
}

const LayoutContainer = styled("div", {
  position: "relative",
  display: "grid",
  gridTemplateRows: "1fr min-content",
  minHeight: "100vh",

  "@lg": {
    display: "flex",
  },
});
