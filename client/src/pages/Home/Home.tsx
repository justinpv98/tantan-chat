import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateConversation, useDebouncedValue, useSearchUsers } from "@/hooks";

// Components
import { Flex, SearchInput, Sidebar } from "@/features/ui";
import { UserItem } from "@/features/navigation";

type Props = {};

export default function Home({}: Props) {
  // target id to find conversation from searched user
  const [targetId, setTargetId] = useState("");
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const debouncedQuery = useDebouncedValue(query, 300);

  const {
    data: conversationId,
    isSuccess,
    isRefetching,
  } = useCreateConversation(targetId, !!targetId);

  const { data: userData } = useSearchUsers(
    debouncedQuery,
    Boolean(debouncedQuery)
  );

  useEffect(() => {
    if ((isRefetching && conversationId) || (isSuccess && conversationId)) {
      navigate(`/c/${targetId}`);
    }
  }, [targetId, conversationId]);

  function handleBlurSearch(isSearching: boolean) {
    if (!isSearching) {
      setQuery("");
    }
    setSearching(isSearching);
  }

  function onUserItemClick(userId: string) {
    setQuery("");
    setSearching(false);
    setTargetId(userId);
  }

  return (
    <Sidebar css={{ borderLeft: "none" }} title="Chats">
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
          {userData?.map((user) => (
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
