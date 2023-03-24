import React from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@/stitches.config";

// Hooks
import { useSocket } from "@/hooks";
import { useGetRelationships } from "@/features/friends/hooks";
import { useCreateConversation } from "@/features/chat/hooks";

// Components
import { Button, Flex, Icon, Sidebar, Text } from "@/features/ui";
import { UserItem } from "@/features/navigation";

export default function Friends() {
  const navigate = useNavigate();
  const socket = useSocket();
  const { data: relationships } = useGetRelationships(true);

  const { mutate } = useCreateConversation(onCreateConversationSuccess);

  async function onUserItemClick(userId: string) {
    mutate({targetIds: [userId], type: 1});
  }

  function onCreateConversationSuccess(
    conversationId: string,
    {targetIds}: any
  ) {
    socket.emit("createConversation", conversationId, targetIds);
    navigate(`/friends/c/${conversationId}`);
  }

  return (
    <Sidebar
      title="Friends"
    >
      <ItemContainer direction="column">
        {relationships?.length ?
          relationships
            ?.filter((relationship) => relationship.type === 3)
            .map((friendship) => (
              <UserItem
                key={friendship.id}
                user={friendship.target}
                showStatus
                onClick={() => onUserItemClick(friendship.target.id)}
              />
            )): <Text color="lowContrast" css={{paddingInline: "$150"}} >Find friends by searching them up and sending a friend request!</Text>}
      </ItemContainer>
    </Sidebar>
  );
}

const ItemContainer = styled(Flex, {
  gap: "$0",
  marginTop: "$025",
  padding: "$050 $050",
});

export const StyledButton = styled(Button, {
  maxHeight: "2rem",
  padding: 0,
  width: "2rem",
  borderRadius: "$round",
});
