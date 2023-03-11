import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";

// Hooks
import { useAuth } from "@/hooks";


import { Participant } from "@/features/chat/hooks/useGetConversation/useGetConversation";

export type ConversationData = {
  id: number;
  name: string | null;
  type: 1 | 2;
  participants: Participant[];
  last_message: number;
};

export async function fetchConversation() {
  const res = await axios.get(`/conversations`);

  return res.data as ConversationData[];
}

export default function useConversations(enabled: boolean = false) {
  const [currentConversation, setCurrentConversation] =
    useState<ConversationData>();

  return {
    currentConversation,
    setCurrentConversation,
    ...useQuery([queryKeys.GET_CONVERSATIONS], fetchConversation, {
      keepPreviousData: true,
      enabled,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: false,
      staleTime: Infinity,
    }),
  };
}

export function useUpdateConversations() {
  const queryClient = useQueryClient();
  const {id: userId} = useAuth();

  function updateConversations(data: ConversationData) {
  
    queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, (oldData: any) => {
      const idSet = new Set();
      const convos = [data, ...oldData].filter(({ id }) =>
        idSet.has(id) ? false : idSet.add(id)
      );

      return convos;
    });
  }

  return updateConversations;
}
