import { zodResolver } from "@hookform/resolvers/zod";
import { styled } from "@/stitches.config";
import { loginSchema, loginData } from "./loginSchema";

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

const image = new URL("../../assets/chat2.webp", import.meta.url).href;

export default function Login() {
  const { login, message } = useAuth();

  // Login page with validation using React-Hook-Form and a Zod resolver;

  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
  } = useForm<loginData>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  async function onSubmitForm(data: loginData) {
    login(data);
  }

  return (
    <Flex css={{ minHeight: "100vh", background: "$background" }}>
      <ImageContainer>
        <Image src={image} alt="A message bubble" />
      </ImageContainer>
      <Box as="main" css={{ width: "100%", "@lg": { width: "40vw" } }}>
        <FormContainer onSubmit={handleSubmit(onSubmitForm)}>
          <Box css={{ marginBlockEnd: "$150" }}>
            <Heading as="h1" css={{marginBottom: "$012"}}>Log In</Heading>
            <Text color="lowContrast">
              Need an account? <Link to="/register">Create one here</Link>
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
              <PasswordInput
                label="Password"
                id="password"
                error={invalid}
                errorMessage={error?.message}
                autoComplete="password"
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
          <Button color="primaryGradient" fluid>
            Log In
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
