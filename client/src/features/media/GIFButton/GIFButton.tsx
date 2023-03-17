import React, { useState } from "react";
import { styled } from "@/stitches.config";

// Types
import { GIFSearchResult } from "../hooks/useSearchGIFs/useSearchGIFs";

// Hooks
import { useDebouncedValue, useSocket, useTheme } from "@/hooks";
import { useCurrentConversation } from "@/features/chat/hooks";
import { useGetGIFCategories, useSearchGIFs } from "../hooks";

// Components
import { Box, Icon, Popover, SearchInput } from "@/features/ui";
import GIFCategory from "../GIFCategory/GIFCategory";
import GIFSearchResults from "../GIFSearchResults/GIFSearchResults";

export default function GIFButton() {
  const socket = useSocket();
  const conversation = useCurrentConversation();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 200);

  const { data: categories } = useGetGIFCategories();
  const { data: searchResults } = useSearchGIFs(
    debouncedQuery,
    isSearching && debouncedQuery === query
  );

  const { theme } = useTheme();

  const themedStickyBar =
    theme === "light"
      ? { boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)" }
      : { borderBottom: "1px solid $sage7" };

  function onClickCategory(e: React.MouseEvent<HTMLButtonElement>) {
    setQuery((e.target as HTMLButtonElement).value);
    setIsSearching(true);
  }

  function handleBlur(isSearching: boolean) {
    if (!isSearching && !query) {
      setQuery("");
      setIsSearching(false);
    } else if (isSearching && query) {
      setIsSearching(true);
    }
  }

  function handleChange(value: string) {
    setQuery(value);

    if (value === "") {
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  }

  function onFocusOutside() {
    setIsPopoverOpen(false);
    setQuery("");
    setIsSearching(false);
  }

  function onClickOpen(){
    setQuery("");
    setIsPopoverOpen(!isPopoverOpen);
  }

  function onClickResult(result: GIFSearchResult) {
    socket.emit("message", {
      conversation: conversation?.id,
      media_url: result.media_formats.webm.url,
      description: result.content_description,
      type: 2,
    });
    setIsPopoverOpen(false);
    setIsSearching(false);
  }

  return (
    <Popover
      trigger={<Icon icon="gif" />}
      css={{
        padding: "12px"
      }}
      open={isPopoverOpen}
      onClickTrigger={() => onClickOpen()}
      onFocusOutside={() => onClickOpen()}
      contentCSS={{
        width: "100vw",
        minHeight: "400px",
        maxHeight: "400px",
        overflow: "scroll",
        position: "relative",
        padding: "0 0 $075 0",

        "@md": {
          maxWidth: "480px",
        },
      }}
    >
      <Box
        css={{
          width: "100%",
          background: "$background",
          padding: "$025 0",
          position: "sticky",
          top: "0",
          zIndex: "$onBase",
          ...themedStickyBar,
        }}
      >
        <SearchInput
          placeholder="Search Tenor"
          handleBlur={handleBlur}
          handleChange={handleChange}
          value={query}
        />
      </Box>

      {categories && !isSearching && (
        <Grid css={{ paddingTop: "$050", px: "$075" }}>
          {categories?.tags.map((tag) => (
            <GIFCategory onClick={onClickCategory} key={tag.name} data={tag} />
          ))}
        </Grid>
      )}

      {isSearching && searchResults?.results && (
        <GIFSearchResults onClick={onClickResult} results={searchResults.results} />
      )}
    </Popover>
  );
}

export const Grid = styled("div", {
  display: "grid",
  gap: "$050",
  gridTemplateColumns: "1fr 1fr",
});
