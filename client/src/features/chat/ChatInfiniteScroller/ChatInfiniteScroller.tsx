import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Types
import { Message } from "@/features/chat/hooks/useGetConversation/useGetConversation";

// Fetch
import { fetchMessages } from "@/features/chat/hooks/useGetMessages/useGetMessages";
// Hooks
import {
  useAbortController,
  useCurrentConversation,
  useInfiniteScroll,
} from "@/hooks";

// Components
import { Box } from "@/features/ui";

type Props = {
  containerRef: React.MutableRefObject<HTMLOListElement | null>;
  isError: boolean;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

export default function ChatInfiniteScroller({
  containerRef,
  isError,
  messages,
  setMessages,
}: Props) {
  const getSignal = useAbortController();
  const signal = getSignal();
  const { id } = useParams();
  const { loadMoreRef, canLoadMore } = useInfiniteScroll(containerRef);

  const [lastMessageId, setLastMessageId] = useState<string>("");
  const [previousScrollHeight, setPreviousScrollHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (messages.length && canLoadMore && loadMoreRef.current && !isError) {
      const fetch = async (id: string) => {
        const lastMessage = lastMessageId ? lastMessageId : messages[0]?.id;
        const fetchedMessages = await fetchMessages(signal, id, lastMessage);
        setPreviousScrollHeight(containerRef?.current?.scrollHeight || 0);
        setMessages([...fetchedMessages, ...messages]);

        if (fetchedMessages[0]) {
          setLastMessageId(fetchedMessages[0].id);
        }
      };

      if (id) {
        try {
          const data = fetch(id);
        } catch (error) {
          console.error(error);
        }
      }
    }
  }, [canLoadMore]);

  useLayoutEffect(() => {
    const newHeight = containerRef?.current?.scrollHeight || 0;

    const difference = previousScrollHeight - newHeight;
    if (containerRef.current) {
      containerRef.current.scrollTo(0, -difference);
    }
  }, [previousScrollHeight]);

  return <Box ref={loadMoreRef} />;
}
