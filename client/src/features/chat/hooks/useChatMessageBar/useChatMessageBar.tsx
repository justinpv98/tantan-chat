import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// Constants
import socketEvents from "@/constants/socketEvents";

// Hooks
import { useAuth, useFileHandler, useSocket, useThrottle } from "@/hooks";

import { useGetConversation } from "@/features/chat/hooks";
import { usePostImage } from "@/features/media/hooks";

import { useUpdateConversations } from "@/features/chat/hooks/useGetConversations/useGetConversations";


export default function useChatMessageBar(isRefVisible: boolean, observedRef: React.MutableRefObject<HTMLDivElement | null>){
    const initialState = {
        author: "",
        conversation: "",
        data: "",
      };
    
      const updateConversations = useUpdateConversations();
      const [message, setMessage] = useState(initialState);
    
      const { id: targetId } = useParams();
      const { data } = useGetConversation(targetId || "", false);
    
      const { id: userId } = useAuth();
      const inputRef = useRef<HTMLTextAreaElement | null>(null);
    
      const socket = useSocket();
    
      const throttle = useThrottle();
    
      const {file, uploadFile} = useFileHandler();
    
      const {mutate} = usePostImage()
    
      useEffect(() => {
        setMessage(initialState);
        autoGrow(inputRef?.current);
        observedRef?.current?.scrollIntoView();
      }, [targetId]);
    
      useEffect(() => {
        if(file && targetId){
          mutate({file: file, conversationId: targetId})
        }
      }, [file])
    
      function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        throttle(() => socket.emit(socketEvents.TYPING, data?.id));
        setMessage({
          ...message,
          data: e.target.value,
        });
      }
    
      function onInput() {
        autoGrow(inputRef?.current);
        if (isRefVisible && observedRef?.current) {
          observedRef.current.scrollIntoView();
        }
      }
    
      function onKeyDownEnter(e: React.KeyboardEvent<HTMLFormElement>) {
        if (e.key === "Enter" && e.shiftKey == false) {
          e.preventDefault();
          onSubmit(e);
        }
      }
    
      function onSubmit(
        e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
      ) {
        e.preventDefault();
    
        if (message.data) {
          let imageData;
          socket.emit(socketEvents.MESSAGE, {
            ...message,
            author: userId,
            conversation: data?.id,
            data: message.data.trim(),
            file: imageData,
          });
          setMessage(initialState);
    
          if (inputRef?.current) {
            autoGrow(inputRef.current, true);
          }
    
          observedRef?.current?.scrollIntoView();
    
          if (data) {
            updateConversations(data);
          }
        }
      }
    
    
      function autoGrow(target: any, reset: boolean = false) {
        target.style.height = "100%";
        target.style.height = target.scrollHeight - 22 + "px";
    
        if (reset) {
          target.style.height = "3rem";
        }
      }


      return {autoGrow,  inputRef, message, onChange, onInput, onKeyDownEnter, onSubmit, setMessage, uploadFile}
    
}