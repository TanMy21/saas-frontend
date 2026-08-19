import type { AppendMessage } from "@assistant-ui/react";

import {
  AssistantApiError,
  AssistantApprovalControlsPart,
  AssistantMessage,
  AssistantMessagePart,
  AssistantSurveyPreviewPart,
  AssistantTextPart,
  OptimisticAssistantMessageInput,
  ParsedAssistantApiError,
} from "../../../types/surveyBuilderAssistant.types";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const createValidDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? new Date(0) : date;
};

export const getAssistantAppendMessageText = (message: AppendMessage) =>
  message.content
    .filter((part) => part.type === "text")
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("\n")
    .trim();

export const isAssistantTextPart = (
  part: AssistantMessagePart,
): part is AssistantTextPart => part.type === "text";

export const isAssistantSurveyPreviewPart = (
  part: AssistantMessagePart,
): part is AssistantSurveyPreviewPart => part.type === "survey-preview";

export const isAssistantApprovalControlsPart = (
  part: AssistantMessagePart,
): part is AssistantApprovalControlsPart => part.type === "approval-controls";

export const getAssistantMessageText = (message: AssistantMessage) => {
  const text = message.content.parts
    .filter(isAssistantTextPart)
    .map((part) => part.text)
    .join("\n")
    .trim();

  if (text) return text;

  const preview = message.content.parts.find(isAssistantSurveyPreviewPart);

  if (preview) {
    return `Survey preview: ${preview.title}`;
  }

  if (message.content.parts.some(isAssistantApprovalControlsPart)) {
    return "Approval required";
  }

  if (message.status === "FAILED") {
    return "The assistant could not process this message.";
  }

  return "";
};

export const getAssistantRuntimeRole = (
  role: AssistantMessage["role"],
): "user" | "assistant" => (role === "USER" ? "user" : "assistant");

export const convertAssistantMessageToRuntime = (
  message: AssistantMessage,
) => ({
  id: message.messageID,
  role: getAssistantRuntimeRole(message.role),
  createdAt: createValidDate(message.createdAt),
  content: [
    {
      type: "text" as const,
      text: getAssistantMessageText(message),
    },
  ],
  metadata: {
    custom: {
      status: message.status,
      sequence: message.sequence,
      backendRole: message.role,
      errorCode: message.errorCode,
    },
  },
});

export const mergeAssistantMessages = (
  existing: AssistantMessage[],
  incoming: AssistantMessage[],
) => {
  const messagesByID = new Map<string, AssistantMessage>();

  existing.forEach((message) => {
    messagesByID.set(message.messageID, message);
  });

  incoming.forEach((message) => {
    // Incoming data wins because it is assumed to be newer.
    messagesByID.set(message.messageID, message);
  });

  return Array.from(messagesByID.values()).sort((first, second) => {
    if (first.sequence !== second.sequence) {
      return first.sequence - second.sequence;
    }

    return (
      createValidDate(first.createdAt).getTime() -
      createValidDate(second.createdAt).getTime()
    );
  });
};

export const createOptimisticAssistantMessage = ({
  clientMessageID,
  message,
  sequence,
}: OptimisticAssistantMessageInput): AssistantMessage => ({
  messageID: clientMessageID,
  role: "USER",
  status: "PENDING",
  sequence,
  authorUserID: null,
  content: {
    parts: [
      {
        type: "text",
        text: message,
      },
    ],
  },
  errorCode: null,
  createdAt: new Date().toISOString(),
});

export const parseAssistantApiError = (
  error: unknown,
  fallbackMessage: string,
): ParsedAssistantApiError => {
  if (!isObject(error)) {
    return {
      status: null,
      code: null,
      message: fallbackMessage,
    };
  }

  const rawStatus = error.status;

  const status =
    typeof rawStatus === "number" || typeof rawStatus === "string"
      ? rawStatus
      : null;

  if (isObject(error.data)) {
    const data = error.data as Partial<AssistantApiError>;

    return {
      status,
      code: typeof data.code === "string" ? data.code : null,
      message:
        typeof data.message === "string" ? data.message : fallbackMessage,
    };
  }

  if (typeof error.data === "string") {
    return {
      status,
      code: null,
      message: error.data,
    };
  }

  return {
    status,
    code: null,
    message: typeof error.error === "string" ? error.error : fallbackMessage,
  };
};
