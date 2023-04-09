import React, { useEffect } from "react";
import { styled } from "@/stitches.config";
import { useQueryClient } from "react-query";

// Types
import { CSS } from "@stitches/react";

// Hooks
import { useAuth, useFileHandler, useSocket, useTheme } from "@/hooks";
import useSettings from "./useSettings";

// Components
import { Avatar, Button, Popover, Text } from "@/features/ui";

type Props = {
  isMobile?: boolean;
  side?: "bottom" | "left" | "right" | "top";
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
};

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
  const { changeProfilePicture, logout, profile_picture } = useAuth();
  const socket = useSocket();

  const { file, uploadFile } = useFileHandler();
  const { muteNotifications, setMuteNotifications } = useSettings();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (file) {
      changeProfilePicture(file);
    }
  }, [file]);

  function onClickLogout() {
    queryClient.removeQueries();
    socket.disconnect();
    logout();
  }

  function onClickMuteNotifications() {
    setMuteNotifications && setMuteNotifications(!muteNotifications);
  }

  function onClickSwitchTheme() {
    setTheme && setTheme(theme === "dark" ? "light" : "dark");
  }

  function onChangeProfilePic(e: React.ChangeEvent<HTMLInputElement>) {
    uploadFile(e);
  }

  return (
    <Popover
      label={"Settings"}
      side={side || "right"}
      css={isMobile ? mobileCSS : desktopCSS}
      trigger={
        <Avatar size="sm" status={2} src={profile_picture || ""} showStatus />
      }
    >
      <Button onClick={onClickSwitchTheme} transparent>
        <Text>Switch Theme</Text>
      </Button>
      <HiddenInput
        onInput={onChangeProfilePic}
        type="file"
        id="profile-picture"
      />
      <Button transparent>
        <Text as="label" for="profile-picture" css={{ cursor: "pointer" }}>
          Change Profile Pic
        </Text>
      </Button>
      <Button onClick={onClickMuteNotifications} transparent>
        <Text>
          {muteNotifications ? "Unmute Notifications" : "Mute Notifications"}{" "}
        </Text>
      </Button>
      <Button onClick={onClickLogout} transparent>
        <Text color="error">Logout</Text>
      </Button>
    </Popover>
  );
}

const HiddenInput = styled("input", {
  display: "none",
});
