import { createStitches } from "@stitches/react";
import type { PropertyValue } from "@stitches/react";
import * as tokens from "./constants/designTokens";

export type MediaBreakpoints =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "motion"
  | "highContrast";

export type Spaces =
  | "$025"
  | "$050"
  | "$075"
  | "$087"
  | "$100"
  | "$112"
  | "$125"
  | "$150"
  | "$175"
  | "$200"
  | "$225"
  | "$250"
  | "$275"
  | "$300"
  | "$350"
  | "$400"
  | "$450"
  | "$500";

export const { styled, css, globalCss, theme, createTheme } = createStitches({
  theme: {
    colors: {
      ...tokens.theme,
      ...tokens.colors,
    },
    shadows: tokens.shadows,
    sizes: tokens.sizes,
    space: tokens.spaces,
    radii: tokens.radii,
    fonts: {
      plusjakarta: "Plus Jakarta Sans, sans-serif",
    },
    fontSizes: tokens.fontSizes,
    fontWeights: tokens.fontWeights,
    lineHeights: tokens.lineHeights,
    transitions: {
      allFast: "all $fast $inOut",
      fast: "0.2s",
      normal: "0.3s",
      inOut: "cubic-bezier(.4, 0, .2, 1)",
    },
    borderStyles: {},
    borderWidths: {},
    letterSpacings: {},
    zIndices: tokens.zIndices,
  },
  media: {
    sm: `(min-width: ${tokens.breakpoints.sm})`,
    md: `(min-width: ${tokens.breakpoints.md})`,
    lg: `(min-width: ${tokens.breakpoints.lg})`,
    xl: `(min-width: ${tokens.breakpoints.xl})`,
    motion: "(prefers-reduced-motion)",
    highContrast: "(forced-colors: active)",
  },
  utils: {
    px: (value: PropertyValue<"padding">) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: PropertyValue<"padding">) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    my: (value: PropertyValue<"margin">) => ({
      marginTop: value,
      marginBottom: value,
    }),
    mx: (value: PropertyValue<"margin">) => ({
      marginLeft: value,
      marginRight: value,
    }),
    size: (value: PropertyValue<"width" | "height">) => ({
      width: value,
      height: value,
    }),
  },
});

export const darkTheme = createTheme({
  colors: { ...tokens.darkColors, ...tokens.darkTheme },
});

export const globalStyles = globalCss({
  "*": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
    "-webkit-tap-highlight-color":
      "transparent" /* for removing the highlight */,

    "&:focus:not(:focus-visible)": {
      outline: "none",
    },

    "&:focus-visible": {
      outline: "2px solid $primary",
      borderRadius: "4px",
    },
  },
  "::-webkit-scrollbar": {
    display: "none",
  },
  html: {
    "-webkit-font-smoothing": "antialiased",
    textRendering: "optimizeLegibility",
    textSizeAdjust: "100%",
    background: "$background",
  },
  body: {
    fontFamily: "$plusjakarta",
    color: "$onBackground",
  },
  a: {
    color: "$primary",
  },
  li: {
    listStyle: "none",
    padding: 0,
  },
  ".sr-only": {
    border: "0 !important",
    clip: "rect(1px, 1px, 1px, 1px) !important" /* 1 */,
    webkitClipPath: "inset(50%) !important",
    clipPath: "inset(50%) !important" /* 2 */,
    height: "1px !important",
    margin: "-1px !important",
    overflow: "hidden !important",
    padding: "0 !important",
    position: "absolute !important",
    width: "1px !important",
    whiteSpace: "nowrap !important",
  },  
  ".epr-dark-theme": {
    "--epr-bg-color": "transparent !important",
    "--epr-category-icon-active-color": "var(--colors-primary) !important",
    "--epr-picker-border-color": "transparent !important",
    "--epr-category-label-text-color": "var(--colors-sage11) !important",
    "--epr-preview-text-color": "var(--colors-sage11) !important",
    "--epr-search-border-color": "transparent !important",
    "--epr-search-input-bg-color": "var(--colors-sage3) !important",
    "--epr-search-input-border-radius": "var(--radii-round)",
    "--epr-search-input-bg-color-active": "var(--colors-sage3) !important"
  },
  "button.epr-cat-btn.epr-active": {
    filter:
      "invert(26%) sepia(89%) saturate(400%) hue-rotate(95deg) brightness(70%) contrast(106%)",
  },
});
