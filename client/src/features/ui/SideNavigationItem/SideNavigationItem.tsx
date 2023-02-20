import React from "react";
import { styled } from "@/stitches.config";
import { NavLink } from "react-router-dom";

import Icon, {IconProps} from "../Icon/Icon";

type Props = { icon?: IconProps["icon"]; path: string };

export default function SideNavigationItem({icon, path}: Props) {
  return (
    <Link  to={path} end>
      <Icon icon={icon} />
    </Link>
  );
}

export const Link = styled(NavLink, {
  background: "transparent",
  padding: "$050 $062",
  color: "$sage11",
  backgroundColor: "$sage4",
  borderRadius: "$round",
  transition: "color cubic-bezier(0.16, 1, 0.3, 1) 250ms",

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
    borderRadius: "$050",
  },
});
