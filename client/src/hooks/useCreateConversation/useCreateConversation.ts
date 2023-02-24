import { useQuery, QueryFunctionContext } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";

type QueryKey = [string, { query: string }];


export async function createConversation({
  queryKey,
}: QueryFunctionContext<QueryKey>) {
  // eslint-disable-next-line no-unused-vars
  const [_key, { query }] = queryKey;

  const res = await axios.post("/conversations", { targetId: query });

  return res.data.id;
}

export default function useCreateConversation(query: string, enabled: boolean) {
  return useQuery(
    [queryKeys.CREATE_CONVERSATION, { query }],
    createConversation,
    { enabled }
  );
}
