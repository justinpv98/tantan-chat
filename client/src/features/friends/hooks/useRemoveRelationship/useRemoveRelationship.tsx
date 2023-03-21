import { useMutation } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";

type removeRelationshipConfig = {
  id: string;
  targetId: string;
};

export async function removeRelationship({
  id,
  targetId,
}: removeRelationshipConfig) {
  const res = await axios.delete(`/users/${id}/relationships/${targetId}`);

  return res.data;
}

export default function useRemoveRelationship(onSuccess: (data: any) => any) {
  return useMutation({
    mutationFn: removeRelationship,
    mutationKey: queryKeys.REMOVE_RELATIONSHIP,
    onSuccess: (data) => { return onSuccess(data)}
  });
}
