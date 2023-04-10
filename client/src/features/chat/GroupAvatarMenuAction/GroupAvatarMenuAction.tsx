import React, { Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { styled } from "@/stitches.config";

// Constants
import queryKeys from "@/constants/queryKeys";

// Types
import { ConversationData } from "../hooks/useGetConversations/useGetConversations";

// Hooks
import { useFileHandler } from "@/hooks";
import { useChangeGroupAvatar } from "../hooks";

// Components
import { Icon, Text } from "@/features/ui";

type Props = {};

export default function GroupAvatarMenuAction({}: Props) {
  const { id } = useParams();
  const { file, uploadFile } = useFileHandler();
  const { mutate: changeGroupAvatar } = useChangeGroupAvatar(
    onChangeGroupAvatarSuccess
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (file && id) {
      changeGroupAvatar({ file, conversationId: id });
    }
  }, [file]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    uploadFile(e);
  }

  function onChangeGroupAvatarSuccess(data: { id: number; avatar: string }) {
    queryClient.setQueryData(queryKeys.GET_CONVERSATIONS, (oldData: any) => {
      let newData: any;
      if (oldData && oldData.length) {
        newData = [...oldData];
      }

      if (newData) {
        const conversation = oldData.find(
          (conversation: ConversationData) => conversation.id == newData.id
        );
        if (conversation) conversation.avatar = data.avatar;
        return newData;
      } else {
        return;
      }
    });
  }

  return (
    <Fragment>
      <HiddenInput type="file" id="group-avatar" onInput={onFileChange} />

      <label htmlFor="group-avatar">
        <MenuAction>
          <Icon icon="photo" />
          <Text size="sm" weight="semibold" css={{ cursor: "pointer" }}>
            Change Group Avatar
          </Text>
        </MenuAction>
      </label>
    </Fragment>
  );
}

const HiddenInput = styled("input", {
  display: "none",
});

const MenuAction = styled("span", {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  paddingBlock: "$150",
  paddingInline: "$075",
  color: "$onBackground",
  gap: "$100",
  height: "$300",
  borderRadius: "$050",
  "&:hover": {
    background: "$sage4",
  },
});
