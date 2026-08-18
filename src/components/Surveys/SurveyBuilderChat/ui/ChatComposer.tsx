import { ReactElement } from "react";

import { ComposerPrimitive } from "@assistant-ui/react";
import { IconButton, styled, Tooltip, Typography } from "@mui/material";
import { ArrowUp, Paperclip } from "lucide-react";

import { useSurveyBuilderChat } from "../SurveyBuilderChatContext";

import DocumentUploadButton from "./DocumentUploadButton";

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

const ChatComposer = (): ReactElement => {
  const { isRunning, uploadDocument } = useSurveyBuilderChat();

  return (
    <Box sx={{ px: 2, pt: 1, pb: 1.5, flexShrink: 0 }}>
      <ComposerRoot>
        <Tooltip title="Attach a source document" arrow>
          <span>
            <DocumentUploadButton
              mode="generate"
              onFileSelected={uploadDocument}
              disabled={isRunning}
              aria-label="Attach a source document"
              sx={{ minWidth: 32, width: 32, height: 32, p: 0, borderRadius: 2 }}
            >
              <Paperclip size={17} aria-hidden="true" />
            </DocumentUploadButton>
          </span>
        </Tooltip>

        <ComposerInput
          placeholder="Ask about the document…"
          aria-label="Chat message"
          rows={1}
        />

        {isRunning ? (
          <Tooltip title="Generating a response" arrow>
            <span>
              <IconButton disabled size="small" sx={{ width: 32, height: 32 }}>
                <PulseDot
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "#94A3B8",
                    animation: "survey-chat-pulse 1s ease-in-out infinite",
                    "@keyframes survey-chat-pulse": {
                      "0%, 100%": { opacity: 0.35, transform: "scale(0.85)" },
                      "50%": { opacity: 1, transform: "scale(1)" },
                    },
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>
        ) : (
          <Tooltip title="Send message" arrow>
            <ComposerSend aria-label="Send message">
              <ArrowUp size={17} aria-hidden="true" />
            </ComposerSend>
          </Tooltip>
        )}
      </ComposerRoot>
      <Typography
        sx={{ mt: 0.75, color: "#94A3B8", fontSize: "0.6875rem", textAlign: "center" }}
      >
        Simulation only · No survey data is changed
      </Typography>
    </Box>
  );
};

export default ChatComposer;
