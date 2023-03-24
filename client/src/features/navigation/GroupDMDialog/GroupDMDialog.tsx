import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";

// Types
import { Relationship } from "@/features/friends/hooks/useGetRelationships/useGetRelationships";

// Hooks
import { useSocket } from "@/hooks";
import { useCreateConversation } from "@/features/chat/hooks";
import { useGetRelationships } from "@/features/friends/hooks";

// Components
import { Box, Button, Flex, Icon, Dialog, Text } from "@/features/ui";
import GroupDMDialogCheckbox from "../GroupDMDialogCheckbox/GroupDMDialogCheckbox";

type Props = {};

export default function GroupConversationDialog({}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [targetIds, setTargetIds] = useState<number[]>([]);
  const { data: relationships } = useGetRelationships(false);
  const navigate = useNavigate();
  const socket = useSocket();
  const { mutate } = useCreateConversation(onCreateConversationSuccess);

  function onChange(checked: boolean | "indeterminate", value: number) {
    if (checked == true) {
      setTargetIds([...targetIds, value]);
    } else if (checked != "indeterminate") {
      const newIds = targetIds.filter((targetId) => targetId != value);
      setTargetIds(newIds);
    }
  }

  function onSubmit() {
    if (targetIds.length > 0) {
      mutate({ targetIds, type: 2 });
    }
  }

  function onOpen(){
    setTargetIds([])
  }

  function onCreateConversationSuccess(
    conversationId: string,
    { targetIds, type }: any
  ) {
    socket.emit("createConversation", conversationId, targetIds, type);
    navigate(`/c/${conversationId}`);
  }

  return (
    <Dialog
      title="Create Group DM"
      description={
        relationships
          ? "Add at least one friend to create a group DM"
          : undefined
      }
      trigger={
        <Button onClick={onOpen} transparent icon="center" css={{ color: "$sage11" }}>
          <Icon icon="pencil-square" />
        </Button>
      }
    >
      {relationships ? (
        <Flex direction="column">
          <Box css={{ minWidth: "100%", maxWidth: "18.75rem" }}>
            <Flex
              direction="column"
              css={{ marginTop: "0.25rem", width: "100%" }}
            >
              {relationships.map((relationship: Relationship) => (
                <GroupDMDialogCheckbox
                  onChange={onChange}
                  key={relationship.id}
                  user={relationship.target}
                />
              ))}
            </Flex>
            <Flex css={{ gap: "$050" }}>
              <DialogPrimitive.Close asChild>
                <Button color="secondary" fluid>
                  Cancel
                </Button>
              </DialogPrimitive.Close>
              <DialogPrimitive.Close asChild>
                <Button disabled={targetIds.length < 1} onClick={onSubmit} fluid>
                  Create
                </Button>
              </DialogPrimitive.Close>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <Flex direction="column" align="center">
          <Text css={{ marginBottom: "$200" }}>
            Add some friends to be able to create a group DM
          </Text>
          <DialogPrimitive.Close asChild>
            <Button color="primary" fluid>
              Close
            </Button>
          </DialogPrimitive.Close>
        </Flex>
      )}
    </Dialog>
  );
}
