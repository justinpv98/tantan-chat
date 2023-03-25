import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { styled } from "@/stitches.config";

// Constants
import socketEvents from "@/constants/socketEvents";

// Types
import { Message } from "../hooks/useGetMessages/useGetMessages";

// Hooks
import { useSocket } from "@/hooks";
import { useCurrentConversation, useGetConversation, useGetMessages } from "@/features/chat/hooks";

// Components
import ChatInfiniteScroller from "../ChatInfiniteScroller/ChatInfiniteScroller";
import ChatMessage from "../ChatMessage/ChatMessage";
import ChatScrollToBottom from "../ChatScrollToBottom/ChatScrollToBottom";
import ChatTypingBar from "../ChatTypingBar/ChatTypingBar";

type Props = {
  isRefVisible: boolean;
  observedRef: React.MutableRefObject<HTMLDivElement | null>;
  setIsRefVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ChatConversation({
  isRefVisible,
  observedRef,
  setIsRefVisible,
}: Props) {
  const { id } = useParams();
  const socket = useSocket();
  const containerRef = useRef<HTMLOListElement | null>(null);

  const { messages, setMessages, isLoading, isError } = useGetMessages();

  useLayoutEffect(() => {
    socket.on(socketEvents.MESSAGE, appendMessage);
    return () => {
      socket.off(socketEvents.MESSAGE, appendMessage);
    };
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [id]);

  function isPreviousMessageBySameAuthor(index: number) {
    if (index === 0) return false;
    return messages[index]?.author.id == messages[index - 1]?.author.id;
  }

  function appendMessage(message: Message) {
    setMessages([...messages, message]);
  }

  return (
    <ConversationContainer ref={containerRef}>
      {containerRef?.current && (
        <ChatInfiniteScroller
          containerRef={containerRef}
          isError={isError}
          messages={messages}
          setMessages={setMessages}
        />
      )}
      {messages.length && !isLoading
        ? messages.map((message, index) => (
            <ChatMessage
              key={message?.id}
              message={message}
              showUsername={!isPreviousMessageBySameAuthor(index)}
            />
          ))
        : null}
      <ChatScrollToBottom
        containerRef={containerRef}
        isRefVisible={isRefVisible}
        messages={messages}
        observedRef={observedRef}
        setIsRefVisible={setIsRefVisible}
      />
      <ChatTypingBar />
    </ConversationContainer>
  );
}

const ConversationContainer = styled("ol", {
  display: "flex",
  flexDirection: "column",
  background: "$background",
  gap: "$012",
  height: "100vh",
  listStyle: "none",
  overflowY: "scroll",
  paddingBlock: "$050 $200",
  maxWidth: "100vw",

  "@lg": {
    height: "100%"
  }
});
