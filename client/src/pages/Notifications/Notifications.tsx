import React, { useEffect } from "react";
import { styled } from "@/stitches.config";
import { useQueryClient } from "react-query";

// Constants
import queryKeys from "@/constants/queryKeys";

// Types
import { NotificationData } from "@/features/notifications/hooks/useGetNotifications/useGetNotifications";

// Hooks
import { useAuth } from "@/hooks";
import {
  useGetNotifications,
  useReadNotifications,
} from "@/features/notifications/hooks";

// Components
import {  Flex, Sidebar, Text } from "@/features/ui";
import { NotificationItem } from "@/features/notifications";

export default function Notifications() {
  const {id} = useAuth();
  const { data } = useGetNotifications(false);
  const { mutate: readNotifications } = useReadNotifications(onReadNotificationsSuccess);
  const queryClient = useQueryClient();

  useEffect(() => {
    readNotifications();
  }, []);

  function onReadNotificationsSuccess(){
    queryClient.setQueryData([queryKeys.GET_NOTIFICATIONS, {query: id}], (oldData: any) => {
      return oldData.map((notification: NotificationData) => {
        return {...notification, read: true}
      })
    })
  }

  return (
    <Sidebar
      title="Notifications"
      css={{ borderLeft: "none", maxHeight: "100vh", overflow: "scroll" }}
    >
      <ItemContainer direction="column" hasData={!!data}>
        {data ?
          data.sort((a, b) => b.id - a.id).map((notification: NotificationData) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          )) : <Text color="lowContrast" css={{paddingInline: "$150"}}>No new notifications yet</Text>}
      </ItemContainer>
    </Sidebar>
  );
}

const ItemContainer = styled(Flex, {
  flexDirection: "column",
  gap: "$075",
  marginTop: "$075",
  padding: "0 $050",

  variants: {
    hasData: {
      true: {
        padding: "$050 $050"
      }
    }
  }
});
