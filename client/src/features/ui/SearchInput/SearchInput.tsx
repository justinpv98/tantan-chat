import React from "react";
import { styled } from "@/stitches.config";

import Box from "../Box/Box";
import Flex from "../Flex/Flex";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";

type Props = {
  handleBlur?: (isSearching: boolean) => void;
  handleChange?: (value: string) => void;
  value?: string;
};

export default function SearchInput({
  handleBlur,
  handleChange,
  value,
}: Props) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleChange && handleChange(e.target.value);
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    handleBlur && handleBlur(true);
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    // change to onclickoutside?
  }

  return (
    <SearchContainer>
      <Flex
      align="center"
        css={{
          py: "$075",
          px: "$050",
          maxWidth: "fit-content",
        }}
      >
        <Icon icon="magnifying-glass" size={20} />
      </Flex>

      <Input
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
      />
    </SearchContainer>
  );
}

const SearchContainer = styled(Flex, {
  backgroundColor: "$sage3",
  borderRadius: "$round",
  color: "$sage11",
  maxHeight: "$250",
  marginInline: "$100",
  marginBlock: "$075",
  paddingInline: "$050",


  "&:focus-within": {
    outline: "1px solid $green11",
  },
});

const Input = styled("input", {
  backgroundColor: "$sage3",
  border: "none",
  color: "$sage12",
  fontSize: "$100",

  "&:focus": {
    outline: "none",
  },
});
