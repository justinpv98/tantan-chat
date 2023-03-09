import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { styled } from "@/stitches.config";
import { CSS, VariantProps } from "@stitches/react";

import Icon from "../Icon/Icon";

type Props = {
  css?: CSS;
  name?: string;
  size?: VariantProps<typeof Root>["size"];
  src?: string;
};

export default function Avatar({ css, name, size = "sm", src }: Props) {
  let fallbackSize;
  if(size === "sm"){
    fallbackSize = "1.5rem"
  } else if (size === "md"){
    fallbackSize = "1.875rem"
  } else if (size === "lg"){
    fallbackSize = "5rem"
  }

  return (
    <Root css={css} size={size}>
      <AvatarPrimitive.Image src={src} alt={name} />
      <Fallback delayMs={50}>
        <Icon icon="user" size={fallbackSize} />
      </Fallback>
    </Root>
  );
}

const Fallback = styled(AvatarPrimitive.Fallback, {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  backgroundColor: "$sage3",
  justifyContent: "center",
  color: "$sage11",
  fontSize: 15,
  lineHeight: 1,
  fontWeight: "$medium",
});

const Root = styled(AvatarPrimitive.Root, {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "middle",
  overflow: "hidden",
  userSelect: "none",
  width: "$150",
  height: "$150",
  borderRadius: "100%",
  variants: {
    size: {
      sm: {
        width: "$250",
        height: "$250",
      },
      md: {
        width: "$300",
        height: "$300",
      },
      lg: {
        width: "8rem",
        height: "8rem"
      }
    },
  },
});
