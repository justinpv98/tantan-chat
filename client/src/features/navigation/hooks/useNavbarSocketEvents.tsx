import React, { useEffect, useRef } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

// Constants
import queryKeys from "@/constants/queryKeys";
import socketEvents from "@/constants/socketEvents";

// Types
import { ConversationData } from "@/features/chat/hooks/useGetConversations/useGetConversations";
import { Message } from "@/features/chat/hooks/useGetMessages/useGetMessages";
import { NotificationData } from "@/features/notifications/hooks/useGetNotifications/useGetNotifications";


// Hooks
import { useAuth, useSocket } from "@/hooks";
import { useGetConversations } from "@/features/chat/hooks";
import { useGetNotifications } from "@/features/notifications/hooks";

type Props = {};

export default function useNavbarSocketEvents() {
  const queryClient = useQueryClient();
  const { id: userId } = useAuth();
  const socket = useSocket();
  const { id: conversationId } = useParams();
  const { data: conversations, isSuccess } = useGetConversations(true);
  const {data: notifications} = useGetNotifications(true);;
  const notificationPlayerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    socket.on(socketEvents.SET_STATUS, setStatus);
    socket.on(socketEvents.MESSAGE, message);
    socket.on(socketEvents.CREATE_GROUP_DM, createGroupDM);
    socket.on(socketEvents.CHANGE_CONVERSATION_NAME, changeConversationName);
    socket.on(socketEvents.SEND_NOTIFICATION, sendNotification)

    return () => {
      socket.off(socketEvents.SET_STATUS, setStatus);
      socket.off(socketEvents.MESSAGE, message);
      socket.off(socketEvents.CREATE_GROUP_DM, createGroupDM);
      socket.off(socketEvents.CHANGE_CONVERSATION_NAME, changeConversationName);
      socket.off(socketEvents.SEND_NOTIFICATION, sendNotification)

    };
  }, [socket, isSuccess, conversationId]);

  function setStatus(userId: string, status: 1 | 2 | 3 | 4) {
    queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, (oldData: any) => {
      const newData = oldData?.map((conversation: ConversationData) => {
        const modifiedConversation = conversation;
        modifiedConversation?.participants.map((participant) => {
          if (participant.id === userId) {
            participant.status = status;
          }
          return participant;
        });
        return modifiedConversation;
      });
      return newData;
    });
  }

  async function message(message: Message, conversation: ConversationData) {
    if (message?.author.id == userId) return;

    const messageConversationId = message?.conversation;

    const hasConversation = conversations?.find(
      ({ id }) => id == messageConversationId
    );

    if (conversations !== undefined && conversations.length >= 1) {
      if (hasConversation) {
        queryClient.setQueryData(
          queryKeys.GET_CONVERSATIONS,
          (oldData: any) => {
            const idSet = new Set();

            if (Number(conversationId) != hasConversation.id) {
              hasConversation.unread_count =
                hasConversation.unread_count + 1 || 1;
              notificationPlayerRef.current?.click();
            } else {
              hasConversation.unread_count = 0;
              socket.emit(socketEvents.READ_MESSAGES, conversationId);
            }

            const convos = [hasConversation, ...oldData].filter(({ id }) =>
              idSet.has(id) ? false : idSet.add(id)
            );

            return convos;
          }
        );
      } else {
        conversation.unread_count = 1;
        notificationPlayerRef.current?.click();

        queryClient.setQueryData(
          queryKeys.GET_CONVERSATIONS,
          (oldData: any) => {
            return [conversation, ...oldData];
          }
        );
      }
    } else {
      conversation.unread_count = 1;
      notificationPlayerRef.current?.click();
      queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, [conversation]);
    }
  }

  async function createGroupDM(conversation: ConversationData) {
    if (conversations !== undefined && conversations.length >= 1) {
      queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, (oldData: any) => {
        return [conversation, ...oldData];
      });
    } else {
      queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, (oldData: any) => {
        return [conversation];
      });
    }
  }

  function changeConversationName(conversationId: string, name: string) {
    if (conversations !== undefined && conversations.length >= 1) {
      queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, (oldData: any) => {
        const newData = [...oldData];
        const conversation = newData.find(
          (conversation) => conversation.id == conversationId
        );
        conversation.name = name;
        return newData;
      });
    } else {
      return;
    }
  }

  function sendNotification(notification: NotificationData){
    if(notifications !== undefined && notifications.length >= 1){
      queryClient.setQueryData([queryKeys.GET_NOTIFICATIONS, {query: userId}], (oldData: any) => {
        const newData = [notification, ...oldData]
        return newData;
      })
    } else {
      queryClient.setQueryData([queryKeys.GET_NOTIFICATIONS, {query: userId}], (oldData: any) => {
        const newData = [notification]
        return newData;
      })
    }
  }

  return {notificationPlayerRef};
}
