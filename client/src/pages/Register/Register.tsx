import { zodResolver } from "@hookform/resolvers/zod";
import { styled } from "@/stitches.config";
import { registerSchema, registerData } from "./registerSchema";

// Hooks
import { useAuth } from "@/hooks";
import { useForm, Controller } from "react-hook-form";

// Components
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  PasswordInput,
  Text,
  TextInput,
} from "@/features/ui";

const image = new URL("../../assets/chat1.webp", import.meta.url).href;

export default function Register() {
  const { register: signUp, message } = useAuth();

  // Register page with validation using React-Hook-Form and a Zod resolver;

  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
  } = useForm<registerData>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmitForm(data: registerData) {
    signUp(data);
  }

  return (
    <Flex css={{ minHeight: "100vh", background: "$background" }}>
      <ImageContainer>
        <Image src={image} alt="A message bubble" />
      </ImageContainer>
      <Box as="main" css={{ width: "100%", "@lg": { width: "40vw" } }}>
      {message && (
          <ErrorMessage>
            <Text weight="semibold">{message}</Text>
          </ErrorMessage>
        )}
        <FormContainer onSubmit={handleSubmit(onSubmitForm)}>
          
          <Box css={{ marginBlockEnd: "$150" }}>
            <Heading as="h1" css={{marginBottom: "$012"}}>Sign Up</Heading>
            <Text color="lowContrast">
              Join us for free or <Link to="/login">log in here</Link>
            </Text>
          </Box>
          <Controller
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { invalid, error },
            }) => (
              <TextInput
                label="Email"
                id="email"
                error={invalid}
                errorMessage={error?.message}
                autoComplete="email"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                ref={ref}
                type="email"
                name="email"
              />
            )}
            name="email"
            control={control}
          />
          <Controller
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { invalid, error },
            }) => (
              <TextInput
                label="Username"
                id="username"
                error={invalid}
                errorMessage={error?.message}
                autoComplete="username"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                ref={ref}
                name="username"
              />
            )}
            name="username"
            control={control}
          />
          <Controller
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { invalid, error },
            }) => (
              <PasswordInput
                label="Password"
                id="password"
                error={invalid}
                errorMessage={error?.message}
                autoComplete="new-password"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                ref={ref}
                name="password"
                css={{marginBlockEnd: "$250"}}
              />
            )}
            name="password"
            control={control}
          />
          <Button color="primary" fluid>
            Sign Up
          </Button>
        </FormContainer>
      </Box>
    </Flex>
  );
}

const ImageContainer = styled(Box, {
  display: "none",
  "@lg": {
    display: "flex",
    position: "sticky",
    width: "60vw",
    height: "100vh",
  },
});

const FormContainer = styled("form", {
  margin: "0 auto",
  padding: "1.5rem",
  maxWidth: "27.5rem",
});

const ErrorMessage = styled(Box, {
  background: "$error",
  color: "$onError",
  display: "flex",
  justifyContent: "center",
  paddingBlock: "$100",
});
