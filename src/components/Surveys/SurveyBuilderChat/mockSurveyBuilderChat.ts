import type {
  SurveyChatMessage,
  SurveyChatPreviewQuestion,
} from "./surveyBuilderChat.types";

export const DEFAULT_QUESTION_TYPES = [
  "BINARY",
  "MULTIPLE_CHOICE",
  "RADIO",
  "TEXT",
  "RANGE",
];

export const ACCEPTED_DOCUMENT_TYPES =
  ".pdf,.doc,.docx,.odt,.txt,.md,.rtf,.ods,.odp";

export const MAX_DOCUMENT_SIZE = 25 * 1024 * 1024;

export const createMessageId = () =>
  `survey-chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createInitialMessages = (): SurveyChatMessage[] => [
  {
    id: createMessageId(),
    role: "assistant",
    kind: "welcome",
    text: "Turn a source document into a survey, or import an existing question document directly.",
    createdAt: new Date(),
  },
];

export const MOCK_PREVIEW_QUESTIONS: SurveyChatPreviewQuestion[] = [
  {
    id: "preview-1",
    number: 1,
    type: "RADIO",
    typeLabel: "Choice",
    prompt: "How familiar are you with the main ideas presented in the document?",
    options: ["Very familiar", "Somewhat familiar", "Not familiar yet"],
  },
  {
    id: "preview-2",
    number: 2,
    type: "MULTIPLE_CHOICE",
    typeLabel: "Multiple Choice",
    prompt: "Which themes from the document are most relevant to your work?",
    options: [
      "Strategy and planning",
      "Customer experience",
      "Operations",
      "Measurement and reporting",
    ],
  },
  {
    id: "preview-3",
    number: 3,
    type: "RANGE",
    typeLabel: "Scale",
    prompt: "How useful did you find the recommendations in the document?",
    options: ["1 — Not useful", "5 — Extremely useful"],
  },
  {
    id: "preview-4",
    number: 4,
    type: "TEXT",
    typeLabel: "Text",
    prompt: "What is the most important idea you took away from the document?",
  },
];

export const getFileExtension = (fileName: string) => {
  const extension = fileName.split(".").pop();
  return extension ? extension.toLowerCase() : "file";
};

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
