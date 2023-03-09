import { useLayoutEffect, useRef, useState } from "react";
import axios from "@/config/axios";

import useAbortController from "../useAbortController/useAbortController";
import useCurrentConversation from "../useCurrentConversation/useCurrentConversation";

type QueryKey = [string, { query: string }];

export type Participant = {
  id: string;
  username: string;
  profile_picture: string | null;
};

export type Message = {
  attachments: Attachment[];
  id: string;
  author: string;
  data: string;
  parent: string;
  is_read: boolean;
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
  query: string,
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
  const [isError, setIsError] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const getSignal = useAbortController();
  const conversation = useCurrentConversation();

  useLayoutEffect(() => {
    const fetch = async (id: string) => {
      const messages = await fetchMessages(getSignal(), id);
      setMessages(messages);
    };

    if (conversation?.id) {
      try {
        fetch(conversation.id);
      } catch (isError) {
        setIsError(true);
      }
    }
  }, [conversation]);

  return { messages, setMessages, isError };
}