import React from "react";
import { styled } from "@/stitches.config";
import { NavLink } from "react-router-dom";

import Icon, { IconProps } from "../Icon/Icon";

type Props = { icon?: IconProps["icon"]; path: string };

export default function SideNavigationItem({ icon, path }: Props) {
  return (
    <li>
      <Link to={path} end>
        <Icon icon={icon} />
      </Link>
    </li>
  );
}

export const Link = styled(NavLink, {
  display: "block",
  width: "100%",
  height: "100%",
  padding: "$050 $062",
  color: "$sage11",
  backgroundColor: "$sage3",
  borderRadius: "$round",
  transition: "color cubic-bezier(0.16, 1, 0.3, 1) 250ms",

  "&.active": {
    color: "$onPrimary",
    backgroundColor: "$primary",
  },

  "&:hover:not(.active)": {
    backgroundColor: "$sage3",
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
