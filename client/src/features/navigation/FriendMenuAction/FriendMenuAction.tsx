import React, { Fragment, useEffect } from "react";
import { useQueryClient } from "react-query";
import queryKeys from "@/constants/queryKeys";

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
} from "@/features/friends/hooks";

// Components
import MenuAction from "../MenuAction/MenuAction";

type Props = {};

export default function FriendMenuAction() {
  const queryClient = useQueryClient();
  const { id } = useAuth();
  const {data, target} = useGetTarget();
  const socket = useSocket();
  const { data: relationships } = useGetRelationships(false);
  const { mutate: sendFriendRequest } = useCreateRelationship(
    onRelationshipCreateSuccess
  );
  const { mutate: removeRelationship } = useRemoveRelationship(
    onRelationshipDeleteSuccess
  );
  const { mutate: updateRelationship } = useUpdateRelationship(
    onRelationshipUpdateSuccess
  );

  useEffect(() => {
    socket.on("createRelationship", (relationship) =>
      addRelationshipToCache(relationship)
    );
    socket.on("removeRelationship", (relationshipId) =>
      removeRelationshipFromCache({ id: relationshipId })
    );

    socket.on("updateRelationship", (relationship) =>
      updateRelationshipInCache(relationship)
    );

    return () => {
      socket.off("createRelationship", (relationship) =>
        addRelationshipToCache(relationship)
      );
      socket.off("removeRelationship", (relationshipId) =>
        removeRelationshipFromCache({ id: relationshipId })
      );

      socket.off("updateRelationship", (relationship) =>
        updateRelationshipInCache(relationship)
      );
    };
  }, []);

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

  function onRelationshipCreateSuccess(newData: any) {
    return addRelationshipToCache(newData);
  }

  function onRelationshipDeleteSuccess(newData: any) {
    return removeRelationshipFromCache(newData);
  }

  function onRelationshipUpdateSuccess(newData: any) {
    return updateRelationshipInCache(newData);
  }

  function addRelationshipToCache(newData: any) {
    queryClient.setQueryData(
      [queryKeys.GET_RELATIONSHIPS, id],
      (oldData: any) => {
        if (oldData && oldData.length) {
          const idSet = new Set();
          const data = [...oldData, newData].filter(({ id }) =>
            idSet.has(id) ? false : idSet.add(id)
          );
          return data;
        } else {
          const data = [newData];

          return data;
        }
      }
    );
  }

  function removeRelationshipFromCache(newData: any) {
    queryClient.setQueryData(
      [queryKeys.GET_RELATIONSHIPS, id],
      (oldData: any) => {
        if (oldData && oldData.length) {
          const filteredData = oldData.filter((data: Relationship) => {
            return data.id != newData.id;
          });
          return filteredData;
        } else {
          return oldData;
        }
      }
    );
  }

  function updateRelationshipInCache(newData: any) {
    queryClient.setQueryData(
      [queryKeys.GET_RELATIONSHIPS, id],
      (oldData: any) => {
        console.log(oldData, newData);
        if (oldData && oldData.length) {
          const data = oldData.map((data: Relationship) => {
            if (data.id == newData.id) {
              data.type = newData.type;
            }
            return data;
          });

          return oldData
        } else {
          return oldData;
        }
      }
    );
  }

  function renderRelationship() {
    const relationship = hasRelationship();
    if (relationship) {
      console.log(relationship.type);
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
