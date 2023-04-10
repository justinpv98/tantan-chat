import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAuth, useSocket } from "@/hooks";
import useGetConversation from "../useGetConversation/useGetConversation";
import { Participant } from "../useGetMessages/useGetMessages";

export default function useGetTarget() {
  // Used to get person or group that is being talked to
  const { id } = useParams();
  const { id: userId } = useAuth();
  const { data, isSuccess } = useGetConversation(id || "", !!id);


  let target: Participant | undefined;

  if (data?.type === 1) {
    target = data?.participants.filter(
      (participant) => participant.id !== userId
    )[0];
  }

  return {data, target, isSuccess}
}
