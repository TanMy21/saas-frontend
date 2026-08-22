import type { ChangeEvent, ReactElement } from "react";
import { useRef } from "react";

import { ComposerPrimitive } from "@assistant-ui/react";
import {
  CircularProgress,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowUp,
  CheckCircle2,
  FileText,
  Paperclip,
  RotateCcw,
  X,
} from "lucide-react";

import type { AssistantComposerDocument } from "../../../../types/surveyBuilderAssistant.types";
import { useSurveyBuilderAssistant } from "../SurveyBuilderAssistantContext";

const Box = styled("div")({});
const PulseDot = styled("span")({});

const MAX_DOCUMENTS_PER_MESSAGE = 3;
const DOCUMENT_ACCEPT =
  ".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

const PROCESSING_DOCUMENT_STATUSES = new Set<
  AssistantComposerDocument["status"]
>(["UPLOADING", "PENDING_SCAN", "SCANNING", "ANALYZING"]);

const RETRYABLE_DOCUMENT_STATUSES = new Set<
  AssistantComposerDocument["status"]
>(["UPLOAD_FAILED", "POLLING_FAILED", "SCAN_FAILED", "ANALYSIS_FAILED"]);

const formatFileSize = (sizeBytes: number) => {
  if (sizeBytes < 1024) return `${sizeBytes} B`;

  const sizeKilobytes = sizeBytes / 1024;

  if (sizeKilobytes < 1024) return `${sizeKilobytes.toFixed(1)} KB`;

  return `${(sizeKilobytes / 1024).toFixed(1)} MB`;
};

