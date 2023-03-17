import React from "react";
import { CSS, VariantProps } from "@stitches/react";
import { styled } from "@/stitches.config";

export const _Text = styled("p", {
  color: "$onBackground",
  variants: {
    align: {
      start: { textAlign: "start" },
      end: { textAlign: "end" },
      center: { textAlign: "center" },
      forceLeft: { textAlign: "left" },
      forceRight: { textAlign: "right" },
    },
    color: {
      error: { color: "$red11" },
      lowContrast: { color: "$sage11" },
      text: { color: "$onBackground" },
    },
    italic: {
      true: { fontStyle: "italic" },
      false: {},
    },
    size: {
      xs: { fontSize: "$075" },
      sm: { fontSize: "$087" },
      md: { fontSize: "$100" },
      lg: { fontSize: "$112" },
      xl: { fontSize: "$125" },
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

type Props = {
  align?:  VariantProps<typeof _Text>["align"]
  color?:  VariantProps<typeof _Text>["color"]
  css?: CSS;
  children?: React.ReactNode;
  htmlFor?: string;
  inline?: boolean;
  italic?: boolean;
  size?:  VariantProps<typeof _Text>["size"];
  underline?: boolean;
  weight?: VariantProps<typeof _Text>["weight"]
};

 function Text({ children, color, inline, ...rest }: Props) {
  return <_Text as={inline ? "span" : "p"} color={color} {...rest}>{children}</_Text>;
}

export default Text;
