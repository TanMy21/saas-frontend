import type {
  AssistantNoticeData,
  AssistantNoticePart,
  AssistantSurveyPreviewPart,
  ParsedAssistantApiError,
} from "../../../types/surveyBuilderAssistant.types";

type NoticeDefinition = Omit<AssistantNoticeData, "explanation">;

const notices: Record<string, NoticeDefinition> = {
  OUT_OF_SCOPE: {
    tone: "info",
    title: "I can help you build surveys",
    policy: "Survey scope",
    alternatives: ["What can you help me do in the survey builder?"],
  },
  PROMPT_ATTACK: {
    tone: "refusal",
    title: "I can’t help with that request",
    policy: "Protected instructions",
  },
  SECRET_REQUEST: {
    tone: "refusal",
    title: "This information is protected",
    policy: "Privacy",
  },
  UNSAFE_REQUEST: {
    tone: "refusal",
    title: "I can’t perform that request",
    policy: "Access protection",
  },
  UNSUPPORTED_ACTION: {
    tone: "info",
    title: "This action isn’t available in chat",
    policy: "Chat capability",
    alternatives: ["What can you help me do in the survey builder?"],
  },
  BUILDER_ACTION_REQUIRED: {
    tone: "info",
    title: "Use the survey builder for this change",
    policy: "Builder action",
  },
  REPLACEMENT_HAS_RESPONSES: {
    tone: "refusal",
    title: "These questions can’t be replaced",
    policy: "Response protection",
  },
  QUESTION_CAPACITY: {
    tone: "warning",
    title: "Survey question limit",
    policy: "Capacity",
  },
  VALIDATION_FAILED: {
    tone: "warning",
    title: "The proposed changes need clarification",
    policy: "Validation",
  },
  PENDING_CHANGE: {
    tone: "warning",
    title: "A survey change is awaiting approval",
    policy: "Pending change",
  },
  STALE_PREVIEW: {
    tone: "warning",
    title: "This preview is out of date",
    policy: "Review required",
  },
  SURVEY_LOCKED: {
    tone: "refusal",
    title: "This survey can’t be changed",
    policy: "Survey locked",
  },
  SURVEY_EDIT_LOCKED: {
    tone: "refusal",
    title: "This change is locked",
    policy: "Response protection",
  },
  SURVEY_ARCHIVED: {
    tone: "neutral",
    title: "This survey is archived",
    policy: "Read-only",
  },
  SURVEY_BUILDER_THREAD_NOT_ACTIVE: {
    tone: "neutral",
    title: "This chat is read-only",
    policy: "New chat required",
  },
  SURVEY_BUILDER_THREAD_BUSY: {
    tone: "info",
    title: "The assistant is still working",
    policy: "Please wait",
  },
  SURVEY_BUILDER_DRAFT_COMMIT_CONFLICT: {
    tone: "info",
    title: "The survey changes are being applied",
    policy: "Please wait",
  },
  SURVEY_BUILDER_RATE_LIMITED: {
    tone: "warning",
    title: "Please wait before trying again",
    policy: "Request limit",
  },
  SURVEY_BUILDER_DRAFT_EMPTY: {
    tone: "info",
    title: "There are no changes to approve",
    policy: "Empty draft",
  },
};

export const getAssistantNotice = (
  part: AssistantNoticePart,
): AssistantNoticeData => ({
  ...(notices[part.reason] ?? {
    tone: "info",
    title: "Survey assistant notice",
    policy: "Notice",
  }),
  explanation: part.text,
});

const stalePreviewCodes = new Set([
  "STALE_SELECTED_REPLACEMENT_PROPOSAL",
  "STALE_REPLACEMENT_PROPOSAL",
  "STALE_REORDER_PROPOSAL",
  "SURVEY_BUILDER_DRAFT_VERSION_CONFLICT",
  "SURVEY_BUILDER_REORDER_POSITION_CONFLICT",
]);

export const isAssistantStalePreviewError = (error: ParsedAssistantApiError) =>
  error.status === 409 && stalePreviewCodes.has(error.code ?? "");

export const getAssistantApiNotice = (
  error: ParsedAssistantApiError,
): AssistantNoticeData | null => {
  const reason = isAssistantStalePreviewError(error)
    ? "STALE_PREVIEW"
    : error.code === "SURVEY_QUESTION_LIMIT_EXCEEDED"
      ? "QUESTION_CAPACITY"
      : error.code;

  if (!reason || !notices[reason]) return null;

  return getAssistantNotice({
    type: "notice",
    reason,
    text:
      reason === "STALE_PREVIEW"
        ? "The survey or draft changed after this preview was prepared. Ask the assistant for a new preview before approving."
        : error.message,
  });
};

export const getAssistantReplacementNotice = (
  part: Pick<
    AssistantSurveyPreviewPart,
    | "commitMode"
    | "replacedQuestionCount"
    | "removesFlowLogic"
    | "flowLogicScope"
  > & { questionCount: number },
): AssistantNoticeData => {
  const selected = part.commitMode === "REPLACE_SELECTED";
  const count =
    part.replacedQuestionCount ?? (selected ? part.questionCount : 0);
  const removesFlow =
    part.removesFlowLogic !== false && part.flowLogicScope !== "NONE";

  return {
    tone: "warning",
    title: selected
      ? "Replace these selected questions?"
      : "Replace all current questions?",
    policy: "Replacement warning",
    explanation: selected
      ? `${count} selected question${count === 1 ? "" : "s"} will be replaced at ${count === 1 ? "its original position" : "their original positions"}. Other questions stay unchanged.${removesFlow ? " Flow rules referencing the selected questions will be removed." : ""}`
      : `${count} current question${count === 1 ? "" : "s"} will be removed and ${part.questionCount} replacement question${part.questionCount === 1 ? "" : "s"} will be created.${removesFlow ? " Existing flow logic tied to the current questions will also be removed." : ""}`,
  };
};
