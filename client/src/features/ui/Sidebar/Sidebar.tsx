import React from "react";
import { styled } from "@/stitches.config";
import { CSS } from "@stitches/react";

// Types
import { HeadingProps } from "../Heading/Heading";

// Components
import Box from "../Box/Box";
import Flex from "../Flex/Flex";
import Heading from "../Heading/Heading";

type Props = {
  action?: React.ReactNode;
  children?: React.ReactNode;
  css?: CSS;
  title?: string;
  titleAlignment?: HeadingProps["align"];
};

export default function Sidebar({
  action,
  children,
  css,
  title,
  titleAlignment = "start",
  ...rest
}: Props) {
  return (
    <Container css={css} {...rest}>
      <Flex
        css={{ padding: titleAlignment === "center" ? "0 $200 0 $200" : "0 $100 0 $200", maxHeight: "1.875rem"}}
        justify="between"
        align="center"
      >
        <Heading
          as="h2"
          size="h3"
          align={titleAlignment}
          css={{ width: action ? "auto" : "100%" }}
        >
          {title}
        </Heading>
        {action && <Box>{action}</Box>}
      </Flex>
      {children}
    </Container>
  );
}

export const Container = styled("section", {
  width: "100%",
  py: "$075",
  backgroundColor: "$sage1",
  borderLeft: "1px solid $sage7",
  borderRight: "1px solid $sage7",
  background: "$background",
  oveflow: "scroll",

  "@lg": {
    position: "relative",
    zIndex: "$onBase",
    minWidth: "20rem",
    maxWidth: "20rem",
    minHeight: "100vh",
  },
});
