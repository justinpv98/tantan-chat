import { useParams } from "react-router-dom";

import useAuth from "../useAuth/useAuth";
import useGetConversation from "../useGetConversation/useGetConversation";
import { Participant } from "../useGetConversation/useGetConversation";

export default function useGetTarget() {
  // Used to get person or group that is being talked to
  const { id } = useParams();
  const { id: userId } = useAuth();
  const { data } = useGetConversation(id || "", !!id);


  let target;
  if (data?.type === 1) {
    target = data.participants.filter(
      (participant) => participant.id !== userId
    )[0];
  }

  return target as Participant;
}
