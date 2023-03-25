import React, { useEffect, useState } from "react";
import socketEvents from "@/constants/socketEvents";

// Hooks
import { useParams } from "react-router-dom";
import { useAuth, useSocket, useTheme } from "@/hooks";
import { useGetTarget, useGetConversations } from "@/features/chat/hooks";


export default function useChatInfo(){
    const { id: userId } = useAuth();
    const { id } = useParams();
    const socket = useSocket();
    const [conversationName, setConversationName] = useState<
      string | null | undefined
    >("");
    const { data: conversation, target } = useGetTarget();
    const { theme } = useTheme();
    const { data: conversations, dataUpdatedAt } = useGetConversations();
  
    useEffect(() => {
      if (conversation?.type != 1) {
        setConversationName(conversation?.name);
      }
    }, [id, conversation?.name]);
  
    useEffect(() => {
      const convoIndex =
        conversations?.findIndex((obj) => obj.id === Number(id)) || 0;
      if (
        target &&
        !conversation?.participants &&
        conversations &&
        convoIndex > 0
      ) {
        target.status = conversations[convoIndex].participants[0].status;
      }
    }, [dataUpdatedAt]);
  
    function onConversationNameChange(e: React.ChangeEvent<HTMLInputElement>) {
      setConversationName(e.target.value);
    }
  
    function onConversationNameBlur(e: React.FocusEvent<HTMLInputElement>) {
      socket.emit(socketEvents.CHANGE_CONVERSATION_NAME, {
        conversationId: id,
        name: conversationName,
      });
    }
    const themePreference =
      theme === "dark"
        ? {
            boxShadow: "none",
            borderBottom: "1px solid $sage7",
          }
        : undefined;


        return {conversation, conversationName, target, userId, onConversationNameBlur, onConversationNameChange, themePreference}
    
}