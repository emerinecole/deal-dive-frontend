import { z } from "zod";

export const signupFormSchema = z
  .object({
    organizationName: z.string().min(1, {
      message: "Organization name is required.",
    }),
    fullName: z.string().min(1, {
      message: "Fullname is required.",
    }),
    email: z.string().email({
      message: "Email is not valid.",
    }),
    password: z
      .string()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
      }),
    confirmPassword: z.string().min(1, {
      message: "Confirm password is required.",
    }),
    industry: z.string().min(1, {
      message: "Industry is required.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormInputs = z.infer<typeof signupFormSchema>;
