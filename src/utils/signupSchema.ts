import { ZodType, z } from "zod";
import { RegisterFormData } from "./types";

export const registerSchema: ZodType<RegisterFormData> = z
  .object({
    firstname: z
      .string()
      .min(2, { message: "First Name should be more than 1 character *" })
      .max(30, { message: "First Name should be less than 30 characters *" }),
    lastname: z
      .string()
      .min(2, { message: "Last Name should be more than 1 character *" })
      .max(30, { message: "Last Name should be less than 30 characters *" }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "password should be more than 6 characters *" })
      .max(20, { message: "password should be less than 20 characters *" }),
    confirmPassword: z
      .string()
      .min(6, { message: "password should be more than 6 characters *" })
      .max(20, { message: "password should be less than 20 characters *" }),
    organization: z
      .string()
      .min(2, {
        message: "organization name should be more than 1 character *",
      })
      .max(30, {
        message: "organization name should be less than 30 characters *",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match *",
    path: ["confirmPassword"],
  });
