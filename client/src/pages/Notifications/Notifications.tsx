import React, { useEffect } from "react";
import { styled } from "@/stitches.config";

// Types
import { NotificationData } from "@/features/notifications/hooks/useGetNotifications/useGetNotifications";

// Hooks
import {
  useGetNotifications,
  useReadNotifications,
} from "@/features/notifications/hooks";

// Components
import { Button, Flex, Icon, Sidebar } from "@/features/ui";
import { NotificationItem } from "@/features/notifications";

export default function Notifications() {
  const { data } = useGetNotifications(false);
  const { mutate: readNotifications } = useReadNotifications();

  useEffect(() => {
    readNotifications();
  }, []);

  return (
    <Sidebar
      title="Notifications"
      css={{ borderLeft: "none", maxHeight: "100vh", overflow: "scroll" }}
    >
      <ItemContainer direction="column">
        {data &&
          data.sort((a, b) => b.id - a.id).map((notification: NotificationData) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
      </ItemContainer>
    </Sidebar>
  );
}

const ItemContainer = styled(Flex, {
  flexDirection: "column",
  gap: "$075",
  marginTop: "$075",
  padding: "$050 $050",
});
