import { useMutation } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";

type SendFriendRequestConfig = {
  id: string;
  targetId: string;
};

export async function sendFriendRequest({
  id,
  targetId,
}: SendFriendRequestConfig) {
  const res = await axios.post(`/users/${id}/relationships`, { targetId });

  return res.data;
}

export default function useCreateRelationship(onSuccess: (data: any) => void) {
  return useMutation({
    mutationFn: sendFriendRequest,
    mutationKey: queryKeys.SEND_FRIEND_REQUEST,
    onSuccess: (data) => { return onSuccess(data)},
  });
}
