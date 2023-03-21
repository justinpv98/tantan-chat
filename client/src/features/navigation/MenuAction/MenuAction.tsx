import React from "react";
import { VariantProps } from "@stitches/react";

// Components
import {
    Button,
    Flex,
    Icon,
    Text,
  } from "@/features/ui";

// Types
import { IconProps } from "@/features/ui/Icon/Icon";
  

type Props = {
  children?: React.ReactNode;
    icon?: IconProps["icon"];
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function MenuAction({children, icon, onClick}: Props) {
  return (
    <Flex direction="column" align="start" css={{ width: "100%" }}>
      <Button
        justify="start"
        color="tertiary"
        icon="left"
        css={{ paddingInlineStart: "$075" }}
        fluid
        onClick={onClick}
      >
        <Icon icon={icon} />
        <Text weight="semibold" size="sm">
          {children}
        </Text>
      </Button>
    </Flex>
  );
}
