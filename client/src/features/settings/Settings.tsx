import React from "react";
import { useQueryClient } from "react-query";

// Types
import { CSS } from "@stitches/react";

// Hooks
import { useAuth, useSocket } from "@/hooks";
import useSettings from "./useSettings";

// Components
import { Avatar, Button, Popover, Text } from "@/features/ui";

type Props = {
  isMobile?: boolean,
  side?: "bottom" | "left" | "right" | "top"
};


const mobileCSS: CSS = {
    borderRadius: "$round",
    display: "block",
    width: "$275",
    height: "$275",
    backgroundColor: "$sage4",

    "@lg": {
      display: "none",
    },
}

const desktopCSS: CSS = {
    display: "none",
    borderRadius: "$round",
    width: "$275",
    height: "$275",
    backgroundColor: "$sage4",
  
    "@lg": {
      display: "block",
    },
  };
  
export default function Settings({ isMobile, side }: Props) {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const socket = useSocket();
  const {muteNotifications, setMuteNotifications} = useSettings();

  function onClickLogout(){
    queryClient.removeQueries();
    socket.disconnect();
    logout();
  }

  function onClickMuteNotifications(){
   setMuteNotifications && setMuteNotifications(!muteNotifications);
  }

  return (
    <Popover
      label={"Settings"}
      side={side || "right"}
      css={isMobile ? mobileCSS : desktopCSS}
      trigger={<Avatar size="sm" status={2} showStatus/>}
    >
      <Button onClick={onClickMuteNotifications} transparent>
        <Text>{muteNotifications ? "Unmute Notifications" : "Mute Notifications"} </Text>
      </Button>
      <Button onClick={onClickLogout} transparent>
        <Text color="error">Logout</Text>
      </Button>
    </Popover>
  );
}
