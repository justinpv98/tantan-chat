import React from "react";
import { styled } from "@/stitches.config";

// Types
import { GIFCategory as TGIFCategory } from "../hooks/useGetGIFCategories/useGetGIFCategories";

// Components
import { Image, Text } from "@/features/ui";

type Props = {
  data: TGIFCategory;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function GIFCategory({ data, onClick }: Props) {
  return (
    <CategoryContainer onClick={onClick} value={data.searchterm}>
      <Text
        align="center"
        weight="bold"
        size="lg"
        css={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white" }}
      >
        {data.name}
      </Text>
      <Image src={data.image} loading="lazy" alt="" css={{maxHeight: "208px"}}/>
    </CategoryContainer>
  );
}

export const CategoryContainer = styled("button", {
  position: "relative",
  zIndex: "$base",
  appearance: "none",
  border: "none",
  cursor: "pointer",
  borderRadius: "$050",
  overflow: "hidden",
  background: "none",
  minHeight: "208px",

  "&::before": {
    position: "absolute",
    content: "",
    width: "100%",
    height: "100%",
    opacity: 1,
    mixBlendMode: "hard-light",
    backgroundColor: "#0f291e",
    zIndex: 0,
  },

  "&::focus": {
    outlineColor: "$amber7"
  }
});
