import { useMutation } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";

type removeRelationshipConfig = {
  id: string;
  targetId: string;
  type: number;
};

export async function updateRelationship({
  id,
  targetId,
  type
}: removeRelationshipConfig) {
  const res = await axios.put(`/users/${id}/relationships/${targetId}`, {type});

  return res.data;
}

export default function useUpdateRelationship(onSuccess: (data: any) => any) {
  return useMutation({
    mutationFn: updateRelationship,
    mutationKey: queryKeys.UPDATE_RELATIONSHIP,
    onSuccess: (data) => { return onSuccess(data)}
  });
}