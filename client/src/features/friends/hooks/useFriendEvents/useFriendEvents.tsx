import React, {useEffect} from "react";
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
} from "@/features/friends/hooks";


export default function useFriendEvents() {
    const queryClient = useQueryClient();
    const socket = useSocket();
    const { target } = useGetTarget();
    const { id } = useAuth();
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
        socket.on(socketEvents.CREATE_RELATIONSHIP, (relationship) =>
          addRelationshipToCache(relationship)
        );
        socket.on(socketEvents.REMOVE_RELATIONSHIP, (relationshipId) =>
          removeRelationshipFromCache({ id: relationshipId })
        );
    
        socket.on(socketEvents.UPDATE_RELATIONSHIP, (relationship) =>
          updateRelationshipInCache(relationship)
        );
    
        return () => {
          socket.off(socketEvents.CREATE_RELATIONSHIP, (relationship) =>
            addRelationshipToCache(relationship)
          );
          socket.off(socketEvents.REMOVE_RELATIONSHIP, (relationshipId) =>
            removeRelationshipFromCache({ id: relationshipId })
          );
    
          socket.off(socketEvents.UPDATE_RELATIONSHIP, (relationship) =>
            updateRelationshipInCache(relationship)
          );
        };
      }, [target?.id]);

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
            if (oldData && oldData.length) {
              const data = oldData.map((data: Relationship) => {
                if (data.id == newData.id) {
                  data.type = newData.type;
                }
                return data;
              });
    
              return oldData;
            } else {
              return oldData;
            }
          }
        );
        
      }

      return {sendFriendRequest, removeRelationship, updateRelationship}
}
