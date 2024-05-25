import { z } from "zod";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";


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
