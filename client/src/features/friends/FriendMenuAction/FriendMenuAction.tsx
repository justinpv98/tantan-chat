import React, { Fragment, useEffect } from "react";
import { useQueryClient } from "react-query";

// Constants
import queryKeys from "@/constants/queryKeys";
import socketEvents from "@/constants/socketEvents";

// Types
import { Relationship } from "@/features/friends/hooks/useGetRelationships/useGetRelationships";

// Hooks
import { useAuth, useSocket } from "@/hooks";
import { useGetTarget } from "@/features/chat/hooks";
import {
  useGetRelationships,
  useRemoveRelationship,
  useCreateRelationship,
  useUpdateRelationship,
  useFriendEvents
} from "@/features/friends/hooks";

// Components
import MenuAction from "../../navigation/MenuAction/MenuAction";

type Props = {};

export default function FriendMenuAction() {
  const queryClient = useQueryClient();
  const { id } = useAuth();
  const { target } = useGetTarget();
  const socket = useSocket();
  const { data: relationships } = useGetRelationships(false);

  const {sendFriendRequest, removeRelationship, updateRelationship} = useFriendEvents();
 

  function hasRelationship() {
    if (relationships && relationships?.length && target) {
      return relationships.find(
        (relationship: any) => relationship.target.id === target?.id
      );
    }
  }

  function onAddFriendButtonClick() {
    target && id && sendFriendRequest({ id, targetId: target?.id });
  }

  function onRemoveRelationshipClick() {
    target && id && removeRelationship({ id, targetId: target?.id });
  }

  function onUpdateRelationshipClick() {
    const relationship = hasRelationship();
    target &&
      id &&
      relationship &&
      updateRelationship({ id, targetId: target.id, type: 3 });
  }


  function renderRelationship() {
    const relationship = hasRelationship();
    if (relationship) {
      switch (relationship.type) {
        case 1:
          return (
            <MenuAction icon="user-minus" onClick={onRemoveRelationshipClick}>
              Unsend Friend Request
            </MenuAction>
          );
        case 2:
          return (
            <MenuAction icon="user-plus" onClick={onUpdateRelationshipClick}>
              Accept Friend Request
            </MenuAction>
          );
        case 3:
          return (
            <MenuAction icon="user-minus" onClick={onRemoveRelationshipClick}>
              Unfriend
            </MenuAction>
          );
        default:
          return (
            <MenuAction icon="user-plus" onClick={onAddFriendButtonClick}>
              Add Friend
            </MenuAction>
          );
      }
    } else {
      return (
        <MenuAction icon="user-plus" onClick={onAddFriendButtonClick}>
          Add Friend
        </MenuAction>
      );
    }
  }

  return <Fragment>{renderRelationship()}</Fragment>;
}
