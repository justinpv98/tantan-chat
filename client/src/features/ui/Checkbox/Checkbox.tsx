import { useState } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { styled } from "@/stitches.config";
import { darkTheme } from "@/stitches.config";

// Hooks
import { useId } from "react";
import { useTheme } from "@/hooks";

// Components
import Flex from "../Flex/Flex";
import Icon from "../Icon/Icon";

type Props = {
  label: React.ReactNode;
  onChange: (checked: boolean | 'indeterminate', value: number) => any;
  value: any;
};

export default function Checkbox({ label, onChange, value }: Props) {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>()
  const { theme } = useTheme();
  const id = useId();

  function onCheckedChange(checked: boolean | 'indeterminate'){
    onChange(checked, Number(value));
    setChecked(checked)
  }


  return (
    <CheckboxContainer align="center" justify="between" fluid>
      <Label htmlFor={id} >{label}</Label>
      <CheckboxRoot
        id={id}
        className={theme === "dark" ? darkTheme : undefined}
        value={value}
        onCheckedChange={(checked) => onCheckedChange(checked)}
        isChecked={checked === 'indeterminate' ? false : !!checked}
      >
        <CheckboxIndicator>
          <Icon size={20} icon="checkbox" />
        </CheckboxIndicator>
      </CheckboxRoot>
    </CheckboxContainer>
  );
}

const CheckboxContainer = styled(Flex, {
  gap: "$100",
  width: "100%",
  padding: "$025 $050",
  borderRadius: "8px",
  cursor: "pointer",

  "&:hover": {
    background: "$sage4"
  },

  variants: {
    fluid: {
      true: {
        width: "100%"
      }
    }
  }
})

const CheckboxRoot = styled(CheckboxPrimitive.Root, {
  all: "unset",
  width: "$125",
  height: "$125",
  borderRadius: 4,
  border: "2px solid $primary",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "$125",
  boxShadow: `0 2px 10px $blackA7`,
  "&:focus:not(:focus-visible)": {  outline: "none" },

  "&:focus-visible": {
    outline: "2px solid $amber9",
    borderRadius: "4px",
  },

  variants: {
    isChecked: {
      true: {
        background: "$primary"
      }
    }
  }

});

const CheckboxIndicator = styled(CheckboxPrimitive.Indicator, {
  color: "white",
  width: "100%",
  height: "100%"
});

const Label = styled("label", {
  color: "white",
  cursor: "pointer",
  fontSize: "$087",
  lineHeight: 1,
  width: "100%",
  userSelect: "none"
});
