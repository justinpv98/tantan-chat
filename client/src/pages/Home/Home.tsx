import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@/stitches.config";
import {
  useAuth,
  useDebouncedValue,
  useSocket,
} from "@/hooks";
import { useCreateConversation, useSearchUsers } from "@/features/chat/hooks";
import useConversations from "./hooks/useConversations";

// Components
import { Flex, SearchInput, Sidebar } from "@/features/ui";
import { ConversationItem, UserItem } from "@/features/navigation";

export default function Home() {
  const navigate = useNavigate();
  const { id: userId } = useAuth();
  const socket = useSocket();

  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const { data: userData } = useSearchUsers(
    debouncedQuery,
    Boolean(debouncedQuery)
  );

  const { data: initialUserData } = useConversations(true);
  const { mutate } = useCreateConversation(onCreateConversationSuccess);

  // Search functions
  function handleBlurSearch(isSearching: boolean) {
    if (!isSearching && !query) {
      setQuery("");
      setSearching(isSearching);
    } else if (isSearching){
      setSearching(isSearching);
    } 
  }

  function handleChangeSearch(value: string) {
    setQuery(value);

    if (value === "") {
      setSearching(false);
    } else {
      setSearching(true);
    }
  }

  // Conversation functions

  async function onUserItemClick(userId: string) {
    mutate(userId);
    setQuery("");
    setSearching(false);
  }

  function onCreateConversationSuccess(targetId: string) {
    socket.emit("createConversation", targetId);
    navigate(`/c/${targetId}`);
  }

  return (
    <Sidebar
      css={{ borderLeft: "none", maxHeight: "100vh", overflow: "scroll" }}
      title="Chats"
    >
      <SearchInput
        handleBlur={handleBlurSearch}
        handleChange={handleChangeSearch}
        value={query}
      />
      <ItemContainer direction="column">
        {initialUserData &&
          !searching &&
          initialUserData.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        {query &&
          searching &&
          userData
            ?.filter((user) => user.id !== userId)
            .map((user) => (
              <UserItem
                user={user}
                key={user.id}
                onClick={() => onUserItemClick(user.id)}
              />
            ))}
      </ItemContainer>
    </Sidebar>
  );
}

const ItemContainer = styled(Flex, {
  gap: "$0",
  marginTop: "$075",
  padding: "$050 $050",
});
