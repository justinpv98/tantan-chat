import { useState, forwardRef } from "react";
import TextInput, {TextInputProps} from "../TextInput/TextInput";

type Props = {
  autoComplete: "password" | "new-password";
  label: string;
} & TextInputProps;


const PasswordInput = forwardRef<HTMLInputElement, Props>(({ autoComplete, id, label, onBlur, name, ...rest }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  function onClick(e: React.PointerEvent) {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  return (
    <TextInput
      autoComplete={autoComplete}
      onButtonClick={onClick}
      icon={showPassword ? "eye-slash" : "eye"}
      iconPosition="right"
      id={id}
      onBlur={onBlur}
      label={label}
      name={name}
      ref={ref}
      type={showPassword? "text" : "password"}
      {...rest}
    />
  );
})

export default PasswordInput;