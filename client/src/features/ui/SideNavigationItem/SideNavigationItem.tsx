import React from "react";
import { styled } from "@/stitches.config";
import { NavLink } from "react-router-dom";

// Hooks
import { useGetNotifications } from "@/features/notifications/hooks";

// Components
import Flex from "../Flex/Flex";
import Icon, { IconProps } from "../Icon/Icon";

type Props = {
  [key: string]: any;
  label: string;
  icon?: IconProps["icon"];
  path: string;
  showLabel: boolean;
  isNotifications?: boolean;
};

export default function SideNavigationItem(props: Props) {
  switch (props.label) {
    case "Notifications":
      return <NotificationsNavItem {...props} />;
    default:
      return <NavigationItem {...props} />;
  }
}

function NavigationItem(props: Props) {
  return (
    <Item>
      <Link aria-label={props.label} to={props.path} end>
        <Icon icon={props.icon} />
      </Link>
    </Item>
  );
}

function NotificationsNavItem(props: Props) {
  const { data: notifications } = useGetNotifications(false);

  const unreadMessages =
    notifications ? notifications?.filter((notification) => !notification.read) : null;

  return (
    <Item>
      {unreadMessages && unreadMessages.length > 0 && (
        <NotificationCounter>{unreadMessages.length}</NotificationCounter>
      )}
      <Link aria-label={props.label} to={props.path} end>
        <Icon icon={props.icon} />
      </Link>
    </Item>
  );
}

export const Item = styled("li", {
  display: "flex",
  position: "relative",

  "@lg": {
    display: "block",
  },
});

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

export const NotificationCounter = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  color: "white",
  background: "$error",
  borderRadius: "$round",
  aspectRatio: 1,
  width: "$125",
  right: 0,
  bottom: 0,
  fontSize: "$075",
  fontWeight: "$bold"
});
