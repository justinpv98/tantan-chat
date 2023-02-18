import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Your email must be a valid address"),
  password: z.string().min(6, "Your password must be at least 6 characters"),
});

export type loginData = z.infer<typeof loginSchema>;