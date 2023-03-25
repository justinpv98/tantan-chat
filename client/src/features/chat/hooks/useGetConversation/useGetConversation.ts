import { useQuery, QueryFunctionContext } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";
import { ConversationData } from "@/features/chat/hooks/useGetConversations/useGetConversations";

type QueryKey = [string, { query: string }];

export async function fetchConversation({
  queryKey,
}: QueryFunctionContext<QueryKey>) {
  // eslint-disable-next-line no-unused-vars
  const [_key, { query }] = queryKey;

  const res = await axios.get(`/conversations/${query}`);

  return res.data as ConversationData;
}

export default function useGetConversation(query: string, enabled: boolean) {

  return {
    ...useQuery([queryKeys.GET_CONVERSATION, { query }], fetchConversation, {
      keepPreviousData: true,
      enabled,
      staleTime: Infinity,
    }),
  };
}
