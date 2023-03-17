import React from "react";
import { useQueryClient } from "react-query";

// Types
import { CSS } from "@stitches/react";

// Hooks
import { useAuth, useSocket } from "@/hooks";

// Components
import { Avatar, Button, Popover, Text } from "@/features/ui";

type Props = {
  isMobile?: boolean
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
  
export default function Settings({ isMobile }: Props) {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const socket = useSocket();

  function onClickLogout(){
    queryClient.removeQueries();
    socket.disconnect();
    logout();
  }

  return (
    <Popover
      label={"Settings"}
      side="right"
      css={isMobile ? mobileCSS : desktopCSS}
      trigger={<Avatar size="sm" status={2} showStatus/>}
    >
      <Button onClick={onClickLogout} transparent>
        <Text color="error">Logout</Text>
      </Button>
    </Popover>
  );
}
