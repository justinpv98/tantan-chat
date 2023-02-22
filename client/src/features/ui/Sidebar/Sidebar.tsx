import React from "react";
import { styled } from "@/stitches.config";
import { CSS } from "@stitches/react";

import { HeadingProps } from "../Heading/Heading";

import Heading from "../Heading/Heading";

type Props = {
  children?: React.ReactNode;
  css: CSS;
  title?: string;
  titleAlignment?: HeadingProps["align"];
};

export default function Sidebar({
  children,
  css,
  title,
  titleAlignment = "start",
  ...rest
}: Props) {
  return (
    <Container css={css} {...rest}>
      <Heading as="h2" size="h3" align={titleAlignment} css={{ px: "$200" }}>
        {title}
      </Heading>
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

  "@lg": {
    position: "relative",
    zIndex: "$onBase",
    minWidth: "20rem",
    maxWidth: "20rem",
    minHeight: "100vh",
  },
});
