import { useMutation } from "react-query";
import axios from "@/config/axios";
import queryKeys from "@/constants/queryKeys";

type PostImageProps = {
  file: File;
  conversationId: string;
}

export async function postImage({file, conversationId}: PostImageProps) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(`/conversations/${conversationId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return res.data;
}

export default function usePostImage() {
  return useMutation({
    mutationFn: postImage,
    mutationKey: queryKeys.POST_IMAGE,
  });
}
