import { ReactElement } from "react";

import {
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  LinearProgress,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import {
  Check,
  CheckCircle2,
  FileSearch,
  FileText,
  RefreshCw,
  Sparkles,
  Upload,
} from "lucide-react";

import { questionTypes } from "../../../../utils/elementsConfig";
import { formatFileSize } from "../mockSurveyBuilderChat";
import type { SurveyChatMessage } from "../surveyBuilderChat.types";
import { useSurveyBuilderChat } from "../SurveyBuilderChatContext";

import DocumentUploadButton from "./DocumentUploadButton";

const Box = styled("div")({});

const cardSx = {
  width: "100%",
  p: 1.5,
  borderColor: "#E2E8F0",
  borderRadius: 2.5,
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
  boxSizing: "border-box",
};

export const WelcomeCard = (): ReactElement => {
  const { isRunning, uploadDocument } = useSurveyBuilderChat();

  return (
    <Paper variant="outlined" sx={{ ...cardSx, p: 1.75 }}>
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 34,
            height: 34,
            flexShrink: 0,
            borderRadius: 2,
            color: "#4F46E5",
            backgroundColor: "#EEF2FF",
          }}
        >
          <Sparkles size={18} aria-hidden="true" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: "#0F172A", fontSize: "0.9rem", fontWeight: 700 }}>
            Create with AI
          </Typography>
          <Typography sx={{ mt: 0.35, color: "#64748B", fontSize: "0.78rem", lineHeight: 1.5 }}>
            Upload a readable document and walk through a simulated generation flow.
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={0.75} sx={{ mt: 1.5 }}>
        <DocumentUploadButton
          fullWidth
          variant="contained"
          mode="generate"
          disabled={isRunning}
          onFileSelected={uploadDocument}
          startIcon={<Upload size={16} />}
          sx={{
            minHeight: 36,
            borderRadius: 2,
            backgroundColor: "#0F172A",
            boxShadow: "none",
            textTransform: "none",
            fontWeight: 650,
            "&:hover": { backgroundColor: "#334155", boxShadow: "none" },
          }}
        >
          Upload source document
        </DocumentUploadButton>
        <DocumentUploadButton
          fullWidth
          variant="outlined"
          mode="import"
          disabled={isRunning}
          onFileSelected={uploadDocument}
          startIcon={<FileSearch size={16} />}
          sx={{
            minHeight: 36,
            borderRadius: 2,
            borderColor: "#CBD5E1",
            color: "#334155",
            textTransform: "none",
            fontWeight: 650,
          }}
        >
          Import questions directly
        </DocumentUploadButton>
      </Stack>

      <Typography sx={{ mt: 1.1, color: "#94A3B8", fontSize: "0.6875rem", lineHeight: 1.45 }}>
        PDF, DOC, DOCX, ODT, TXT, Markdown and RTF · Up to 25 MB
      </Typography>
    </Paper>
  );
};

export const AttachmentCard = ({
  message,
}: {
  message: SurveyChatMessage;
}): ReactElement | null => {
  if (!message.attachment) return null;
  const { attachment } = message;

  return (
    <Paper variant="outlined" sx={{ ...cardSx, p: 1.25 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 34,
            height: 40,
            flexShrink: 0,
            borderRadius: 1.5,
            color: "#475569",
            backgroundColor: "#F1F5F9",
          }}
        >
          <FileText size={18} aria-hidden="true" />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography noWrap sx={{ color: "#0F172A", fontSize: "0.78rem", fontWeight: 650 }}>
            {attachment.name}
          </Typography>
          <Typography sx={{ mt: 0.2, color: "#64748B", fontSize: "0.6875rem" }}>
            {attachment.extension} · {formatFileSize(attachment.size)}
          </Typography>
        </Box>
        <CheckCircle2 size={17} color="#16A34A" aria-label="Attached" />
      </Stack>
    </Paper>
  );
};

