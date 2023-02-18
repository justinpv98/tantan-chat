import { styled } from "@/stitches.config";

const Button = styled("button", {
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "$050",
  cursor: "pointer",

  padding: "$075 $150",
  borderRadius: "$050",
  border: "none",

  background: "$primary",
  color: "$onPrimary",
  textDecoration: "none",

  fontFamily: "inherit",
  fontSize: "$100",
  fontWeight: "$bold",
  userSelect: "none",

  "@highContrast": {
    forcedColorAdjust: "none",
    background: "buttonText !important",
    color: "buttonFace !important",
    boxShadow: "none !important",
  },

  "&:disabled": {
    color: "$onDisabled",
    backgroundColor: "$disabled",
    borderColor: "$disabled",
    cursor: "initial",
    "&:hover": {
      backgroundColor: "$disabled",
    },
  },

  variants: {
    color: {
      primary: {
        background: "$primary",
        color: "$onPrimary",
        "&:hover": {
          background: "$green10",
        },
        "&:focus-visible": {
          outline: "2px solid $amber9 !important",
        },
      },
      primaryGradient: {
        background: "$primaryGradient",
        color: "$onPrimary",
        boxShadow: "0px 4px 8px rgba(21, 50, 38, 0.15)",
        "&:hover": {
          background: "$green10",
        },
        "&:focus-visible": {
          outline: "2px solid $amber9 !important",
        },
      },
      secondary: {
        background: "$secondary",
        color: "$onSecondary",
      },
      tertiary: {
        background: "transparent",
        color: "$onSecondary",
      },
      accent: {
        background: "$accent",
        color: "$onAccent",
      },
      disabled: {
        background: "$disabled",
        color: "$onDisabled",
      },
      successPrimary: {
        background: "$success",
        color: "$onSuccess",
      },
      errorPrimary: {
        background: "$error",
        color: "$onError",
      },
    },
    fluid: {
      true: {
        width: "100%",
      },
    },
    icon: {
      center: {
        py: "$050",
        px: "$050",
        fontSize: "0",
        lineHeight: "0",
        gap: "0",
        maxWidth: "fit-content",
      },
      left: {
        flexDirection: "row",
      },
      right: {
        flexDirection: "row-reverse",
      },
      none: {},
    },
    transparent: {
      true: {
        backgroundColor: "inherit",
        color: "inherit",
        paddingBlock: "$075"
      },
    },
    outlined: {
      true: {
        background: "none",
        border: "1px soli",
      },
      false: {},
    },
    size: {
      lg: {
        fontSize: "$112",
      },
    },
  },

  compoundVariants: [
    {
      icon: "center",
      css: {
        padding: "$075",
        fontSize: "0",
        lineHeight: "0",
      },
    },
  ],
});

type ButtonProps = React.ComponentProps<typeof Button>;
interface ButtonInterface extends ButtonProps {
  children: React.ReactNode;
}

export type { ButtonProps, ButtonInterface };
export default Button;
