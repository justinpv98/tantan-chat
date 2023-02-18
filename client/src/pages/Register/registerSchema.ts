import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Your email must be a valid address"),
  username: z.string().min(2, "Your username must be at least 2 characters"),
  password: z.string().min(6, "Your password must be at least 6 characters"),
});

export type registerData = z.infer<typeof registerSchema>;