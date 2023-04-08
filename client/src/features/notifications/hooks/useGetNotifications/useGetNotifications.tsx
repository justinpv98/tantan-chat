import { useQuery, QueryFunctionContext } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";
import { User } from "@/features/friends/hooks/useGetRelationships/useGetRelationships";

// Hooks
import { useAuth } from "@/hooks";

type QueryKey = [string, { query: string }];

export type NotificationData = {
  id: number;
  actor: User;
  target: number;
  type: number;
  read: boolean;
};

export async function fetchNotifications({
  queryKey,
}: QueryFunctionContext<QueryKey>) {
  // eslint-disable-next-line no-unused-vars
  const [_key, { query }] = queryKey;

  const res = await axios.get(`users/${query}/notifications`);

  return res.data as NotificationData[];
}

export default function useGetNotifications(enabled: boolean) {
  const { id } = useAuth();
  return useQuery(
    [queryKeys.GET_NOTIFICATIONS, { query: id }],
    fetchNotifications,
    {
      keepPreviousData: true,
      enabled,
      staleTime: Infinity,
    }
  );
}
