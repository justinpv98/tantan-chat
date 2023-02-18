import React, { forwardRef } from "react";
import { styled } from "@/stitches.config";

import { CSS } from "@stitches/react";

type Props = {
  as?: React.ElementType;

  children?: React.ReactNode;
  css?: CSS;
};

// Reference: https://github.com/kripod/react-polymorphic-box/blob/main/src/Box.tsx

type BoxProps<C extends React.ElementType = React.ElementType> = Props;
type BoxComponent<C extends React.ElementType> = BoxProps &
  Omit<React.ComponentProps<C>, keyof BoxProps>;

const defaultElement = "div";

const Box: <C extends React.ElementType = typeof defaultElement>(
  props: BoxComponent<C>
) => JSX.Element | null = forwardRef(function Box(
  { as, css, children, ...rest }: BoxProps,
  ref: React.Ref<Element>
) {
  return (
    <_Box as={as} css={css} ref={ref} {...rest}>
      {children}
    </_Box>
  );
});

const _Box = styled("div", {});


//@ts-ignore
Box.displayName = "Box";

export default Box;