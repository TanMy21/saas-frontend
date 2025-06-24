import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { ZodType, z } from "zod";

import { LoginFormData } from "./types";

dayjs.extend(isSameOrAfter);

const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

const isoDateField = z
  .string()
  .optional()
  .refine((date) => !date || dayjs(date).isValid(), {
    message: "Invalid date format",
  })
  .refine((date) => !date || dayjs(date).isSameOrAfter(dayjs(), "day"), {
    message: "Date cannot be older than today",
  });

export const settingsUpdateSchema = z.object({
  startDate: z.custom<Dayjs>((val) => dayjs.isDayjs(val) && val.isValid(), {
    message: "Invalid start date",
  }),
  endDate: z.custom<Dayjs>((val) => dayjs.isDayjs(val) && val.isValid(), {
    message: "Invalid end date",
  }),
  language: z.string(),
});

export const titleDescriptionUpdateSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character long"),
  description: z.string(),
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
  description: z.string(),
});

export const textSettingsSchema = z.object({
  required: z.boolean(),
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  description: z.string(),
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
  description: z.string(),
});

export const scaleSettingsSchema = z.object({
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  required: z.boolean(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  description: z.string(),
});

export const welcomeSettingsSchema = z.object({
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  description: z.string().optional(),
  buttonText: z
    .string()
    .min(1, "Button text must be at least 1 character long")
    .max(24, "Button text must be at most 24 characters long"),
});

export const TypographySettingsFormSchema = z.object({
  titleFontSize: z.number().min(1),
  titleFontColor: z.string().regex(hexColorRegex, {
    message: "Invalid hex color (expected format: #RRGGBB or #RGB)",
  }),
  descriptionFontSize: z.number().min(1),
  descriptionFontColor: z.string().regex(hexColorRegex, {
    message: "Invalid hex color (expected format: #RRGGBB or #RGB)",
  }),
});

export const binarySettingsSchema = z.object({
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  description: z.string(),
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

export const textAndDescriptionSettingsSchema = z.object({
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  questionDescription: z.string(),
});

export const questionImageSettingsSchema = z.object({
  questionImage: z.boolean().optional(),
  questionImageUrl: z.string().optional(),
  questionImageWidth: z.number().optional(),
  questionImageHeight: z.number().optional(),
  questionImageAltTxt: z.string().optional(),
});

export const uiConfigPreferenceSchema = z.object({
  buttonText: z
    .string()
    .min(1, "Button text must be at least 1 character long")
    .max(24, "Button text must be at most 24 characters long")
    .optional(),
  buttonTextYes: z
    .string()
    .min(1, "Button text must be at least 1 character long")
    .max(24, "Button text must be at most 24 characters long")
    .optional(),
  buttonTextNo: z
    .string()
    .min(1, "Button text must be at least 1 character long")
    .max(24, "Button text must be at most 24 characters long")
    .optional(),
  minValue: z.number().min(0, "Minimum value must be at least 0").optional(),
  maxValue: z.number().optional(),
  multipleSelection: z.boolean().optional(),
  required: z.boolean().optional(),
});

export const instructionsSettingsSchema = z.object({
  instructionsTitle: z
    .string()
    .min(1, "Title must be at least 1 character long"),
  description: z.string().optional(),
});

export const choiceSettingsSchema = z.object({
  required: z.boolean(),
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  description: z.string(),
});

export const checkboxSettingsSchema = z.object({
  required: z.boolean(),
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  description: z.string(),
});

export const mediaSettingsSchema = z.object({
  required: z.boolean(),
  multipleSelection: z.boolean(),
  superSize: z.boolean(),
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  description: z.string(),
});

export const emailContactSettingsSchema = z.object({
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
  required: z.boolean(),
});

export const endScreenContactSettingsSchema = z.object({
  questionText: z
    .string()
    .min(1, "Question text must be at least 1 character long"),
});

export const updateUserInfoSchema = z.object({
  email: z.string().email(),
  firstname: z.string().min(2, "First name must be at least 2 character long"),
  lastname: z
    .string()
    .min(2, "Last name must be at least 2 character long")
    .optional(),
});

export const generateSurveySchema = z.object({
  description: z.string().min(5, "Description must be at least 5 characters"),
  numberOfQuestions: z
    .number()
    .min(4, "At least four questions are required")
    .max(50, "Maximum 50 questions are allowed"),
  selectedTypes: z
    .array(z.string())
    .min(1, "Select at least one question type"),
});
