import React from "react";
import { styled } from "@/stitches.config";
//@ts-expect-error
import Masonry  from "react-responsive-masonry";

// Components
import GIF from "../GIF/GIF";

// Types
import { GIFSearchResult } from "../hooks/useSearchGIFs/useSearchGIFs";

type Props = {
  onClick: (result: GIFSearchResult) => void;
  results: GIFSearchResult[];
};

export default function GIFSearchResults({ onClick, results }: Props) {
  return (
    <Container>
      <Masonry columnsCount={2} gutter=".75rem">
        {results.map((result) => {
          return (
            <Button>
              <GIF onClick={onClick} key={result.id} result={result} />
            </Button>
          );
        })}
      </Masonry>
    </Container>
  );
}

const Button = styled("button", {
  appearance: "none",
  background: "none",
  border: "none",
  borderRadius: "$050",
  maxHeight: "320px",
  maxWidth: "300px",
  cursor: "pointer",
  overflow: "hidden",
});

const Container = styled("div", {
  paddingTop: "$050",
  px: "$075",
});
