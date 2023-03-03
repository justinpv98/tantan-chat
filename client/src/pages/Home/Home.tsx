import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAuth,
  useCreateConversation,
  useDebouncedValue,
  useSearchUsers,
  useSocket
} from "@/hooks";

// Components
import { Flex, SearchInput, Sidebar } from "@/features/ui";
import { UserItem } from "@/features/navigation";

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

  const { mutate } = useCreateConversation(onCreateConversationSuccess);


  // Search functions
  function handleBlurSearch(isSearching: boolean) {
    if (!isSearching) {
      setQuery("");
    }
    setSearching(isSearching);
  }

  // Conversation functions
  async function onUserItemClick(userId: string) {
    mutate(userId);
    setQuery("");
    setSearching(false);
  }

  function onCreateConversationSuccess(targetId: string) {
    socket.emit("createConversation", targetId)
    navigate(`/c/${targetId}`);
  }

  return (
    <Sidebar
      css={{ borderLeft: "none", maxHeight: "100vh", overflow: "scroll" }}
      title="Chats"
    >
      <SearchInput
        handleBlur={handleBlurSearch}
        handleChange={setQuery}
        value={query}
      />
      {query && searching && (
        <Flex
          direction="column"
          css={{ gap: "$0", marginTop: "$075", padding: "$100 $050" }}
        >
          {userData
            ?.filter((user) => user.id !== userId)
            .map((user) => (
              <UserItem
                user={user}
                key={user.id}
                onClick={() => onUserItemClick(user.id)}
              />
            ))}
        </Flex>
      )}
    </Sidebar>
  );
}