export const ProgressCard = ({
  message,
}: {
  message: SurveyChatMessage;
}): ReactElement | null => {
  if (!message.progress) return null;
  const { progress } = message;

  return (
    <Paper variant="outlined" sx={cardSx}>
      <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="center">
        <Typography sx={{ color: "#0F172A", fontSize: "0.78rem", fontWeight: 700 }}>
          {progress.label}
        </Typography>
        <Typography sx={{ color: "#64748B", fontSize: "0.7rem", fontWeight: 650 }}>
          {progress.value}%
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={progress.value}
        sx={{
          mt: 1,
          height: 6,
          borderRadius: 999,
          backgroundColor: "#E2E8F0",
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            backgroundColor: progress.value === 100 ? "#16A34A" : "#4F46E5",
            transition: "transform 300ms ease",
          },
        }}
      />
      <Typography sx={{ mt: 0.8, color: "#64748B", fontSize: "0.7rem", lineHeight: 1.45 }}>
        {progress.detail}
      </Typography>
    </Paper>
  );
};

export const QuestionCountCard = (): ReactElement => {
  const { chooseQuestionCount, phase } = useSurveyBuilderChat();
  const counts = [5, 10, 15, 20];
  const disabled = phase !== "choosing-count";

  return (
    <Paper variant="outlined" sx={cardSx}>
      <Typography sx={{ color: "#0F172A", fontSize: "0.8rem", fontWeight: 700 }}>
        Number of questions
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 0.75, mt: 1.1 }}>
        {counts.map((count) => (
          <Button
            key={count}
            variant={count === 10 ? "contained" : "outlined"}
            disabled={disabled}
            onClick={() => chooseQuestionCount(count)}
            sx={{
              minWidth: 0,
              minHeight: 34,
              px: 0.5,
              borderRadius: 1.75,
              borderColor: "#CBD5E1",
              backgroundColor: count === 10 ? "#0F172A" : "#FFFFFF",
              color: count === 10 ? "#FFFFFF" : "#334155",
              boxShadow: "none",
              textTransform: "none",
              fontSize: "0.75rem",
              fontWeight: 700,
              "&:hover": {
                borderColor: "#94A3B8",
                backgroundColor: count === 10 ? "#334155" : "#F8FAFC",
                boxShadow: "none",
              },
            }}
          >
            {count}
          </Button>
        ))}
      </Box>
      <Typography sx={{ mt: 1, color: "#94A3B8", fontSize: "0.6875rem" }}>
        You can also type a number from 1–50.
      </Typography>
    </Paper>
  );
};

export const QuestionTypesCard = (): ReactElement => {
  const {
    generateQuestions,
    phase,
    selectedQuestionTypes,
    toggleQuestionType,
  } = useSurveyBuilderChat();
  const disabled = phase !== "choosing-types";

  return (
    <Paper variant="outlined" sx={cardSx}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Typography sx={{ color: "#0F172A", fontSize: "0.8rem", fontWeight: 700 }}>
          Allowed question types
        </Typography>
        <Chip
          size="small"
          label={`${selectedQuestionTypes.length} selected`}
          sx={{ height: 22, color: "#475569", backgroundColor: "#F1F5F9", fontSize: "0.65rem" }}
        />
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 0.25,
          mt: 0.8,
          maxHeight: 210,
          overflowY: "auto",
        }}
      >
        {questionTypes.map((questionType) => {
          const checked = selectedQuestionTypes.includes(questionType.type);
          return (
            <FormControlLabel
              key={questionType.type}
              disabled={disabled}
              control={
                <Checkbox
                  size="small"
                  checked={checked}
                  onChange={() => toggleQuestionType(questionType.type)}
                  sx={{
                    p: 0.55,
                    color: "#94A3B8",
                    "&.Mui-checked": { color: "#4F46E5" },
                  }}
                />
              }
              label={
                <Typography sx={{ color: "#334155", fontSize: "0.73rem", lineHeight: 1.25 }}>
                  {questionType.label}
                </Typography>
              }
              sx={{ m: 0, minWidth: 0 }}
            />
          );
        })}
      </Box>

      <Button
        fullWidth
        variant="contained"
        disabled={disabled || selectedQuestionTypes.length === 0}
        onClick={generateQuestions}
        startIcon={<Sparkles size={15} />}
        sx={{
          mt: 1.25,
          minHeight: 36,
          borderRadius: 2,
          backgroundColor: "#0F172A",
          boxShadow: "none",
          textTransform: "none",
          fontWeight: 650,
          "&:hover": { backgroundColor: "#334155", boxShadow: "none" },
        }}
      >
        Generate preview
      </Button>
    </Paper>
  );
};