const getDocumentStatusLabel = (
  status: AssistantComposerDocument["status"],
) => {
  switch (status) {
    case "UPLOADING":
      return "Uploading";
    case "PENDING_SCAN":
      return "Waiting for security scan";
    case "SCANNING":
      return "Security scanning";
    case "ANALYZING":
      return "Analyzing document";
    case "READY":
      return "Ready";
    case "REJECTED":
      return "Rejected";
    case "SCAN_FAILED":
      return "Scan failed";
    case "ANALYSIS_FAILED":
      return "Analysis failed";
    case "POLLING_FAILED":
      return "Status unavailable";
    case "DELETED":
      return "Removed";
    default:
      return "Upload failed";
  }
};

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
    canSendComposerMessage,
    canSendMessages,
    composerDocuments,
    isCommitting,
    isGenerating,
    isInitializing,
    isPreparingDocuments,
    isSending,
    removeComposerDocument,
    retryComposerDocument,
    selectComposerDocuments,
    thread,
  } = useSurveyBuilderAssistant();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isBusy =
    isInitializing ||
    isSending ||
    isGenerating ||
    isCommitting ||
    isPreparingDocuments;
  const hasDocumentError = composerDocuments.some(
    (document) =>
      document.status !== "READY" &&
      !PROCESSING_DOCUMENT_STATUSES.has(document.status),
  );
  const canSelectDocuments =
    canSendMessages && composerDocuments.length < MAX_DOCUMENTS_PER_MESSAGE;

  const handleDocumentSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    event.target.value = "";

    if (files.length > 0) {
      void selectComposerDocuments(files);
    }
  };

  const placeholder = !thread
    ? "Preparing the assistant…"
    : thread.status === "ARCHIVED"
      ? "This chat is archived"
      : thread.status === "COMPLETED"
        ? "This chat is read-only"
        : isCommitting
          ? "Creating survey questions…"
          : isPreparingDocuments
            ? "Preparing attached documents…"
            : hasDocumentError
              ? "Remove or retry the document to continue…"
              : isGenerating || isSending
                ? "The assistant is working…"
                : "Paste questions or tell the assistant what to create…";

  const helperText = !thread
    ? "Starting a new chat"
    : thread.status === "ARCHIVED"
      ? "Archived chats cannot accept messages"
      : thread.status === "COMPLETED"
        ? "Previous chats are read-only"
        : isCommitting
          ? "Creating questions in your survey"
          : isPreparingDocuments
            ? "Your message can be sent when every document is ready"
            : hasDocumentError
              ? "Resolve the failed document before sending"
              : isGenerating || isSending
                ? "Processing..."
                : "Attach up to 3 PDF, DOCX, or TXT files · 10 MB each";

  return (
    <Box sx={{ px: 2, pt: 1, pb: 1.5, flexShrink: 0 }}>
      {composerDocuments.length > 0 && (
        <Stack spacing={0.65} sx={{ mb: 0.75 }}>
          {composerDocuments.map((document) => {
            const isProcessing = PROCESSING_DOCUMENT_STATUSES.has(
              document.status,
            );
            const isReady = document.status === "READY";
            const canRetry = RETRYABLE_DOCUMENT_STATUSES.has(document.status);

            return (
              <Box
                key={document.clientDocumentID}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  minWidth: 0,
                  px: 1,
                  py: 0.75,
                  border: "1px solid",
                  borderColor: isReady
                    ? "#BBF7D0"
                    : document.errorMessage
                      ? "#FECACA"
                      : "#E2E8F0",
                  borderRadius: 2,
                  backgroundColor: isReady
                    ? "#F0FDF4"
                    : document.errorMessage
                      ? "#FEF2F2"
                      : "#F8FAFC",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    borderRadius: 1.5,
                    color: isReady ? "#15803D" : "#64748B",
                    backgroundColor: isReady ? "#DCFCE7" : "#E2E8F0",
                  }}
                >
                  <FileText size={15} aria-hidden="true" />
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    noWrap
                    title={document.fileName}
                    sx={{
                      color: "#0F172A",
                      fontSize: "0.7rem",
                      fontWeight: 650,
                    }}
                  >
                    {document.fileName}
                  </Typography>
                  <Typography
                    noWrap
                    title={document.errorMessage ?? undefined}
                    sx={{
                      mt: 0.1,
                      color: document.errorMessage ? "#B91C1C" : "#64748B",
                      fontSize: "0.62rem",
                    }}
                  >
                    {document.errorMessage ??
                      `${getDocumentStatusLabel(document.status)} · ${formatFileSize(document.sizeBytes)}`}
                  </Typography>
                </Box>

                {isProcessing ? (
                  <CircularProgress size={14} thickness={4.5} />
                ) : isReady ? (
                  <CheckCircle2
                    size={16}
                    color="#16A34A"
                    aria-label="Document ready"
                  />
                ) : canRetry ? (
                  <Tooltip title="Retry document" arrow>
                    <IconButton
                      size="small"
                      disabled={!canSendMessages}
                      aria-label={`Retry ${document.fileName}`}
                      onClick={() =>
                        void retryComposerDocument(document.clientDocumentID)
                      }
                      sx={{ width: 26, height: 26, color: "#475569" }}
                    >
                      <RotateCcw size={13} aria-hidden="true" />
                    </IconButton>
                  </Tooltip>
                ) : null}

                <Tooltip title="Remove document" arrow>
                  <IconButton
                    size="small"
                    aria-label={`Remove ${document.fileName}`}
                    onClick={() =>
                      void removeComposerDocument(document.clientDocumentID)
                    }
                    sx={{ width: 26, height: 26, color: "#64748B" }}
                  >
                    <X size={14} aria-hidden="true" />
                  </IconButton>
                </Tooltip>
              </Box>
            );
          })}
        </Stack>
      )}

      <ComposerRoot>
        <input
          ref={fileInputRef}
          hidden
          multiple
          type="file"
          accept={DOCUMENT_ACCEPT}
          aria-label="Select assistant documents"
          onChange={handleDocumentSelection}
        />

        <Tooltip
          title={
            canSelectDocuments
              ? "Attach documents"
              : composerDocuments.length >= MAX_DOCUMENTS_PER_MESSAGE
                ? "Maximum 3 documents per message"
                : "Documents cannot be attached right now"
          }
          arrow
        >
          <span>
            <IconButton
              size="small"
              disabled={!canSelectDocuments}
              aria-label="Attach documents"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                width: 32,
                height: 32,
                flexShrink: 0,
                color: "#64748B",
              }}
            >
              <Paperclip size={16} aria-hidden="true" />
            </IconButton>
          </span>
        </Tooltip>

        <ComposerInput
          disabled={!canSendMessages}
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
                    animation: "survey-assistant-pulse 1s ease-in-out infinite",
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
                disabled={!canSendComposerMessage}
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
