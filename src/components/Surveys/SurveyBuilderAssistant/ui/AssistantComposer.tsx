import type { ReactElement } from "react";

import { ComposerPrimitive } from "@assistant-ui/react";
import { IconButton, styled, Tooltip, Typography } from "@mui/material";
import { ArrowUp } from "lucide-react";

import { useSurveyBuilderAssistant } from "../SurveyBuilderAssistantContext";

const Box = styled("div")({});
const PulseDot = styled("span")({});

const ComposerRoot = styled(ComposerPrimitive.Root)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  gap: theme.spacing(0.5),
  width: "100%",
  minWidth: 0,
  padding: theme.spacing(0.75),
  border: "1px solid #CBD5E1",
  borderRadius: 14,
  backgroundColor: "#FFFFFF",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
  transition: "border-color 160ms ease, box-shadow 160ms ease",
  "&:focus-within": {
    borderColor: "#64748B",
    boxShadow: "0 0 0 3px rgba(100, 116, 139, 0.10)",
  },
}));

const ComposerInput = styled(ComposerPrimitive.Input)(() => ({
  flex: 1,
  minWidth: 0,
  maxHeight: 120,
  padding: "7px 4px",
  border: 0,
  outline: 0,
  resize: "none",
  background: "transparent",
  color: "#0F172A",
  font: "inherit",
  fontSize: "0.875rem",
  lineHeight: 1.45,
  "&::placeholder": { color: "#94A3B8" },
  "&:disabled": { cursor: "not-allowed", color: "#64748B" },
}));

const ComposerSend = styled(ComposerPrimitive.Send)(() => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  flexShrink: 0,
  padding: 0,
  border: 0,
  borderRadius: 9,
  backgroundColor: "#0F172A",
  color: "#FFFFFF",
  cursor: "pointer",
  transition: "background-color 160ms ease, opacity 160ms ease",
  "&:hover": { backgroundColor: "#334155" },
  "&:disabled": { cursor: "default", opacity: 0.32 },
}));

const AssistantComposer = (): ReactElement => {
  const {
    canSendMessages,
    isCommitting,
    isGenerating,
    isInitializing,
    isSending,
  } = useSurveyBuilderAssistant();

  const isBusy =
    isInitializing || isSending || isGenerating || isCommitting;

  const placeholder = isCommitting
    ? "Creating survey questions…"
    : isGenerating || isSending
      ? "The assistant is working…"
      : "Paste questions or tell the assistant what to create…";

  const helperText = isCommitting
    ? "Creating questions in your survey"
    : isGenerating || isSending
      ? "Processing your request"
      : "Messages can contain up to 10,000 characters";

  return (
    <Box sx={{ px: 2, pt: 1, pb: 1.5, flexShrink: 0 }}>
      <ComposerRoot>
        <ComposerInput
          maxLength={10_000}
          placeholder={placeholder}
          aria-label="Assistant message"
          rows={1}
        />

        {isBusy ? (
          <Tooltip title="Assistant is working" arrow>
            <span>
              <IconButton disabled size="small" sx={{ width: 32, height: 32 }}>
                <PulseDot
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "#94A3B8",
                    animation:
                      "survey-assistant-pulse 1s ease-in-out infinite",
                    "@keyframes survey-assistant-pulse": {
                      "0%, 100%": {
                        opacity: 0.35,
                        transform: "scale(0.85)",
                      },
                      "50%": { opacity: 1, transform: "scale(1)" },
                    },
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>
        ) : (
          <Tooltip title="Send message" arrow>
            <span>
              <ComposerSend
                disabled={!canSendMessages}
                aria-label="Send assistant message"
              >
                <ArrowUp size={17} aria-hidden="true" />
              </ComposerSend>
            </span>
          </Tooltip>
        )}
      </ComposerRoot>

      <Typography
        sx={{
          mt: 0.75,
          color: "#94A3B8",
          fontSize: "0.6875rem",
          textAlign: "center",
        }}
      >
        {helperText}
      </Typography>
    </Box>
  );
};

export default AssistantComposer;