export const PreviewCard = ({
  message,
}: {
  message: SurveyChatMessage;
}): ReactElement => {
  const { approveQuestions, phase, requestRevision } = useSurveyBuilderChat();
  const disabled = phase !== "reviewing";
  const questions = message.preview || [];
  const remaining = Math.max((message.previewTotal || questions.length) - questions.length, 0);

  return (
    <Paper variant="outlined" sx={{ ...cardSx, p: 0, overflow: "hidden" }}>
      <Box sx={{ px: 1.5, py: 1.25, backgroundColor: "#F8FAFC" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Box>
            <Typography sx={{ color: "#0F172A", fontSize: "0.8rem", fontWeight: 750 }}>
              Generated survey preview
            </Typography>
            <Typography sx={{ mt: 0.2, color: "#64748B", fontSize: "0.68rem" }}>
              {message.previewTotal} questions · Review before approval
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

      <Stack divider={<Divider flexItem />}>
        {questions.map((question) => (
          <Box key={question.id} sx={{ px: 1.5, py: 1.25 }}>
            <Stack direction="row" spacing={0.75} alignItems="flex-start">
              <Typography sx={{ color: "#64748B", fontSize: "0.7rem", fontWeight: 750, lineHeight: 1.5 }}>
                {question.number}.
              </Typography>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ color: "#0F172A", fontSize: "0.75rem", fontWeight: 650, lineHeight: 1.45 }}>
                  {question.prompt}
                </Typography>
                <Chip
                  size="small"
                  label={question.typeLabel}
                  sx={{ mt: 0.65, height: 20, color: "#475569", backgroundColor: "#F1F5F9", fontSize: "0.625rem" }}
                />
                {question.options && (
                  <Stack spacing={0.45} sx={{ mt: 0.8 }}>
                    {question.options.map((option) => (
                      <Stack key={option} direction="row" spacing={0.65} alignItems="flex-start">
                        <Box
                          sx={{
                            width: 5,
                            height: 5,
                            mt: "6px",
                            flexShrink: 0,
                            borderRadius: "50%",
                            backgroundColor: "#94A3B8",
                          }}
                        />
                        <Typography sx={{ color: "#475569", fontSize: "0.69rem", lineHeight: 1.45 }}>
                          {option}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>
          </Box>
        ))}
      </Stack>

      {remaining > 0 && (
        <Box sx={{ px: 1.5, py: 0.9, borderTop: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" }}>
          <Typography sx={{ color: "#64748B", fontSize: "0.68rem", textAlign: "center" }}>
            + {remaining} more generated questions
          </Typography>
        </Box>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={0.75} sx={{ p: 1.25, borderTop: "1px solid #E2E8F0" }}>
        <Button
          fullWidth
          variant="contained"
          disabled={disabled}
          onClick={approveQuestions}
          startIcon={<Check size={15} />}
          sx={{
            minHeight: 34,
            borderRadius: 1.75,
            backgroundColor: "#0F172A",
            boxShadow: "none",
            textTransform: "none",
            fontSize: "0.75rem",
            fontWeight: 650,
            "&:hover": { backgroundColor: "#334155", boxShadow: "none" },
          }}
        >
          Approve
        </Button>
        <Button
          fullWidth
          variant="outlined"
          disabled={disabled}
          onClick={requestRevision}
          startIcon={<RefreshCw size={14} />}
          sx={{
            minHeight: 34,
            borderRadius: 1.75,
            borderColor: "#CBD5E1",
            color: "#334155",
            textTransform: "none",
            fontSize: "0.75rem",
            fontWeight: 650,
          }}
        >
          Revise
        </Button>
      </Stack>
    </Paper>
  );
};

export const SuccessCard = ({
  message,
}: {
  message: SurveyChatMessage;
}): ReactElement => (
  <Paper
    variant="outlined"
    sx={{ ...cardSx, borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" }}
  >
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <CheckCircle2 size={18} color="#16A34A" aria-hidden="true" />
      <Typography sx={{ color: "#166534", fontSize: "0.75rem", lineHeight: 1.5 }}>
        {message.text}
      </Typography>
    </Stack>
  </Paper>
);

export const ErrorCard = ({
  message,
}: {
  message: SurveyChatMessage;
}): ReactElement => (
  <Paper
    variant="outlined"
    sx={{ ...cardSx, borderColor: "#FECACA", backgroundColor: "#FEF2F2" }}
  >
    <Typography sx={{ color: "#991B1B", fontSize: "0.75rem", lineHeight: 1.5 }}>
      {message.text}
    </Typography>
  </Paper>
);
