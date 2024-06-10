import { ZodType, z } from "zod";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { LoginFormData } from "./types";

dayjs.extend(isSameOrAfter);
export const settingsUpdateSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character long"),
  description: z.string(),
  startDate: z
    .string()
    .refine((date) => dayjs(date, "DD/MM/YYYY").isSameOrAfter(dayjs(), "day"), {
      message: "Start date cannot be older than today",
    }),
  endDate: z
    .string()
    .refine((date) => dayjs(date, "DD/MM/YYYY").isSameOrAfter(dayjs(), "day"), {
      message: "Start date cannot be older than today",
    }),
  responseLimit: z.number().optional(),
  language: z.string(),
  isTemplate: z.boolean(),
});

export const downloadDataSchema = z.object({
  fileFormatGroup: z
    .string()
    .min(1, { message: "Please select an option from Group 2" }),
});

export type DownloadFormData = z.infer<typeof downloadDataSchema>;

export const loginSchema: ZodType<LoginFormData> = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const forgetPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "password should be more than 6 characters *" })
      .max(20, { message: "password should be less than 20 characters *" }),
    confirmPassword: z
      .string()
      .min(6, { message: "password should be more than 6 characters *" })
      .max(20, { message: "password should be less than 20 characters *" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match *",
    path: ["confirmPassword"],
  });
