import type { ReactElement } from "react";

import {
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
import { useSurveyBuilderAssistant } from "../SurveyBuilderAssistantContext";
import { isAssistantThreadReadOnly } from "../surveyBuilderAssistantLifecycle";

const Box = styled("div")({});

const formatQuestionType = (type: string) =>
  type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const TextPart = ({ part }: { part: AssistantTextPart }): ReactElement => (
  <Typography
    sx={{
      color: "inherit",
      fontSize: "0.78rem",
      lineHeight: 1.55,
      overflowWrap: "anywhere",
      whiteSpace: "pre-wrap",
    }}
  >
    {part.text}
  </Typography>
);

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
              fontSize: "0.6rem",
              fontWeight: 700,
            }}
          >
            {index + 1}
          </Box>
          <Typography
            sx={{ color: "#475569", fontSize: "0.7rem", lineHeight: 1.45 }}
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
}: {
  part: AssistantSurveyPreviewPart;
}): ReactElement => {
  const isReplaceAll = part.commitMode === "REPLACE_ALL";
  const replacedQuestionCount = part.replacedQuestionCount ?? 0;

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        borderColor: isReplaceAll ? "#F59E0B" : "#E2E8F0",
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
          backgroundColor: isReplaceAll ? "#FFFBEB" : "#F8FAFC",
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
                color: isReplaceAll ? "#92400E" : "#0F172A",
                fontSize: "0.8rem",
                fontWeight: 750,
              }}
            >
              {part.title ||
                (isReplaceAll ? "Replacement survey draft" : "Survey draft")}
            </Typography>

            <Typography
              sx={{
                mt: 0.2,
                color: isReplaceAll ? "#B45309" : "#64748B",
                fontSize: "0.68rem",
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
              color: isReplaceAll ? "#B45309" : "#4F46E5",
              backgroundColor: isReplaceAll ? "#FEF3C7" : "#EEF2FF",
            }}
          >
            <FileText size={16} aria-hidden="true" />
          </Box>
        </Stack>
      </Box>

      <Divider />

      {isReplaceAll && (
        <>
          <Box
            sx={{
              px: 1.5,
              py: 1.25,
              color: "#92400E",
              backgroundColor: "#FFFBEB",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.74rem",
                fontWeight: 750,
                lineHeight: 1.45,
              }}
            >
              This is a complete replacement preview.
            </Typography>

            <Typography
              sx={{
                mt: 0.35,
                fontSize: "0.69rem",
                lineHeight: 1.5,
              }}
            >
              {replacedQuestionCount} current question
              {replacedQuestionCount === 1 ? "" : "s"} will be removed and{" "}
              {part.questions.length} replacement question
              {part.questions.length === 1 ? "" : "s"} will be created.
              {part.removesFlowLogic !== false &&
                " Existing flow logic tied to the current questions will also be removed."}
            </Typography>
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
            fontSize: "0.72rem",
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
                    fontSize: "0.7rem",
                    fontWeight: 750,
                    lineHeight: 1.5,
                  }}
                >
                  {index + 1}.
                </Typography>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      color: "#0F172A",
                      fontSize: "0.75rem",
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
                        fontSize: "0.69rem",
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
                        fontSize: "0.625rem",
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
                          fontSize: "0.625rem",
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
    <div className="space-y-3 rounded-lg border p-4">
      <div>
        <p className="font-medium">Proposed question order</p>
        <p className="text-sm text-muted-foreground">
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
                <p className="text-xs text-muted-foreground">
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
}: {
  part: AssistantApprovalControlsPart;
}): ReactElement => {
  const { commitDraft, isCommitting, isGenerating, thread } =
    useSurveyBuilderAssistant();

  const isCommitted = thread?.stage === "COMMITTED";
  const isReadOnly = isAssistantThreadReadOnly(thread);

  const commitMode = part.commitMode ?? thread?.draft.commitMode ?? "APPEND";

  const questionCount =
    part.questionCount ?? thread?.draft.questions.length ?? 0;

  const replacedQuestionCount =
    part.replacedQuestionCount ??
    thread?.draft.replacementProposal?.replacedQuestionCount ??
    0;

  const isReplaceAll = commitMode === "REPLACE_ALL";
  const isReorder = commitMode === "REORDER";

  const hasApprovableDraft = isReorder || questionCount > 0;

  const title = isReplaceAll
    ? "Replace all current questions?"
    : isReorder
      ? "Ready to apply this question order?"
      : "Ready to create these questions?";

  const description = isReplaceAll
    ? `${replacedQuestionCount} current question${
        replacedQuestionCount === 1 ? "" : "s"
      } will be removed and ${questionCount} replacement question${
        questionCount === 1 ? "" : "s"
      } will be created. Existing flow logic tied to the old questions will also be removed.`
    : isReorder
      ? "This will reorder the existing survey questions. No questions will be created or deleted."
      : "This appends the latest draft to the survey. You can continue asking for changes before approving.";

  const buttonLabel = isReplaceAll
    ? `Replace with ${questionCount} question${questionCount === 1 ? "" : "s"}`
    : isReorder
      ? "Apply reorder"
      : `Create ${questionCount} question${questionCount === 1 ? "" : "s"}`;

  const committingLabel = isReplaceAll
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
              fontSize: "0.75rem",
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
    return (
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          p: 1.25,
          borderColor: "#E2E8F0",
          borderRadius: 2.5,
          backgroundColor: "#F8FAFC",
          boxSizing: "border-box",
        }}
      >
        <Typography sx={{ color: "#64748B", fontSize: "0.75rem" }}>
          This previous chat is read-only.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        p: 1.25,
        borderColor: isReplaceAll ? "#F59E0B" : "#C7D2FE",
        borderRadius: 2.5,
        backgroundColor: isReplaceAll ? "#FFFBEB" : "#F8FAFF",
        boxSizing: "border-box",
      }}
    >
      <Typography
        sx={{
          color: isReplaceAll ? "#92400E" : "#0F172A",
          fontSize: "0.78rem",
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 0.35,
          color: isReplaceAll ? "#92400E" : "#64748B",
          fontSize: "0.7rem",
          lineHeight: 1.45,
        }}
      >
        {description}
      </Typography>

      <Button
        fullWidth
        variant="contained"
        disabled={
          isReadOnly || isCommitting || isGenerating || !hasApprovableDraft
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
          backgroundColor: isReplaceAll ? "#B45309" : "#0F172A",
          boxShadow: "none",
          textTransform: "none",
          fontSize: "0.75rem",
          fontWeight: 650,
          "&:hover": {
            backgroundColor: isReplaceAll ? "#92400E" : "#334155",
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
}): ReactElement => (
  <Stack spacing={1} sx={{ width: "100%", minWidth: 0 }}>
    {message.content.parts.map((part, index) => {
      const key = `${message.messageID}-${part.type}-${index}`;

      switch (part.type) {
        case "text":
          return <TextPart key={key} part={part} />;
        case "survey-preview":
          return <SurveyPreviewPart key={key} part={part} />;
        case "survey-order-preview":
          return <SurveyOrderPreview part={part} />;
        case "approval-controls":
          return <ApprovalControlsPart key={key} part={part} />;
      }
    })}
  </Stack>
);

export default AssistantMessageParts;
