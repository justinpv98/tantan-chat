import { useParams } from "react-router-dom";

import useGetConversation from "../useGetConversation/useGetConversation";

export default function useCurrentConversation() {
  // Used to get person or group that is being talked to
  const { id } = useParams();
  const { data } = useGetConversation(id || "", !!id);

  return data;
}
