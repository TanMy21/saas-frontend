import type { AssistantThread } from "../../../types/surveyBuilderAssistant.types";

export const isAssistantThreadProcessing = (thread: AssistantThread | null) =>
  thread?.stage === "PROCESSING" || thread?.stage === "COMMITTING";

export const isAssistantThreadCommitted = (thread: AssistantThread | null) =>
  thread?.stage === "COMMITTED";

export const isAssistantThreadReadOnly = (thread: AssistantThread | null) =>
  thread?.status === "COMPLETED" || thread?.status === "ARCHIVED";

export const canSendAssistantThreadMessage = (thread: AssistantThread | null) =>
  thread?.status === "ACTIVE" && !isAssistantThreadProcessing(thread);
