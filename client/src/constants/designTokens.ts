import {
  green,
  greenDark,
  red,
  redDark,
  amber,
  amberDark,
  blue,
  blueDark,
  sage,
  sageDark,
  blackA,
  whiteA,
} from "@radix-ui/colors";

export const breakpoints = {
  sm: "30em",
  md: "48em",
  lg: "60em",
  xl: "71.25em",
};

export const colors = {
  ...green,
  ...red,
  ...amber,
  ...blue,
  ...sage,
  ...blackA,
  ...whiteA,
};

export const darkColors = {
  ...greenDark,
  ...redDark,
  ...amberDark,
  ...blueDark,
  ...sageDark,
  ...blackA,
  ...whiteA,
};

export const darkTheme = {
    primary: "$green8",
    primaryGradient:
      "linear-gradient(69.79deg, #30A46C 0%, #37BD73 100%), rgba(0, 0, 0, 0.2)",
    error: "$red8",
    success: "$green8",
    background: "$sage1",
    disabled: "$sage4",
    onPrimary: "$sage12",
    onError: "$sage12",
    onSuccess: "$sage12",
    onBackground: "$sage12",
    onDisabled: "$sage7",
  };

export const fontSizes = {
  "050": "0.5rem",
  "062": "0.625rem",
  "075": "0.75rem",
  "087": "0.875rem",
  "100": "1rem",
  "112": "1.125rem",
  "125": "1.25rem",
  "150": "1.5rem",
  "175": "1.75rem",
  "200": "2rem",
  "225": "2.25rem",
  "250": "2.5rem",
  "275": "2.75rem",
  "300": "3rem",
  "350": "3.5rem",
  "400": "4rem",
  "450": "4.5rem",
  "500": "5rem",
};

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const lineHeights = {
  "100": 1,
  "110": 1.1,
  "125": 1.25,
  "150": 1.5,
  "160": 1.6,
  "175": 1.75,
  "200": 2,
  "240": 2.4,
};

export const shadows = {};

export const sizes = {
  "025": "0.25rem",
  "050": "0.5rem",
  "062": "0.625rem",
  "075": "0.75rem",
  "087": "0.875rem",
  "100": "1rem",
  "112": "1.125rem",
  "125": "1.25rem",
  "150": "1.5rem",
  "175": "1.75rem",
  "200": "2rem",
  "225": "2.25rem",
  "250": "2.5rem",
  "275": "2.75rem",
  "300": "3rem",
  "350": "3.5rem",
  "400": "4rem",
  "450": "4.5rem",
  "500": "5rem",
};

export const radii = {
  "025": "0.25rem",
  "050": "0.5rem",
  "075": "0.75rem",
  "087": "0.875rem",
  "100": "1rem",
  "112": "1.125rem",
  "125": "1.25rem",
  "150": "1.5rem",
  "200": "2rem",
  round: "6000px",
};

export const spaces = {
  "012": "0.125rem",
  "025": "0.25rem",
  "050": "0.5rem",
  "062": "0.625rem",
  "075": "0.75rem",
  "087": "0.875rem",
  "100": "1rem",
  "112": "1.125rem",
  "125": "1.25rem",
  "150": "1.5rem",
  "175": "1.75rem",
  "200": "2rem",
  "225": "2.25rem",
  "250": "2.5rem",
  "275": "2.75rem",
  "300": "3rem",
  "350": "3.5rem",
  "375": "3.75rem",
  "400": "4rem",
  "450": "4.5rem",
  "500": "5rem",
};

export const theme = {
  primary: "$green11",
  primaryGradient:
    "linear-gradient(69.79deg, #30A46C 0%, #37BD73 100%), rgba(0, 0, 0, 0.2)",
  error: "$red11",
  success: "$green11",
  background: "$sage1",
  disabled: "$sage4",
  onPrimary: "$sage1",
  onError: "$sage1",
  onSuccess: "$sage1",
  onBackground: "$sage12",
  onDisabled: "$sage7",
};


export const zIndices = {
  base: 0,
  onBase: 100,
  floating: 200,
  header: 500,
  overlay: 900,
  onOverlay: 1000,
};
