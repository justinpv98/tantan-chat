import { useQuery, QueryFunctionContext } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";

type QueryKey = [string, { query: string }];

type ConversationData = {
  id: string;
  name: string | null;
  type: 1 | 2 | 3 | 4;
  participants: Participant[];
  messages: Message[];
  lastMessageId: string;
}

export type Participant = {
  id: string;
  username: string;
  profile_picture: string | null;
}

export type Message = {
  attachments: Attachment[]
  id: string;
  author: string;
  data: string;
  parent: string;
  is_read: boolean;
  created_at: string;
  modified_at: string | null;
} | null

export type Attachment = {
  id: string;
  message: string;
  file_name: string;
  url: string;
}

export async function fetchConversation({
  queryKey,
}: QueryFunctionContext<QueryKey>) {
  // eslint-disable-next-line no-unused-vars
  const [_key, { query }] = queryKey;

  const res = await axios.get(`/conversations/${query}`);

  return res.data as ConversationData;
}

export default function useGetConversation(query: string, enabled: boolean) {
  return useQuery([queryKeys.GET_CONVERSATION, { query }], fetchConversation, {
    keepPreviousData: true,
    enabled,
    staleTime: Infinity
  });
}
