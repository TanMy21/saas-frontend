import { FieldConfig } from "../types/modalTypes";

export const feedbackFields: FieldConfig[] = [
  {
    name: "title",
    placeholder: "What’s the issue?",
    rules: {
      required: "Title is required",
      minLength: { value: 5, message: "Minimum 5 characters" },
    },
  },
  {
    name: "description",
    placeholder: "Describe your experience...",
    multiline: true,
    rows: 4,
    rules: {
      required: "Description is required",
      minLength: { value: 10, message: "Minimum 10 characters" },
    },
  },
];
