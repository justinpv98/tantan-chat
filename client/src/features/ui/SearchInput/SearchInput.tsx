import React from "react";
import { styled } from "@/stitches.config";

// types
import { CSS } from "@stitches/react";

// Components
import Flex from "../Flex/Flex";
import Icon from "../Icon/Icon";

type Props = {
  css?: CSS;
  handleBlur?: (isSearching: boolean) => void;
  handleChange?: (value: string) => void;
  placeholder?: string;
  value?: string;
};

export default function SearchInput({
  css,
  handleBlur,
  handleChange,
  placeholder,
  value,
}: Props) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleChange && handleChange(e.target.value);
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    handleBlur && handleBlur(true);
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    handleBlur && handleBlur(false);
  }

  return (
    <SearchContainer css={css}>
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
        onChange={(e) => onChange(e)}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        placeholder={placeholder}
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
  overflow: "hidden",


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
