import React from "react";
import { CSS } from "@stitches/react";
import { styled } from "@/stitches.config";
import { Link as RouterLink } from "react-router-dom";
import Text from "../Text/Text";

type Props = {
  children?: React.ReactNode;
  css?: CSS;
  external?: boolean;
  to: string;
};

export default function Link({ children, css, external, to, ...rest }: Props) {
  const linkType = external ? "a" : RouterLink;
  return (
    <_Link
      as={linkType}
      css={css}
      target={external ? "blank" : undefined}
      href={external ? to : undefined}
      to={!external ? to : undefined}
      {...rest}
    >
      {children}
    </_Link>
  );
}

const _Link = styled(Text, {
  variants: {
    color: {
      primary: {
        color: "$green11",

        "&:hover": {
          color: "$green10",
        },
      },
    },
  },

  defaultVariants: {
    color: "primary",
  },
});
