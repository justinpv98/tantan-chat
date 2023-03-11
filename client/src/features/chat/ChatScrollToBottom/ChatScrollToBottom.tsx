import React, { useLayoutEffect } from "react";

// Types
import { Message } from "../hooks/useGetMessages/useGetMessages";

// Hooks
import { useCurrentConversation } from "@/features/chat/hooks";

// Components
import { Box } from "@/features/ui";

type Props = {
  containerRef: React.MutableRefObject<HTMLOListElement | null>;
  isRefVisible: boolean;
  messages: Message[];
  observedRef: React.MutableRefObject<HTMLDivElement | null>;
  setIsRefVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ChatScrollToBottom({
  containerRef,
  observedRef,
  messages,
  setIsRefVisible,
  isRefVisible,
}: Props) {
  const data = useCurrentConversation();

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsRefVisible(entry.isIntersecting);
      },
      { root: containerRef?.current, rootMargin: "0px 0px 300px 0px" }
    );

    if (observedRef?.current) {
      observer.observe(observedRef.current);
    }

    if (isRefVisible) {
      observedRef.current?.scrollIntoView();
    }

    return () => {
      if (observedRef?.current) {
        observer.unobserve(observedRef.current);
      }
    };
  }, [observedRef, messages]);

  useLayoutEffect(() => {
    observedRef.current?.scrollIntoView();
  }, [data?.id]);

  return <Box ref={observedRef} />;
}
