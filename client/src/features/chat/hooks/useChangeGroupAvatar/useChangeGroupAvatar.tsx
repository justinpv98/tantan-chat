import { useMutation } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";

import { ConversationData } from "../useGetConversations/useGetConversations";

type Config = {
  file: File;
  conversationId: string;
}
export async function changeGroupAvatar({file, conversationId}: Config ) {
    const formData = new FormData();
    formData.append('file', file)
  const res = await axios.post(`/conversations/${conversationId}/avatar`, formData );

  return res.data.id;
}

export default function useChangeGroupAvatar(
  onSuccess?: (data: any) => void
) {
  return useMutation(changeGroupAvatar, {
    mutationKey: queryKeys.CHANGE_GROUP_AVATAR,
    onSuccess: onSuccess,
  });
}
