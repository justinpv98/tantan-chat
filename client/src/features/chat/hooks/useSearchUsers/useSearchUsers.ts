import { useQuery, QueryFunctionContext } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";

type QueryKey = [string, { query: string }];

export type UserData = {
  id: string;
  username: string;
  profile_picture?: string | null;
  status: 1 | 2 | 3 | 4;
};

export async function fetchUsers({ queryKey }: QueryFunctionContext<QueryKey>) {
  // eslint-disable-next-line no-unused-vars
  const [_key, { query }] = queryKey;

  const res = await axios.get("/users/search", {
    params: { username: query },
  });

  return res.data as UserData[] | [] | null;
}

export default function useSearchUsers(query: string, enabled: boolean) {
  return useQuery([queryKeys.SEARCH_USERS, { query }], fetchUsers, {
    keepPreviousData: true,
    enabled,
    retry: false,
  });
}
