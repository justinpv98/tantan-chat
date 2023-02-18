import { styled } from "@/stitches.config";


import React from 'react'

type HeadingSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | undefined

type Props = {
  as?: HeadingSize;
  children?: React.ReactNode;
  size?: HeadingSize;
}

export default function Heading({as, children, size, ...rest}: Props) {
  const headingSize: HeadingSize = size ? size : as;
  return (
    <_Heading as={as} size={headingSize} {...rest}>{children}</_Heading>
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
