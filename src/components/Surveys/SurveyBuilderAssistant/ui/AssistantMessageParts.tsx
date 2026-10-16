import type { ReactElement } from "react";

import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { Check, CheckCircle2, FileText } from "lucide-react";

import type {
  AssistantApprovalControlsPart,
  AssistantDraftQuestion,
  AssistantMessage,
  AssistantSurveyPreviewPart,
  AssistantTextPart,
  SurveyOrderPreviewProps,
} from "../../../../types/surveyBuilderAssistant.types";
import { getAssistantCapabilities } from "../SurveyBuilderAssistantAdapters";
import { useSurveyBuilderAssistant } from "../SurveyBuilderAssistantContext";
import { isAssistantThreadReadOnly } from "../surveyBuilderAssistantLifecycle";
import {
  getAssistantNotice,
  getAssistantReplacementNotice,
} from "../surveyBuilderAssistantNotices";

import AssistantCapabilities from "./AssistantCapabilities";
import AssistantNotice from "./AssistantNotice";

const Box = styled("div")({});

const formatQuestionType = (type: string) =>
  type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const TextPart = ({
  part,
  isAssistant,
}: {
  part: AssistantTextPart;
  isAssistant: boolean;
}): ReactElement => {
  const capabilities = isAssistant ? getAssistantCapabilities(part.text) : null;
  if (capabilities) return <AssistantCapabilities {...capabilities} />;

  return (
    <Typography
      sx={{
        color: "inherit",
        fontSize: "var(--assistant-chat-font-body, 1rem)",
        lineHeight: 1.6,
        overflowWrap: "anywhere",
        whiteSpace: "pre-wrap",
      }}
    >
      {part.text}
    </Typography>
  );
};

