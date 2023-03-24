import { useMutation } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";

import { ConversationData } from "../useGetConversations/useGetConversations";

type Config = {
  targetIds: string[] | number[];
  type: ConversationData['type'];
}
export async function createConversation({targetIds, type}: Config ) {
  const res = await axios.post("/conversations", { targetIds, type });

  return res.data.id;
}

export default function useCreateConversation(
  onSuccess?: (conversationId: string, {targetIds, type}: Config) => void
) {
  
  return useMutation(createConversation, {
    mutationKey: queryKeys.CREATE_CONVERSATION,
    onSuccess: onSuccess,
  });
}
