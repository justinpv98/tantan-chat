import z from "zod";

/* Component Schemas */
const emailSchema = z
  .string({ required_error: "Email is a required field" })
  .trim()
  .email({ message: "Email must be a valid address" });

const passwordSchema = z
  .string()
  .trim()
  .min(6, { message: "Password should be at least 6 characters" });

const usernameSchema = z
  .string()
  .trim()
  .regex(/(^[a-zA-Z0-9_]+$)/, {
    message: "Username should consist of only alphanumerical characters or _",
  })
  .min(2, { message: "Username should be at least 2 characters" })
  .max(32, { message: "Username should be under 32 characters" });





/* Request Validatons */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
