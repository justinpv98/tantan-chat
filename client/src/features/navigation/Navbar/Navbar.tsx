import React, { useRef } from "react";
import { useParams, Outlet } from "react-router-dom";
import { styled } from "@/stitches.config";
import { navRoutes } from "@/constants/routes";

// Hooks
import { useGetRelationships } from "@/features/friends/hooks";
import { useGetNotifications } from "@/features/notifications/hooks";
import useNavbarSocketEvents from "../hooks/useNavbarSocketEvents";

// Components
import { Flex, SideNavigation, SideNavigationItem } from "@/features/ui";
import { Settings, useSettings } from "@/features/settings";

type Props = {};

export default function Navbar({}: Props) {
  const { id: conversationId } = useParams();
  const {muteNotifications} = useSettings();
  useGetRelationships(true);
  useGetNotifications(true);
  const notificationSoundRef = useRef<HTMLAudioElement>(null);
  const notification = new URL(
    "../../../assets/notification.mp3",
    import.meta.url
  ).href;

  function playNotificationSound() {
    !muteNotifications && notificationSoundRef.current?.play();
  }

  const { notificationPlayerRef } = useNavbarSocketEvents(playNotificationSound);

  return (
    <Flex as="nav">
      <SideNavigation>
        <NavigationWrapper>
          {navRoutes.map((route, index) => {
            return (
              <SideNavigationItem
                label={route.label}
                path={
                  route.path +
                  (route.path === "/" ? "" : "/") +
                  (conversationId ? `c/${conversationId}` : "")
                }
                icon={route.icon}
                key={route.path}
                showLabel={index === 0}
                isNotifications={route.path === "/notifications"}
              />
            );
          })}
          <li>
            <Settings isMobile side="top" />
          </li>
        </NavigationWrapper>
        <Settings />
      </SideNavigation>
      <button
        className="sr-only"
        tabIndex={0}
        ref={notificationPlayerRef}
        onClick={playNotificationSound}
      />
      <audio
        className="sr-only"
        tabIndex={0}
        src={notification}
        ref={notificationSoundRef}
      />
      <Outlet />
    </Flex>
  );
}

const NavigationWrapper = styled("ul", {
  display: "flex",
  justifyContent: "evenly",
  width: "100%",
  gap: "$050",

  "@lg": { flexDirection: "column", height: "100%" },
});
