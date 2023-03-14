import { useQuery, UseQueryResult } from "react-query";
import axios from "axios";
import queryKeys from "@/constants/queryKeys";

export type GIFCategoryResult = {
  locale: string;
  tags: GIFCategory[];
}

 export type GIFCategory = {
  searchterm: string;
  path: string;
  image: string;
  name: string;
}


export type Formats = {
  "webm": MediaObject,
  "tinywebm": MediaObject
}

export type MediaObject = {
  url: string;
  dims: number[],
  duration: number;
  size: number;
}

export async function fetchGIFCategories() {
  const res = await axios.get(
    `https://tenor.googleapis.com/v2/categories?key=${
      import.meta.env.VITE_TENOR_API_KEY
    }&client_key=${import.meta.env.VITE_TENOR_CLIENT_KEY}`
  );

  return res.data;
}

export default function useGetGIFCategories(): UseQueryResult<GIFCategoryResult, Error> {
  return useQuery([queryKeys.GET_GIF_CATEGORIES], fetchGIFCategories, {
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
