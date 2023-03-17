import {
  useQuery,
  useInfiniteQuery,
  QueryFunctionContext,
  UseQueryResult,
} from "react-query";
import axios from "axios";
import queryKeys from "@/constants/queryKeys";

import { Formats } from "../useGetGIFCategories/useGetGIFCategories";

type QueryKey = [string, { query: string }];

export type GIFSearchResult = {
  id: string;
  title: string;
  media_formats: Formats;
  content_description: string;
  itemurl: string;
  hasaudio: false;
  hascaption: string;
  flags: string;
  bg_color: string;
  url: string;
  created: number;
};

export type GIFSearchResults = {
  next: string;
  results: GIFSearchResult[];
};

export async function fetchSearchedGIFs({
  queryKey,
}: QueryFunctionContext<QueryKey>) {
  // eslint-disable-next-line no-unused-vars
  const [_key, { query }] = queryKey;

  const res = await axios.get(
    `https://tenor.googleapis.com/v2/search?key=${
      import.meta.env.VITE_TENOR_API_KEY
    }&q=${query}&client_key=${
      import.meta.env.VITE_TENOR_CLIENT_KEY
    }&media_filter=webm,tinywebm&limit=50`
  );

  return res.data;
}


export default function useSearchGIFs(
  query: string,
  enabled = false
): UseQueryResult<GIFSearchResults> {
  return useQuery([queryKeys.SEARCH_GIFS, { query }], fetchSearchedGIFs, {
    enabled,
    retry: false,
    refetchOnMount: false,
  });
}
