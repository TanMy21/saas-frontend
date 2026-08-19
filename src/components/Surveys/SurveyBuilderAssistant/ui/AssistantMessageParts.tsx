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
} from "../../../../types/surveyBuilderAssistant.types";
import { useSurveyBuilderAssistant } from "../SurveyBuilderAssistantContext";

const Box = styled("div")({});

const formatQuestionType = (type: string) =>
  type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const TextPart = ({
  part,
}: {
  part: AssistantTextPart;
}): ReactElement => (
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
}): ReactElement => (
  <Paper
    variant="outlined"
    sx={{
      width: "100%",
      borderColor: "#E2E8F0",
      borderRadius: 2.5,
      overflow: "hidden",
      boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
      boxSizing: "border-box",
    }}
  >
    <Box sx={{ px: 1.5, py: 1.25, backgroundColor: "#F8FAFC" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            noWrap
            sx={{ color: "#0F172A", fontSize: "0.8rem", fontWeight: 750 }}
          >
            {part.title || "Survey draft"}
          </Typography>
          <Typography sx={{ mt: 0.2, color: "#64748B", fontSize: "0.68rem" }}>
            {part.questions.length} question
            {part.questions.length === 1 ? "" : "s"} · Draft version {part.draftVersion}
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
            color: "#4F46E5",
            backgroundColor: "#EEF2FF",
          }}
        >
          <FileText size={16} aria-hidden="true" />
        </Box>
      </Stack>
    </Box>

    <Divider />

    {part.questions.length === 0 ? (
      <Typography
        sx={{ px: 1.5, py: 2, color: "#64748B", fontSize: "0.72rem" }}
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

const ApprovalControlsPart = ({
  part,
}: {
  part: AssistantApprovalControlsPart;
}): ReactElement => {
  const { commitDraft, isCommitting, isGenerating, thread } =
    useSurveyBuilderAssistant();

  const isCommitted =
    thread?.status === "COMPLETED" || thread?.stage === "COMMITTED";
  const questionCount = thread?.draft.questions.length ?? 0;

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
            sx={{ color: "#166534", fontSize: "0.75rem", lineHeight: 1.5 }}
          >
            The approved questions were added to the survey.
          </Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        p: 1.25,
        borderColor: "#C7D2FE",
        borderRadius: 2.5,
        backgroundColor: "#F8FAFF",
        boxSizing: "border-box",
      }}
    >
      <Typography
        sx={{ color: "#0F172A", fontSize: "0.78rem", fontWeight: 700 }}
      >
        Ready to create these questions?
      </Typography>
      <Typography
        sx={{ mt: 0.35, color: "#64748B", fontSize: "0.7rem", lineHeight: 1.45 }}
      >
        This appends the latest draft to the survey. You can continue asking for
        changes before approving.
      </Typography>

      <Button
        fullWidth
        variant="contained"
        disabled={isCommitting || isGenerating || questionCount === 0}
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
          backgroundColor: "#0F172A",
          boxShadow: "none",
          textTransform: "none",
          fontSize: "0.75rem",
          fontWeight: 650,
          "&:hover": { backgroundColor: "#334155", boxShadow: "none" },
        }}
      >
        {isCommitting
          ? "Creating questions…"
          : `Create ${questionCount} question${questionCount === 1 ? "" : "s"}`}
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
        case "approval-controls":
          return <ApprovalControlsPart key={key} part={part} />;
      }
    })}
  </Stack>
);

export default AssistantMessageParts;
