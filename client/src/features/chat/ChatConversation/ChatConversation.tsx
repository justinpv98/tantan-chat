import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { styled } from "@/stitches.config";

// Types
import { Message } from "../hooks/useGetMessages/useGetMessages";

// Hooks
import { useSocket } from "@/hooks";
import { useGetMessages } from "@/features/chat/hooks";

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

  const { messages, setMessages, isError } = useGetMessages();

  useLayoutEffect(() => {
    socket.on("message", (message: Message) => {
      setMessages([...messages, message]);
    });
    return () => {
      socket.off("message");
    };
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [id]);

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
      {messages.length
        ? messages.map((message) => (
            <ChatMessage key={message?.id} message={message} />
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
  height: "100%",
  listStyle: "none",
  overflowY: "scroll",
  paddingBlock: "$050 $200",
  maxWidth: "100vw",
});
