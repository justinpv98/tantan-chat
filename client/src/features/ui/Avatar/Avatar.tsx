import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { styled } from "@/stitches.config";
import { CSS, VariantProps } from "@stitches/react";

import Icon from "../Icon/Icon";

type Props = {
  css?: CSS;
  name?: string;
  size?: VariantProps<typeof Root>["size"] & number;
  src?: string;
};

export default function Avatar({ css, name, size = 200, src }: Props) {
  const fallbackSize = ((size * 16) / 100) * 0.625;

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
      "050": {
        width: "$050",
        height: "$050",
      },
      100: {
        width: "$100",
        height: "$100",
      },
      150: {
        width: "$150",
        height: "$150",
      },
      200: {
        width: "$200",
        height: "$200",
      },
      225: {
        width: "$225",
        height: "$225",
      },
      250: {
        width: "$250",
        height: "$250",
      },
      300: {
        width: "$300",
        height: "$300",
      },
    },
  },
});
