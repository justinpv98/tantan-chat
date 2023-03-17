import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";

// Hooks
import { useAuth } from "@/hooks";

import { Participant } from "@/features/chat/hooks/useGetMessages/useGetMessages";

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

export default function useGetConversations(enabled: boolean = false) {
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
  const { id: userId } = useAuth();

  function updateConversations(data: ConversationData) {
    queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, (oldData: any) => {
      let convos;
      if (oldData) {
        const idSet = new Set();
        convos = [data, ...oldData].filter(({ id }) =>
          idSet.has(id) ? false : idSet.add(id)
        );
      } else {
        convos = [data];
      }
      
      return convos;
    });
  }

  return updateConversations;
}
