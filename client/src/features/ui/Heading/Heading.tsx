import { styled } from "@/stitches.config";
import { VariantProps, CSS } from "@stitches/react";


import React from 'react'

type HeadingSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | undefined

export type HeadingProps = {
  align?: VariantProps<typeof _Heading>['align'];
  as?: HeadingSize;
  children?: React.ReactNode;
  css?: CSS;
  size?: HeadingSize;
}

export default function Heading({as, align, children, css, size, ...rest}: HeadingProps) {
  const headingSize: HeadingSize = size ? size : as;
  return (
    <_Heading as={as} align={align} css={css} size={headingSize} {...rest}>{children}</_Heading>
  )
}
const _Heading = styled("h3", {
  color: "$onBackground",
  variants: {
    align: {
      start: { textAlign: "start" },
      end: { textAlign: "end" },
      center: { textAlign: "center" },
      forceLeft: { textAlign: "left" },
      forceRight: { textAlign: "right" },
    },
    size: {
      h1: { fontSize: "$200" },
      h2: { fontSize: "$175" },
      h3: { fontSize: "$150" },
      h4: { fontSize: "$125" },
      h5: { fontSize: "$112" },
      h6: { fontSize: "$100" },
    },
    italic: {
      true: { fontStyle: "italic" },
      false: {},
    },
    underline: {
      true: { textDecoration: "underline" },
      false: {},
    },
    weight: {
      regular: { fontWeight: "$regular" },
      medium: { fontWeight: "$medium" },
      bold: { fontWeight: "$bold" },
    },
  },
});
