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
    })
    .optional(),
  endDate: z
    .string()
    .refine((date) => dayjs(date, "DD/MM/YYYY").isSameOrAfter(dayjs(), "day"), {
      message: "Start date cannot be older than today",
    })
    .optional(),
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

export const rankSettingsSchema = z.object({
  required: z.boolean(),
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
});

export const textSettingsSchema = z.object({
  required: z.boolean(),
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
});

export const numberSettingsSchema = z.object({
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  required: z.boolean(),
  minSwitch: z.boolean(),
  maxSwitch: z.boolean(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
});

export const scaleSettingsSchema = z.object({
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  required: z.boolean(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
});

export const welcomeSettingsSchema = z.object({
  welcomeText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  buttonText: z
    .string()
    .min(1, "Button text must be at least 1 character long")
    .max(24, "Button text must be at most 24 characters long"),
});

export const binarySettingsSchema = z.object({
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  required: z.boolean(),
  button1Text: z
    .string()
    .min(1, "Button text must be at least 1 character long")
    .max(24, "Button text must be at most 24 characters long"),
  button2Text: z
    .string()
    .min(1, "Button text must be at least 1 character long")
    .max(24, "Button text must be at most 24 characters long"),
});

export const instructionsSettingsSchema = z.object({
  instructionsTitle: z
    .string()
    .min(1, "Title must be at least 1 character long"),
  buttonText: z
    .string()
    .min(1, "Button text must be at least 1 character long")
    .max(24, "Button text must be at most 24 characters long"),
});

export const choiceSettingsSchema = z.object({
  required: z.boolean(),
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
});

export const checkboxSettingsSchema = z.object({
  required: z.boolean(),
  multipleSelection: z.boolean(),
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
});

export const mediaSettingsSchema = z.object({
  required: z.boolean(),
  multipleSelection: z.boolean(),
  superSize: z.boolean(),
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
});

export const emailContactSettingsSchema = z.object({
  questionTex: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  required: z.boolean(),
});

export const endScreenContactSettingsSchema = z.object({
  questionTex: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
});
