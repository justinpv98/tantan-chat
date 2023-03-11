import React from "react";
import { styled } from "@/stitches.config";

import { CSS, VariantProps } from "@stitches/react";

type ExtraProps = {
  as?: React.ElementType;
  children?: React.ReactNode;
  css?: CSS;
  onClick?: () => any;
  testId?: string;
};

export default function Flex({
  as,
  children,
  css,
  gap,
  onClick,
  testId,
  ...rest
}: VariantProps<typeof _Flex> & ExtraProps) {
  return (
    <_Flex as={as} css={css} data-testid={testId} onClick={onClick} {...rest}>
      {children}
    </_Flex>
  );
}

const _Flex = styled("div", {
  display: "flex",

  variants: {
    align: {
      start: {
        alignItems: "flex-start",
      },
      center: {
        alignItems: "center",
      },
      end: {
        alignItems: "flex-end",
      },
      stretch: {
        alignItems: "stretch",
      },
      baseline: {
        alignItems: "baseline",
      },
    },
    direction: {
      row: {
        flexDirection: "row",
      },
      column: {
        flexDirection: "column",
      },
      rowReverse: {
        flexDirection: "row-reverse",
      },
      columnReverse: {
        flexDirection: "column-reverse",
      },
    },
    flex: {
      grow: {
        flex: "1 1 auto", // grow and shrink based on available space in parent
      },
      shrink: {
        flex: "0 1 auto", // only shrink
      },
      none: {
        flex: "0 0 auto", // neither shink or grow based on parent
      },
    },
    gap: {
      1: {
        gap: "4px",
      },
      2: {
        gap: "$050",
      },
      3: {
        gap: "$075",
      },
      4: {
        gap: "$100",
      },
      5: {
        gap: "$150",
      },
      6: {
        gap: "$200",
      },
      7: {
        gap: "$250",
      },
    },
    inline: {
      true: {
        display: "inline-flex",
      },
      false: {},
    },
    justify: {
      start: {
        justifyContent: "flex-start",
      },
      center: {
        justifyContent: "center",
      },
      end: {
        justifyContent: "flex-end",
      },
      evenly: {
        justifyContent: "space-evenly",
      },
      between: {
        justifyContent: "space-between",
      },
    },
    wrap: {
      noWrap: {
        flexWrap: "nowrap",
      },
      wrap: {
        flexWrap: "wrap",
      },
      wrapReverse: {
        flexWrap: "wrap-reverse",
      },
    },
  },
  defaultVariants: {
    align: "stretch",
    direction: "row",
    justify: "start",
    wrap: "noWrap",
  },
});
