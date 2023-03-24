import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CSS, keyframes } from "@stitches/react";
import { styled } from "@stitches/react";
import { darkTheme } from "@/stitches.config";

// Hooks
import { useTheme } from "@/hooks";

// Components
import Box from "../Box/Box";
import Button from "../Button/Button";
import Heading from "../Heading/Heading";
import Icon from "../Icon/Icon";
import Text from "../Text/Text";

type Props = {
  children?: React.ReactNode;
  description?: React.ReactNode;
  showClose?: boolean;
  title?: React.ReactNode;
  trigger: React.ReactNode;
};

export default function Dialog({
  children,
  description,
  showClose,
  title,
  trigger,
}: Props) {
  const { theme } = useTheme();

  const themedCss = {
    boxShadow:
      !darkTheme &&
      "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
    border: "1px solid $sage7",
  } as CSS;
  
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <Overlay className={theme === "dark" ? darkTheme : undefined}>
          <Content css={themedCss}>
            <Box css={{marginBlockEnd: "$100"}}>
            {title && (
              <Heading as="h3" size="h3">
                {title}
              </Heading>
            )}
            {description && <Text size="md" css={{marginBlockStart: "$025"}}>{description}</Text>}
            </Box>
            {children}
            {showClose && <DialogPrimitive.Close asChild>
              <CloseButton>
                <Icon icon="x-mark" />
              </CloseButton>
            </DialogPrimitive.Close>}
          </Content>
        </Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const Overlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: "$blackA9",
  position: "fixed",
  zIndex: 200,
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

const Content = styled(DialogPrimitive.Content, {
  backgroundColor: "$sage1",
  borderRadius: 6,
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "450px",
  maxHeight: "85vh",
  padding: 25,
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  "&:focus": { outline: "none" },
});

const CloseButton = styled("button", {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 25,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$green11",
  cursor: "pointer",
  position: "absolute",
  top: 5,
  right: 5,

  "&:hover": { backgroundColor: "$green4" },
  "&:focus": { boxShadow: `0 0 0 2px $green7` },
});
