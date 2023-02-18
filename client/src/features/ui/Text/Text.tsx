import React from "react";
import { styled } from "@/stitches.config";

const Text = styled("p", {
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

export default Text;
