import type { AppendMessage } from "@assistant-ui/react";

import {
  AssistantApiError,
  AssistantApprovalControlsPart,
  AssistantJob,
  AssistantMessage,
  AssistantMessagePart,
  AssistantSurveyOrderPreviewPart,
  AssistantSurveyPreviewPart,
  AssistantTextPart,
  OptimisticAssistantMessageInput,
  ParsedAssistantApiError,
} from "../../../types/surveyBuilderAssistant.types";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const TECHNICAL_ERROR_CODE_PATTERN = /\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+){2,}\b/;

export const ASSISTANT_RESPONSE_FAILURE_MESSAGE =
  "I couldn’t complete that response. Please try again or rephrase your request.";

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

export const isAssistantSurveyOrderPreviewPart = (
  part: AssistantMessagePart,
): part is AssistantSurveyOrderPreviewPart =>
  part.type === "survey-order-preview";

export const isAssistantApprovalControlsPart = (
  part: AssistantMessagePart,
): part is AssistantApprovalControlsPart => part.type === "approval-controls";

export const isAssistantFailureLikeMessage = (message: AssistantMessage) => {
  if (message.role === "USER") return false;

  const containsTechnicalError = message.content.parts.some(
    (part) =>
      part.type === "text" && TECHNICAL_ERROR_CODE_PATTERN.test(part.text),
  );

  return (
    message.status === "FAILED" ||
    Boolean(message.errorCode) ||
    containsTechnicalError
  );
};

export const normalizeAssistantMessageForDisplay = (
  message: AssistantMessage,
): AssistantMessage => {
  if (!isAssistantFailureLikeMessage(message)) return message;

  return {
    ...message,
    role: "ASSISTANT",
    status: "COMPLETED",
    errorCode: null,
    content: {
      parts: [
        {
          type: "text",
          text: ASSISTANT_RESPONSE_FAILURE_MESSAGE,
        },
      ],
    },
  };
};

export const createAssistantFailureMessage = (
  job: AssistantJob,
  sequence: number,
): AssistantMessage => ({
  messageID: `assistant-failure-${job.jobID}`,
  role: "ASSISTANT",
  status: "COMPLETED",
  sequence,
  authorUserID: null,
  content: {
    parts: [
      {
        type: "text",
        text: ASSISTANT_RESPONSE_FAILURE_MESSAGE,
      },
    ],
  },
  errorCode: null,
  createdAt: job.completedAt ?? new Date().toISOString(),
});

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

  const getSafeMessage = (value: unknown) =>
    typeof value === "string" &&
    value.trim().length > 0 &&
    !TECHNICAL_ERROR_CODE_PATTERN.test(value)
      ? value
      : fallbackMessage;

  if (isObject(error.data)) {
    const data = error.data as Partial<AssistantApiError>;

    return {
      status,
      code: typeof data.code === "string" ? data.code : null,
      message: getSafeMessage(data.message),
    };
  }

  if (typeof error.data === "string") {
    return {
      status,
      code: null,
      message: getSafeMessage(error.data),
    };
  }

  return {
    status,
    code: null,
    message: getSafeMessage(error.error),
  };
};
