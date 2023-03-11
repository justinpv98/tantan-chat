import { useMutation } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";

export async function createConversation(targetId: string) {
  const res = await axios.post("/conversations", { targetId });

  return res.data.id;
}

export default function useCreateConversation(
  onSuccess?: (targetId: string) => void
) {
  return useMutation(createConversation, {
    mutationKey: queryKeys.CREATE_CONVERSATION,
    onSuccess: onSuccess,
  });
}
