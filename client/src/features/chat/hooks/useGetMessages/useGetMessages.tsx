import { useLayoutEffect, useRef, useState } from "react";
import axios from "@/config/axios";

import useAbortController from "@/hooks/useAbortController/useAbortController";
import useCurrentConversation from "../useCurrentConversation/useCurrentConversation";

type QueryKey = [string, { query: string }];

export type Participant = {
  id: string;
  username: string;
  profile_picture?: string;
  status: 1 | 2 | 3 | 4;
};

export type Message = {
  attachments: Attachment[];
  id: string;
  author: Participant;
  data: string;
  type: number;
  media_url: string;
  description: string;
  parent: string;
  conversation: number;
  created_at: string;
  modified_at: string | null;
} | null;

export type Attachment = {
  id: string;
  message: string;
  file_name: string;
  url: string;
};

export async function fetchMessages(
  signal: AbortSignal,
  query: string | number,
  lastMessageId?: string | number
) {
  const queryString = lastMessageId ? `?before=${lastMessageId}` : "";
  const res = await axios.get(
    `/conversations/${query}/messages${queryString}`,
    {
      signal
    }
  );

  return res.data as Message[];
}

export default function useGetMessages(lastMessageId?: string | number) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const getSignal = useAbortController();
  const {data: conversation} = useCurrentConversation();

  useLayoutEffect(() => {
    const fetch = async (id: number) => {
      setIsLoading(true)
      const messages = await fetchMessages(getSignal(), id);
      setMessages(messages);
    };

    if (conversation?.id) {
      try {
        fetch(conversation.id);
        setIsLoading(false);
      } catch (isError) {
        setIsError(true);
        setIsLoading(false);
      }
    }
  }, [conversation]);

  return { messages, setMessages, isLoading, isError };
}
