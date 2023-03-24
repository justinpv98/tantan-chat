import { useQuery, QueryFunctionContext } from "react-query";
import { useAuth } from "@/hooks";
import axios from "@/config/axios";

import queryKeys from "@/constants/queryKeys";

export type User = {
  id: string ;
  username: string;
  profile_picture: string | null;
  status: 1 | 2 | 3 | 4;
};

export type Relationship = {
  id: string;
  type: 1 | 2 | 3 | 4;
  actor: string;
  target: User;
};

type QueryKey = [string, string];

export async function fetchRelationships({
  queryKey,
}: QueryFunctionContext<QueryKey>) {
  const [_key, userId] = queryKey;
  const res = await axios.get(`/users/${userId}/relationships`);

  return res.data as Relationship[];
}

type getRelationshipOptions = {
  userId: string;
};

export default function useGetRelationships(enabled: boolean) {
  const {id: userId} = useAuth();
  return useQuery(
    [queryKeys.GET_RELATIONSHIPS, userId],
    fetchRelationships,
    {
      keepPreviousData: true,
      enabled,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 3,
      staleTime: 1000 * 60 * 5,
    }
  );
}
