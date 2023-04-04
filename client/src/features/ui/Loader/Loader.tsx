import React from "react";
import { keyframes } from "@stitches/react";
import { styled } from "@/stitches.config";

import Icon from "../Icon/Icon";

type Props = {};

export default function Loader({}: Props) {
  return (
    <LoaderContainer>
      <Icon icon="loader" />
    </LoaderContainer>
  );
}

const spin = keyframes({
  from: {
    transform: "rotate(0deg)"
  },
  to: {
    transform: "rotate(359deg)"
  }
});

const LoaderContainer = styled("div", {
    animation: `${spin} 1s infinite`
})

