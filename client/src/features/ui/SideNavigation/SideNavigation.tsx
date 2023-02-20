import React from "react";
import { styled } from "@/stitches.config";


import Box from "../Box/Box";
import Flex from "../Flex/Flex";

type Props = {
  children?: React.ReactNode;
};

export default function SideNavigation({ children }: Props) {

  return (
    <Container>
      <Flex
        justify="evenly"
        css={{
          gap: "$100",
          width: "100%",

          "@lg": {
            justifyContent: "initial",
            flexDirection: "column",
            height: "100%",
            gap: "$050",
            width: "auto",
          },
        }}
      >
        {children}
      </Flex>
    </Container>
  );
}

const Container = styled(Box, {
  position: "fixed",
  zIndex: "$onBase",
  bottom: "$200",
  left: "50%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "$100",
  width: "calc(100% - $150)",
  maxWidth: "23.4375rem",
  padding: "$050 $050",
  borderRadius: "32px",
  transform: "translateX(-50%)",
  background: "$background",
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",

  "@lg": {
    position: "static",
    flexDirection: "column",
    gap: "0",
    height: "100%",
    width: "3.75rem",
    borderRadius: "unset",
    borderRight: "1px solid $sage7",
    transform: "unset",
    boxShadow: "unset",
  },
});
