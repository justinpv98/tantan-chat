import { styled } from "@/stitches.config";
import Box from "../../Box/Box";
import {_Text} from "../../Text/Text";

import { CSS } from "@stitches/react";

type Props = {
  children?: React.ReactNode;
  css?: CSS;
  htmlFor: string;
  label: string;
};

export default function Label({
  children,
  css,
  htmlFor,
  label,
  ...rest
}: Props) {
  return (
    <LabelText
      as="label"
      size="sm"
      weight="medium"
      htmlFor={htmlFor}
      css={css}
      {...rest}
    >
      {label}
    </LabelText>
  );
}

const LabelText = styled(_Text, {
  display: "inline-block",
  userSelect: "none",
  marginBlockEnd: "$050",
});