const QuestionOptions = ({
  question,
}: {
  question: AssistantDraftQuestion;
}): ReactElement | null => {
  if (question.options.length === 0) return null;

  return (
    <Stack spacing={0.5} sx={{ mt: 0.9 }}>
      {question.options.map((option, index) => (
        <Stack
          key={option.draftOptionID}
          direction="row"
          spacing={0.75}
          alignItems="flex-start"
        >
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              minWidth: 18,
              height: 18,
              mt: "1px",
              borderRadius: "50%",
              color: "#64748B",
              backgroundColor: "#F1F5F9",
              fontSize: "var(--assistant-chat-font-label, 0.75rem)",
              fontWeight: 700,
            }}
          >
            {index + 1}
          </Box>
          <Typography
            sx={{
              color: "#475569",
              fontSize: "var(--assistant-chat-font-primary, 0.875rem)",
              lineHeight: 1.45,
            }}
          >
            {option.text}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

const SurveyPreviewPart = ({
  part,
  showReplacementNotice = true,
}: {
  part: AssistantSurveyPreviewPart;
  showReplacementNotice?: boolean;
}): ReactElement => {
  const isReplaceAll = part.commitMode === "REPLACE_ALL";
  const isReplaceSelected = part.commitMode === "REPLACE_SELECTED";
  const isReplacement = isReplaceAll || isReplaceSelected;
  const targetByDraftID = new Map(
    (part.replacementTargets ?? []).map((target) => [
      target.draftQuestionID,
      target,
    ]),
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        borderColor: isReplacement ? "#F59E0B" : "#E2E8F0",
        borderRadius: 2.5,
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 1.25,
          backgroundColor: isReplacement ? "#FFFBEB" : "#F8FAFC",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{
                color: isReplacement ? "#92400E" : "#0F172A",
                fontSize: "var(--assistant-chat-font-title, 0.9375rem)",
                fontWeight: 750,
              }}
            >
              {isReplaceSelected
                ? "Selected question replacements"
                : part.title ||
                  (isReplaceAll ? "Replacement survey draft" : "Survey draft")}
            </Typography>

            <Typography
              sx={{
                mt: 0.2,
                color: isReplacement ? "#B45309" : "#64748B",
                fontSize: "var(--assistant-chat-font-secondary, 0.8125rem)",
              }}
            >
              {part.questions.length} question
              {part.questions.length === 1 ? "" : "s"} · Draft version{" "}
              {part.draftVersion}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 30,
              height: 30,
              flexShrink: 0,
              borderRadius: 1.75,
              color: isReplacement ? "#B45309" : "#4F46E5",
              backgroundColor: isReplacement ? "#FEF3C7" : "#EEF2FF",
            }}
          >
            <FileText size={16} aria-hidden="true" />
          </Box>
        </Stack>
      </Box>

      <Divider />

      {isReplacement && showReplacementNotice && (
        <>
          <Box sx={{ px: 1.5, py: 1.25 }}>
            <AssistantNotice
              notice={getAssistantReplacementNotice({
                ...part,
                questionCount: part.questions.length,
              })}
            />
          </Box>

          <Divider />
        </>
      )}

      {part.questions.length === 0 ? (
        <Typography
          sx={{
            px: 1.5,
            py: 2,
            color: "#64748B",
            fontSize: "var(--assistant-chat-font-primary, 0.875rem)",
          }}
        >
          This draft does not contain any questions yet.
        </Typography>
      ) : (
        <Stack divider={<Divider flexItem />}>
          {part.questions.map((question, index) => (
            <Box key={question.draftQuestionID} sx={{ px: 1.5, py: 1.25 }}>
              <Stack direction="row" spacing={0.75} alignItems="flex-start">
                <Typography
                  sx={{
                    minWidth: 18,
                    color: "#64748B",
                    fontSize: "var(--assistant-chat-font-secondary, 0.8125rem)",
                    fontWeight: 750,
                    lineHeight: 1.5,
                  }}
                >
                  {isReplaceSelected
                    ? (targetByDraftID.get(question.draftQuestionID)
                        ?.previousPosition ?? "?")
                    : index + 1}
                  .
                </Typography>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  {isReplaceSelected && (
                    <>
                      <Typography
                        sx={{
                          mb: 0.75,
                          color: "#64748B",
                          fontSize:
                            "var(--assistant-chat-font-secondary, 0.8125rem)",
                          lineHeight: 1.5,
                          overflowWrap: "anywhere",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        Original:{" "}
                        {targetByDraftID.get(question.draftQuestionID)?.text ??
                          "Original question unavailable"}
                      </Typography>
                      <Typography
                        sx={{
                          mb: 0.35,
                          color: "#92400E",
                          fontSize: "var(--assistant-chat-font-label, 0.75rem)",
                          fontWeight: 700,
                        }}
                      >
                        Replacement
                      </Typography>
                    </>
                  )}

                  <Typography
                    sx={{
                      color: "#0F172A",
                      fontSize: "var(--assistant-chat-font-primary, 0.875rem)",
                      fontWeight: 650,
                      lineHeight: 1.45,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {question.text}
                  </Typography>

                  {question.description && (
                    <Typography
                      sx={{
                        mt: 0.4,
                        color: "#64748B",
                        fontSize:
                          "var(--assistant-chat-font-secondary, 0.8125rem)",
                        lineHeight: 1.45,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {question.description}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={0.5} sx={{ mt: 0.7 }}>
                    <Chip
                      size="small"
                      label={formatQuestionType(question.type)}
                      sx={{
                        height: 20,
                        color: "#475569",
                        backgroundColor: "#F1F5F9",
                        fontSize: "var(--assistant-chat-font-label, 0.75rem)",
                      }}
                    />

                    {question.required && (
                      <Chip
                        size="small"
                        label="Required"
                        sx={{
                          height: 20,
                          color: "#4338CA",
                          backgroundColor: "#EEF2FF",
                          fontSize: "var(--assistant-chat-font-label, 0.75rem)",
                        }}
                      />
                    )}
                  </Stack>

                  <QuestionOptions question={question} />
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
};

export function SurveyOrderPreview({ part }: SurveyOrderPreviewProps) {
  return (
    <div
      className="space-y-3 rounded-lg border p-4"
      style={{ fontSize: "var(--assistant-chat-font-primary, 0.875rem)" }}
    >
      <div>
        <p
          className="font-medium"
          style={{ fontSize: "var(--assistant-chat-font-title, 0.9375rem)" }}
        >
          Proposed question order
        </p>
        <p
          className="text-muted-foreground"
          style={{
            fontSize: "var(--assistant-chat-font-secondary, 0.8125rem)",
          }}
        >
          {part.requestedGrouping}
        </p>
      </div>

      <ol className="space-y-2">
        {part.questions.map((question) => (
          <li
            key={`${question.proposedPosition}-${question.text}`}
            className="flex items-start gap-3 rounded-md border p-3"
          >
            <span className="font-medium">{question.proposedPosition}.</span>

            <div>
              <p>{question.text}</p>

              {question.moved && (
                <p
                  className="text-muted-foreground"
                  style={{
                    fontSize: "var(--assistant-chat-font-label, 0.75rem)",
                  }}
                >
                  Moved from position {question.previousPosition}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const ApprovalControlsPart = ({
  part,
  preview,
}: {
  part: AssistantApprovalControlsPart;
  preview?: AssistantSurveyPreviewPart;
}): ReactElement | null => {
  const {
    commitDraft,
    invalidDraftVersions,
    isCommitting,
    isGenerating,
    isSending,
    thread,
  } = useSurveyBuilderAssistant();

  const isCommitted =
    thread?.stage === "COMMITTED" &&
    part.draftVersion + 1 === thread.draft.version;
  const isReadOnly = isAssistantThreadReadOnly(thread);

  const commitMode = part.commitMode ?? thread?.draft.commitMode ?? "APPEND";

  const questionCount =
    part.questionCount ?? thread?.draft.questions.length ?? 0;

  const replacedQuestionCount =
    part.replacedQuestionCount ??
    thread?.draft.replacementProposal?.replacedQuestionCount ??
    0;

  const isReplaceAll = commitMode === "REPLACE_ALL";
  const isReplaceSelected = commitMode === "REPLACE_SELECTED";
  const isReplacement = isReplaceAll || isReplaceSelected;
  const isReorder = commitMode === "REORDER";

  const isStalePreview = invalidDraftVersions.includes(part.draftVersion);

  const hasApprovableDraft = isReorder || questionCount > 0;

  const title = isReorder
    ? "Ready to apply this question order?"
    : "Ready to create these questions?";

  const buttonLabel = isReplaceSelected
    ? `Replace ${questionCount} selected question${questionCount === 1 ? "" : "s"}`
    : isReplaceAll
      ? `Replace with ${questionCount} question${questionCount === 1 ? "" : "s"}`
      : isReorder
        ? "Apply reorder"
        : `Create ${questionCount} question${questionCount === 1 ? "" : "s"}`;

  const committingLabel = isReplacement
    ? "Replacing questions…"
    : isReorder
      ? "Applying reorder…"
      : "Creating questions…";

  if (isCommitted) {
    return (
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          p: 1.25,
          borderColor: "#BBF7D0",
          borderRadius: 2.5,
          backgroundColor: "#F0FDF4",
          boxSizing: "border-box",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <CheckCircle2 size={18} color="#16A34A" aria-hidden="true" />

          <Typography
            sx={{
              color: "#166534",
              fontSize: "var(--assistant-chat-font-primary, 0.875rem)",
              lineHeight: 1.5,
            }}
          >
            The approved survey changes were applied.
          </Typography>
        </Stack>
      </Paper>
    );
  }

  if (isReadOnly) {
    return null;
  }

  if (isStalePreview) {
    return (
      <AssistantNotice
        notice={getAssistantNotice({
          type: "notice",
          reason: "STALE_PREVIEW",
          text: "This preview can no longer be approved. Review the latest preview, or ask the assistant for a new one.",
        })}
      />
    );
  }

  // Older previews stay in chat history without obsolete approval controls.
  if (part.draftVersion !== thread?.draft.version) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        p: 1.25,
        borderColor: isReplacement ? "#F59E0B" : "#C7D2FE",
        borderRadius: 2.5,
        backgroundColor: isReplacement ? "#FFFBEB" : "#F8FAFF",
        boxSizing: "border-box",
      }}
    >
      {isReplacement ? (
        <AssistantNotice
          notice={getAssistantReplacementNotice({
            commitMode,
            questionCount,
            replacedQuestionCount,
            removesFlowLogic: preview?.removesFlowLogic,
            flowLogicScope: preview?.flowLogicScope,
          })}
        />
      ) : (
        <>
          <Typography
            sx={{
              color: "#0F172A",
              fontSize: "var(--assistant-chat-font-title, 0.9375rem)",
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>
        </>
      )}

      <Button
        fullWidth
        variant="contained"
        disabled={
          !thread ||
          isCommitting ||
          isGenerating ||
          isSending ||
          !hasApprovableDraft
        }
        onClick={() => void commitDraft(part.draftVersion)}
        startIcon={
          isCommitting ? (
            <CircularProgress size={14} color="inherit" />
          ) : (
            <Check size={15} />
          )
        }
        sx={{
          mt: 1.1,
          minHeight: 36,
          borderRadius: 2,
          backgroundColor: isReplacement ? "#B45309" : "#0F172A",
          boxShadow: "none",
          textTransform: "none",
          fontSize: "var(--assistant-chat-font-primary, 0.875rem)",
          fontWeight: 650,
          "&:hover": {
            backgroundColor: isReplacement ? "#92400E" : "#334155",
            boxShadow: "none",
          },
        }}
      >
        {isCommitting ? committingLabel : buttonLabel}
      </Button>
    </Paper>
  );
};

const AssistantMessageParts = ({
  message,
}: {
  message: AssistantMessage;
}): ReactElement => {
  const { messages } = useSurveyBuilderAssistant();

  if (message.role !== "USER" && message.status === "FAILED") {
    if (message.errorCode === "SELECTIVE_REPLACEMENT_DRAFT_CONFLICT") {
      return (
        <TextPart
          part={{
            type: "text",
            text: "That replacement was blocked because another preview was awaiting approval.",
          }}
          isAssistant
        />
      );
    }

    return (
      <Alert
        severity="error"
        role="note"
        sx={{
          fontSize: "var(--assistant-chat-font-primary, 14px)",
          lineHeight: 1.5,
        }}
      >
        {message.content.parts
          .flatMap((part) => (part.type === "text" ? [part.text] : []))
          .join("\n")}
      </Alert>
    );
  }

  return (
    <Stack spacing={1} sx={{ width: "100%", minWidth: 0 }}>
      {message.content.parts.map((part, index) => {
        const key = `${message.messageID}-${part.type}-${index}`;

        switch (part.type) {
          case "text":
            return (
              <TextPart
                key={key}
                part={part}
                isAssistant={message.role === "ASSISTANT"}
              />
            );
          case "notice":
            return (
              <AssistantNotice
                key={key}
                notice={getAssistantNotice(part)}
                interactive={message.messageID === messages.at(-1)?.messageID}
              />
            );
          case "survey-preview":
            return (
              <SurveyPreviewPart
                key={key}
                part={part}
                showReplacementNotice={
                  !message.content.parts.some(
                    (candidate) =>
                      candidate.type === "approval-controls" &&
                      candidate.draftVersion === part.draftVersion,
                  )
                }
              />
            );
          case "survey-order-preview":
            return <SurveyOrderPreview key={key} part={part} />;
          case "approval-controls":
            return (
              <ApprovalControlsPart
                key={key}
                part={part}
                preview={message.content.parts.find(
                  (candidate): candidate is AssistantSurveyPreviewPart =>
                    candidate.type === "survey-preview" &&
                    candidate.draftVersion === part.draftVersion,
                )}
              />
            );
        }
      })}
    </Stack>
  );
};

export default AssistantMessageParts;
