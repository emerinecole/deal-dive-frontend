import { z } from "zod";

export const signupFormSchema = z
  .object({
    fullName: z.string().min(1, {
      message: "Full name is required.",
    }),
    email: z.string().email({
      message: "Email is not valid.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm password is required.",
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormInputs = z.infer<typeof signupFormSchema>;
