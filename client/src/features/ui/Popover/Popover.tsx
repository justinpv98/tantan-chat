import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { styled, darkTheme } from "@/stitches.config";
import { CSS, keyframes } from "@stitches/react";
import { PopoverContentProps } from "@radix-ui/react-popover";


// Hooks
import { useTheme } from "@/hooks";

// Components
import Button from "../Button/Button";
import Icon from "../Icon/Icon";

type Props = {
  contentCSS?: CSS;
  css?: CSS;
  children?: React.ReactNode;
  hasCloseButton?: boolean;
  label?: string;
  onClickTrigger?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onFocusOutside?: PopoverContentProps["onFocusOutside"],
  onInteractOutside?: (event: React.FocusEvent | MouseEvent | TouchEvent) => void,
  open?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  trigger?: React.ReactNode;
};

export default function Popover({
  contentCSS,
  css,
  children,
  hasCloseButton = false,
  label,
  onClickTrigger,
  onFocusOutside,
  onInteractOutside,
  open,
  side = "top",
  sideOffset = 5,
  trigger,
}: Props) {
  const { theme } = useTheme();

  return (
    <PopoverPrimitive.Root open={open}>
      <PopoverPrimitive.Trigger asChild>
        <Button onClick={onClickTrigger} aria-label={label} transparent css={{ padding: 0, ...css }}>
          {trigger}
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <Content
          className={theme === "dark" ? darkTheme : ""}
          css={contentCSS}
          side={side}
          sideOffset={sideOffset}
          onInteractOutside={onFocusOutside}
          onFocusOutside={onFocusOutside}
        >
         {hasCloseButton &&<Close>
            <Icon icon="x-mark" />
          </Close>}
          {children}
        </Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const Close = styled(PopoverPrimitive.Close, {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 25,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$green11",
  position: "absolute",
  top: 5,
  right: 5,

  "&:hover": { backgroundColor: "$green4" },
  "&:focus": { boxShadow: `0 0 0 2px $green7` },
});

const Content = styled(PopoverPrimitive.Content, {
  position: "relative",
  zIndex: "$overlay",
  border: "1px solid $sage7",
  borderRadius: 4,
  padding: 20,
  width: 260,
  backgroundColor: "$sage1",
  color: "$onBackground",
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
  "&:focus": {
    boxShadow: `hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px, 0 0 0 2px $green7`,
  },
});
