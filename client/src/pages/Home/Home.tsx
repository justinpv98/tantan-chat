import { useState } from "react";
import { useDebounce, useSearchUsers } from "@/hooks";

import queryClient from "@/config/queryClient";
import queryKeys from "@/constants/queryKeys";

import ConversationItem from "./components/ConversationItem";
import { Box, Flex, SearchInput, Sidebar } from "@/features/ui";
import { UserItem } from "@/features/navigation";

type Props = {};

export default function Home({}: Props) {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 300);

  const { isError, isLoading, data } = useSearchUsers(
    debouncedQuery,
    Boolean(debouncedQuery)
  );

  function handleBlurSearch(isSearching: boolean) {
    if (!isSearching) {
      setQuery("");
    }
    setSearching(isSearching);
  }

  return (
    <Sidebar css={{borderLeft: "none"}} title="Chats">
      <SearchInput
        handleBlur={handleBlurSearch}
        handleChange={setQuery}
        value={query}
      />
      {query && data && (
        <Flex direction="column" css={{ gap: "$0", marginTop: "$075",  padding: "$100 $050" }}>
          {data.map((user) => (
            <UserItem user={user} key={user.id} />
          ))}
        </Flex>
      )}
    </Sidebar>
  );
}
