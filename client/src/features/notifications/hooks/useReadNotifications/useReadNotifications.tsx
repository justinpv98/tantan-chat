import { useMutation } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";

// Hooks
import { useAuth } from "@/hooks";

export async function readNotifications(targetId: string | number) {
  const res = await axios.put(`/users/${targetId}/notifications`);

  return res.data;
}

export default function useReadNotifications(
  onSuccess: any
) {
  const { id } = useAuth();

  return useMutation(() => readNotifications(id), {
    mutationKey: queryKeys.READ_NOTIFICATIONS,
    onSuccess: onSuccess,
  });
}
