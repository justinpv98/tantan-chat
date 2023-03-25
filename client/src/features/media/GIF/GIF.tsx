import { useState } from "react";
import { styled } from "@/stitches.config";

// Types
import { GIFSearchResult } from "../hooks/useSearchGIFs/useSearchGIFs";

export type Props = {
  onClick?: (result: GIFSearchResult) => void;
  result: GIFSearchResult & GIF;
};

type GIF = {
  media_url?: string;
  description?: string;
};

export default function GIF({ onClick, result }: Props) {
  return (
    <ImageContainer onClick={onClick ? () => onClick(result) : () => {}}>
      <Video loop muted autoPlay>
        <source
          src={result?.media_formats?.webm?.url || result?.media_url}
          type="video/webm"
        />
        <p className="sr-only">
          {result?.content_description || result?.description}
        </p>
      </Video>
    </ImageContainer>
  );
}

const Video = styled("video", {
  width: "100%",
  objectFit: "fill",
  borderRadius: "$050",
});

const ImageContainer = styled("div", {
  appearance: "none",
  background: "none",
  border: "none",
  maxHeight: "320px",
  maxWidth: "300px",
  cursor: "pointer",
  overflow: "hidden",

  overflowWrap: "break-word",
});
