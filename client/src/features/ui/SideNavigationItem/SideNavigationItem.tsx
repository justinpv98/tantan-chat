import React from "react";
import { styled } from "@/stitches.config";
import { NavLink } from "react-router-dom";

import Flex from "../Flex/Flex";
import Icon, { IconProps } from "../Icon/Icon";

type Props = {
  label: string;
  icon?: IconProps["icon"];
  path: string;
  showLabel: boolean;
};

export default function SideNavigationItem({
  label,
  icon,
  path,
  showLabel,
}: Props) {
  return (
    <Item>
      <Link
        aria-label={label}
        to={path}
        end
      >
        <Icon icon={icon} />
      </Link>
    </Item>
  );
}

export const Item = styled("li", {
  display: "flex",
  
  "@lg": {
    display: "block"
  }
})

export const Link = styled(NavLink, {
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "100%",
  padding: "$050 $062",
  color: "$sage11",
  backgroundColor: "$sage3",
  borderRadius: "$round",
  transition: "color cubic-bezier(0.16, 1, 0.3, 1) 250ms",
  textDecoration: "none",

  "&.active": {
    color: "$onPrimary",
    backgroundColor: "$primary",
  },

  "&:hover:not(.active)": {
    backgroundColor: "$sage4",
    color: "$sage12",
    transition: "color cubic-bezier(0.16, 1, 0.3, 1) 250ms",
  },

  "&:disabled": {
    color: "$onDisabled",
    backgroundColor: "transparent",
  },

  "@lg": {
    display: "block",
    borderRadius: "$050",
  },
});

export const Label = styled("p", {
  textDecoration: "none",
  fontWeight: "700",

  "@lg": {
    display: "none",
  },
});
