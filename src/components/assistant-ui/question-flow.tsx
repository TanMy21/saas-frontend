import { useEffect, useId, useRef, useState } from "react";

import {
  Alert,
  Button,
  ButtonBase,
  CircularProgress,
  LinearProgress,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { ArrowLeft, Check, Circle } from "lucide-react";

const Box = styled("div")({});

export interface QuestionFlowStep {
  id: string;
  question: string;
  description?: string;
  options: {
    id: string;
    label: string;
    description?: string;
    exclusive?: boolean;
  }[];
  selectionMode?: "single" | "multiple";
  minSelections?: number;
  maxSelections?: number;
}

export type QuestionFlowAnswers = Record<string, string[]>;

// Standalone assistant-ui Question Flow interaction, styled for the app's MUI theme.
export function QuestionFlow({
  steps,
  defaultValue = {},
  choice,
  onComplete,
  completeLabel = "Submit",
  disabled = false,
}: {
  steps: QuestionFlowStep[];
  defaultValue?: QuestionFlowAnswers;
  choice?: QuestionFlowAnswers;
  onComplete?: (answers: QuestionFlowAnswers) => void | Promise<void>;
  completeLabel?: string;
  disabled?: boolean;
}) {
  const [answers, setAnswers] = useState<QuestionFlowAnswers>(() =>
    Object.fromEntries(
      steps.map((step) => [
        step.id,
        [...new Set(defaultValue[step.id] ?? [])]
          .filter((id) => step.options.some((option) => option.id === id))
          .slice(0, step.selectionMode === "multiple" ? step.maxSelections : 1),
      ]),
    ),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [confirmed, setConfirmed] = useState<QuestionFlowAnswers>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const previousIndexRef = useRef(0);
  const questionID = useId();

  useEffect(() => {
    if (previousIndexRef.current === activeIndex) return;
    previousIndexRef.current = activeIndex;
    optionsRef.current
      ?.querySelector<HTMLButtonElement>("button:not(:disabled)")
      ?.focus();
  }, [activeIndex]);

  if (steps.length === 0) return null;

  const receipt = choice ?? confirmed;
  const step = steps[Math.min(activeIndex, steps.length - 1)];
  const selected = answers[step.id] ?? [];
  const isMultiple = step.selectionMode === "multiple";
  const isLast = activeIndex === steps.length - 1;
  const isDisabled = disabled || isSubmitting;
  const canAdvance =
    selected.length >= (step.minSelections ?? 1) &&
    selected.length <= (step.maxSelections ?? step.options.length);

  const complete = async (nextAnswers: QuestionFlowAnswers) => {
    if (!onComplete || disabled || submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setError(null);
    try {
      await onComplete(nextAnswers);
      setConfirmed(nextAnswers);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "The answers could not be sent. Please try again.",
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const pick = (id: string) => {
    if (isDisabled || submittingRef.current) return;
    const option = step.options.find((candidate) => candidate.id === id);
    if (!option) return;
    const nextSelected =
      !isMultiple || option.exclusive
        ? [id]
        : selected.includes(id)
          ? selected.filter((value) => value !== id)
          : [
              ...selected.filter(
                (value) =>
                  !step.options.find((candidate) => candidate.id === value)
                    ?.exclusive,
              ),
              id,
            ];
    if (nextSelected.length > (step.maxSelections ?? step.options.length))
      return;
    const nextAnswers = { ...answers, [step.id]: nextSelected };
    setAnswers(nextAnswers);
    setError(null);
    if (!isMultiple) {
      if (isLast) void complete(nextAnswers);
      else setActiveIndex((index) => index + 1);
    }
  };

  return (
    <Paper
      variant="outlined"
      data-slot="question-flow"
      data-state={receipt || !onComplete ? "receipt" : "open"}
      sx={{
        width: "100%",
        minWidth: 0,
        p: 1.5,
        borderColor: "#DDE3EC",
        borderRadius: 2.5,
        boxSizing: "border-box",
      }}
    >
      {receipt || !onComplete ? (
        <Stack spacing={1.25}>
          {receipt && (
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                color: "#15803D",
                fontSize: "var(--assistant-chat-font-label, 12px)",
                fontWeight: 600,
              }}
            >
              <Check size={14} aria-hidden="true" />
              Sent to assistant
            </Typography>
          )}
          {steps.map((item) => (
            <Box key={item.id}>
              <Typography
                sx={{
                  color: "#334155",
                  fontSize: "var(--assistant-chat-font-primary, 14px)",
                  fontWeight: 600,
                }}
              >
                {item.question}
              </Typography>
              <Typography
                sx={{
                  mt: 0.25,
                  color: "#64748B",
                  fontSize: "var(--assistant-chat-font-secondary, 13px)",
                  lineHeight: 1.5,
                }}
              >
                {item.options
                  .filter(
                    (option) =>
                      !receipt || receipt[item.id]?.includes(option.id),
                  )
                  .map((option) => option.label)
                  .join(", ")}
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Typography
              sx={{
                color: "#64748B",
                fontSize: "var(--assistant-chat-font-label, 12px)",
                fontWeight: 500,
              }}
            >
              {activeIndex + 1} of {steps.length}
            </Typography>
            {activeIndex > 0 && (
              <Button
                size="small"
                disabled={isDisabled}
                startIcon={<ArrowLeft size={13} aria-hidden="true" />}
                onClick={() => {
                  setError(null);
                  setActiveIndex((index) => index - 1);
                }}
                sx={{
                  minWidth: 0,
                  py: 0,
                  color: "#64748B",
                  fontSize: "var(--assistant-chat-font-label, 12px)",
                  textTransform: "none",
                }}
              >
                Back
              </Button>
            )}
          </Stack>
          <LinearProgress
            variant="determinate"
            value={((activeIndex + 1) / steps.length) * 100}
            aria-label="Question progress"
            sx={{
              height: 3,
              mb: 1.5,
              borderRadius: 2,
              backgroundColor: "#EEF2FF",
              "& .MuiLinearProgress-bar": { backgroundColor: "#6366F1" },
            }}
          />
          <Typography
            id={questionID}
            component="p"
            sx={{
              color: "#0F172A",
              fontSize: "var(--assistant-chat-font-title, 15px)",
              fontWeight: 600,
              lineHeight: 1.45,
            }}
          >
            {step.question}
          </Typography>
          {step.description && (
            <Typography
              sx={{
                mt: 0.4,
                color: "#64748B",
                fontSize: "var(--assistant-chat-font-secondary, 13px)",
                lineHeight: 1.5,
              }}
            >
              {step.description}
            </Typography>
          )}
          <Stack
            ref={optionsRef}
            role="group"
            aria-labelledby={questionID}
            spacing={0.75}
            sx={{ mt: 1.25 }}
          >
            {step.options.map((option) => {
              const checked = selected.includes(option.id);
              return (
                <ButtonBase
                  key={option.id}
                  disabled={isDisabled}
                  aria-pressed={checked}
                  onClick={() => pick(option.id)}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 1,
                    width: "100%",
                    px: 1.1,
                    py: 0.9,
                    border: "1px solid",
                    borderColor: checked ? "#818CF8" : "#E2E8F0",
                    borderRadius: 1.75,
                    color: checked ? "#4338CA" : "#334155",
                    backgroundColor: checked ? "#EEF2FF" : "#FFFFFF",
                    textAlign: "left",
                    "&:hover": {
                      borderColor: "#A5B4FC",
                      backgroundColor: "#F8FAFF",
                    },
                    "&:focus-visible": {
                      outline: "2px solid #6366F1",
                      outlineOffset: 2,
                    },
                    "&.Mui-disabled": { opacity: 0.55 },
                  }}
                >
                  {checked ? (
                    <Check
                      size={15}
                      aria-hidden="true"
                      style={{ flexShrink: 0, marginTop: 3 }}
                    />
                  ) : (
                    <Circle
                      size={15}
                      aria-hidden="true"
                      style={{ flexShrink: 0, marginTop: 3, color: "#94A3B8" }}
                    />
                  )}
                  <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
                    <Typography
                      component="span"
                      sx={{
                        display: "block",
                        color: "inherit",
                        fontSize: "var(--assistant-chat-font-primary, 14px)",
                        fontWeight: 500,
                        lineHeight: 1.5,
                      }}
                    >
                      {option.label}
                    </Typography>
                    {option.description && (
                      <Typography
                        component="span"
                        sx={{
                          display: "block",
                          mt: 0.2,
                          color: "#64748B",
                          fontSize:
                            "var(--assistant-chat-font-secondary, 13px)",
                          lineHeight: 1.5,
                        }}
                      >
                        {option.description}
                      </Typography>
                    )}
                  </Box>
                </ButtonBase>
              );
            })}
          </Stack>
          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 1,
                fontSize: "var(--assistant-chat-font-secondary, 13px)",
              }}
            >
              {error}
            </Alert>
          )}
          {(isMultiple || (isLast && error)) && (
            <Button
              fullWidth
              variant="contained"
              disabled={isDisabled || !canAdvance}
              onClick={() => {
                if (isLast) void complete(answers);
                else {
                  setError(null);
                  setActiveIndex((index) => index + 1);
                }
              }}
              sx={{
                mt: 1.25,
                minHeight: 34,
                borderRadius: 1.75,
                backgroundColor: "#4F46E5",
                boxShadow: "none",
                fontSize: "var(--assistant-chat-font-primary, 14px)",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { backgroundColor: "#4338CA", boxShadow: "none" },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={15} color="inherit" />
              ) : isLast ? (
                completeLabel
              ) : (
                "Next"
              )}
            </Button>
          )}
          {isSubmitting && !isMultiple && (
            <Typography
              role="status"
              sx={{
                mt: 1,
                color: "#64748B",
                fontSize: "var(--assistant-chat-font-label, 12px)",
              }}
            >
              Sending answers…
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
}
