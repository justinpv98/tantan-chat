import React, { useState, useEffect, useId, forwardRef } from "react";
import { styled } from "@/stitches.config";


import Box from "../../Box/Box";
import Button from "../../Button/Button";
import Icon from "../../Icon/Icon";
import Label from "../Label/Label";
import Text from "../../Text/Text";

import { CSS } from "@stitches/react";
import { IconProps } from "../../Icon/Icon";

export type TextInputProps = {
  autoComplete?:
    | "on"
    | "off"
    | "name"
    | "username"
    | "new-password"
    | "password"
    | "email";
  buttonAriaLabel?: string;
  css?: CSS;
  children?: React.ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: React.ReactNode | string;
  helperText?: string;
  icon?: IconProps["icon"];
  iconPosition?: "left" | "right";
  id: string;
  label: string;
  name: string;
  onButtonClick?: React.PointerEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  success?: boolean;
  testId?: string;
  type?: "text" | "search" | "url" | "tel" | "email" | "password";
  value?: string;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      autoComplete,
      buttonAriaLabel,
      children,
      css,
      defaultValue,
      disabled,
      error,
      errorMessage,
      helperText,
      icon,
      iconPosition = "right",
      id,
      label,
      name,
      onButtonClick,
      onBlur,
      onChange,
      onFocus,
      placeholder,
      readOnly,
      required = true,
      success,
      testId,
      type = "text",
      value,
      ...rest
    },
    ref
  ) => {
    /* based on wpds */
    const [errorId, setErrorId] = useState<string>();
    const [helperId, setHelperId] = useState<string>();
    const accessibilityId = useId();

    useEffect(() => {
      setErrorId("input-error-" + accessibilityId);
      setHelperId("input-helper-" + accessibilityId);
    }, []);

    function handleOnBlur(e: React.FocusEvent<HTMLInputElement>) {
      onBlur && onBlur(e);
    }

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
      onChange && onChange(e);
    }

    function handleOnFocus(e: React.FocusEvent<HTMLInputElement>) {
      onFocus && onFocus(e);
    }

    return (
      <Box css={{ ...css }}>
        <Label label={label} htmlFor={id} />
        <InputContainer isInvalid={error} isDisabled={disabled}>
          {icon && iconPosition === "left" && (
            <IconContainer isDisabled={disabled}>
              <Icon size="20" icon={icon} />
            </IconContainer>
          )}
          <Input
            autoComplete={autoComplete}
            data-testid={testId}
            defaultValue={defaultValue}
            disabled={disabled}
            id={id}
            onBlur={handleOnBlur}
            onChange={handleOnChange}
            onFocus={handleOnFocus}
            placeholder={placeholder}
            readOnly={readOnly}
            ref={ref}
            required={required}
            type={type}
            aria-invalid={error}
            aria-errormessage={error ? errorId : undefined}
            aria-describedby={helperText ? helperId : undefined}
            value={value}
            {...rest}
          />
          {icon && iconPosition === "right" && (
            <Button
              aria-label={buttonAriaLabel}
              disabled={disabled}
              css={{ color: "$sage11" }}
              color={disabled ? "disabled" : undefined}
              onClick={onButtonClick}
              transparent
            >
              <Icon size="16" icon={icon} />
            </Button>
          )}
        </InputContainer>
        {helperText && !error && (
          <Text size="sm" color="lowContrast" id={helperId} aria-live="polite">
            {helperText}
          </Text>
        )}
        {error && (
          <Text size="sm" color="error" id={errorId} aria-live="assertive">
            {errorMessage}
          </Text>
        )}
      </Box>
    );
  }
);

const InputContainer = styled(Box, {
  alignItems: "center",
  border: "1px solid $sage7",
  borderRadius: "$050",
  display: "flex",
  position: "relative",
  marginBlockEnd: "$100",
  color: "$onBackground",

  "&:has(+ *)": {
    marginBlockEnd: "$050",
  },

  "& + *": {
    marginBlockEnd: "$100",
  },

  "&:focus-within": {
    borderColor: "$green11",
  },

  "@highContrast": {
    "&:focus-within": {
      outline: "1px solid buttonText !important",
    },
  },

  variants: {
    isInvalid: {
      true: {
        borderColor: "$red11",

        "&:focus-within": {
          outline: "1px solid $red11",
          borderColor: "$red11",
        },
      },
    },
    isDisabled: {
      true: {
        backgroundColor: "$disabled",
        borderColor: "$onDisabled",
        color: "$onDisabled",
      },
    },
  },
});

const IconContainer = styled("div", {
  color: "$sage11",
  display: "flex",
  paddingInlineStart: "$100",
  paddingInlineEnd: "$075",
  variants: {
    isDisabled: {
      true: {
        color: "inherit",
      },
    },
  },
});

const Input = styled("input", {
  backgroundColor: "transparent",
  border: "none",
  color: "inherit",
  display: "block",
  fontSize: "inherit",
  lineHeight: "inherit",
  minHeight: "44px",
  paddingBlock: "$062",
  paddingInline: "$150",
  textOverflow: "ellipsis",
  width: "100%",

  "&:focus": {
    outline: "none",
  },

  "&:disabled": {
    color: "inherit",
  },

  "&::placeholder": {
    color: "$sage9",
  },
});

export default TextInput;
