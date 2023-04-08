import React from "react";
import { useQuery, useQueryClient } from "react-query";

// Constants
import queryKeys from "@/constants/queryKeys";

// Types
import { NotificationData } from "./hooks/useGetNotifications/useGetNotifications";

// Hooks
import {useAuth} from "@/hooks";
import { useFriendEvents } from "../friends/hooks";

// Components
import { Avatar, Button, Flex, Text } from "@/features/ui";

type Props = {
  notification: NotificationData;
};

export default function NotificationItem({ notification }: Props) {
  switch (notification.type) {
    case 1:
      return <SentFriendRequestNotification notification={notification} />;
    case 2:
      return <AcceptedFriendRequestNotification notification={notification} />;
    default:
      return null;
  }
}

function SentFriendRequestNotification({ notification }: Props) {
  const {id} = useAuth();
  const queryClient = useQueryClient();
  const {updateRelationship} = useFriendEvents();


  function onAcceptClick(){
    updateRelationship({id, targetId: notification.actor.id, type: 3})
    queryClient.setQueryData(
      [queryKeys.GET_NOTIFICATIONS, {query: id}], (oldData: any) => {
        return oldData.filter((oldNotification: NotificationData) => {
          return oldNotification.id != notification.id
        })
      }
    )
  }

  return (
    <Flex align="center" css={{ gap: "$075", paddingInline: "$025" }}>
      <Avatar src={notification.actor.profile_picture || ""} />
      <Text css={{ fontSize: "0.9375rem" }}>
        <Text weight="bold" inline>
          {notification.actor.username}{" "}
        </Text>
        has sent you a friend request.
      </Text>
      <Button color="primary" size="sm" onClick={onAcceptClick}>
        Accept
      </Button>
    </Flex>
  );
}

function AcceptedFriendRequestNotification({ notification }: Props) {
  return (
    <Flex align="center" css={{ gap: "$075", paddingInline: "$025" }}>
      <Avatar src={notification.actor.profile_picture || ""} />
      <Text css={{ fontSize: "0.9375rem" }}>
        <Text weight="bold" inline>
          {notification.actor.username}{" "}
        </Text>
        has accepted your friend request.
      </Text>
    </Flex>
  );
}
