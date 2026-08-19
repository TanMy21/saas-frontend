import type { ReactElement } from "react";
import { useMemo } from "react";

import { ThreadPrimitive } from "@assistant-ui/react";
import {
  Button,
  ButtonBase,
  CircularProgress,
  Paper,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { RotateCcw, Sparkles, X } from "lucide-react";
import { useParams } from "react-router-dom";

import { useAppTheme } from "../../../theme/useAppTheme";
import type { AssistantThreadStage } from "../../../types/surveyBuilderAssistant.types";

import { useSurveyBuilderAssistant } from "./SurveyBuilderAssistantContext";
import { SurveyBuilderAssistantProvider } from "./SurveyBuilderAssistantProvider";
import AssistantComposer from "./ui/AssistantComposer";
import AssistantEmptyState from "./ui/AssistantEmptyState";
import AssistantMessage from "./ui/AssistantMessage";

const Box = styled("div")({});

const getStageLabel = (stage?: AssistantThreadStage) => {
  switch (stage) {
    case "PROCESSING":
      return "Working";
    case "REVIEW":
      return "Review draft";
    case "COMMITTING":
      return "Creating questions";
    case "COMMITTED":
      return "Completed";
    case "FAILED":
      return "Needs attention";
    default:
      return "Ready";
  }
};

const AssistantWorkingIndicator = (): ReactElement => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      pl: 4.25,
      color: "#64748B",
    }}
  >
    <CircularProgress size={14} thickness={4.5} />
    <Typography sx={{ fontSize: "0.7rem" }}>
      The assistant is preparing a response…
    </Typography>
  </Box>
);

const SurveyBuilderAssistantThread = (): ReactElement => {
  const {
    clearError,
    createNewThread,
    errorMessage,
    hasMoreMessages,
    isCommitting,
    isGenerating,
    isInitializing,
    isLoadingOlder,
    isSending,
    loadOlderMessages,
    messages,
    thread,
  } = useSurveyBuilderAssistant();
  const { scrollStyles } = useAppTheme();

  const messagesByID = useMemo(
    () => new Map(messages.map((message) => [message.messageID, message])),
    [messages],
  );

  const isBusy =
    isInitializing || isSending || isGenerating || isCommitting;
  const stageLabel = getStageLabel(thread?.stage);
  const stageColor =
    thread?.stage === "FAILED"
      ? "#B91C1C"
      : thread?.stage === "COMMITTED"
        ? "#15803D"
        : "#475569";

  return (
    <ThreadPrimitive.Root
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: 2,
          py: 1.1,
          flexShrink: 0,
          borderBottom: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.85, minWidth: 0 }}
        >
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 29,
              height: 29,
              flexShrink: 0,
              borderRadius: 1.75,
              color: "#4F46E5",
              backgroundColor: "#EEF2FF",
            }}
          >
            <Sparkles size={15} aria-hidden="true" />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{ color: "#0F172A", fontSize: "0.8rem", fontWeight: 750 }}
            >
              Assistant
            </Typography>
            <Typography
              noWrap
              sx={{ color: stageColor, fontSize: "0.65rem", fontWeight: 600 }}
            >
              {stageLabel}
            </Typography>
          </Box>
        </Box>

        <Tooltip title="Start a new assistant thread" arrow>
          <span>
            <ButtonBase
              disabled={isBusy}
              aria-label="Start a new assistant thread"
              onClick={() => void createNewThread()}
              sx={{
                width: 30,
                height: 30,
                flexShrink: 0,
                borderRadius: 1.75,
                color: "#64748B",
                "&:hover": {
                  color: "#0F172A",
                  backgroundColor: "#F1F5F9",
                },
                "&.Mui-disabled": { opacity: 0.4 },
              }}
            >
              <RotateCcw size={15} aria-hidden="true" />
            </ButtonBase>
          </span>
        </Tooltip>
      </Box>

      {errorMessage && (
        <Box
          role="alert"
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            mx: 2,
            mt: 1.25,
            px: 1.25,
            py: 1,
            flexShrink: 0,
            border: "1px solid #FECACA",
            borderRadius: 2,
            color: "#991B1B",
            backgroundColor: "#FEF2F2",
          }}
        >
          <Typography sx={{ flex: 1, fontSize: "0.7rem", lineHeight: 1.45 }}>
            {errorMessage}
          </Typography>
          <ButtonBase
            aria-label="Dismiss assistant error"
            onClick={clearError}
            sx={{ p: 0.25, borderRadius: 1 }}
          >
            <X size={14} aria-hidden="true" />
          </ButtonBase>
        </Box>
      )}

      <ThreadPrimitive.Viewport
        autoScroll
        style={{
          flex: 1,
          minHeight: 0,
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: 680,
            minWidth: 0,
            mx: "auto",
            px: 2,
            py: 2,
            boxSizing: "border-box",
            ...scrollStyles.elementsPanel,
          }}
        >
          {hasMoreMessages && (
            <Button
              size="small"
              variant="text"
              disabled={isLoadingOlder}
              onClick={() => void loadOlderMessages()}
              sx={{
                alignSelf: "center",
                color: "#64748B",
                textTransform: "none",
                fontSize: "0.7rem",
              }}
            >
              {isLoadingOlder ? "Loading…" : "Load earlier messages"}
            </Button>
          )}

          {messages.length === 0 && <AssistantEmptyState />}

          <ThreadPrimitive.Messages>
            {({ message }) => {
              const assistantMessage = messagesByID.get(message.id);

              return assistantMessage ? (
                <AssistantMessage message={assistantMessage} />
              ) : null;
            }}
          </ThreadPrimitive.Messages>

          {isGenerating && <AssistantWorkingIndicator />}
        </Box>
      </ThreadPrimitive.Viewport>

      <AssistantComposer />
    </ThreadPrimitive.Root>
  );
};

const MissingSurveyAssistant = (): ReactElement => (
  <Paper
    variant="outlined"
    sx={{
      m: 2,
      p: 2,
      borderColor: "#FECACA",
      borderRadius: 2.5,
      backgroundColor: "#FEF2F2",
    }}
  >
    <Typography sx={{ color: "#991B1B", fontSize: "0.75rem" }}>
      A survey is required to start the assistant.
    </Typography>
  </Paper>
);

const SurveyBuilderAssistant = (): ReactElement => {
  const { surveyID } = useParams<{ surveyID: string }>();

  if (!surveyID) return <MissingSurveyAssistant />;

  return (
    <SurveyBuilderAssistantProvider surveyID={surveyID}>
      <SurveyBuilderAssistantThread />
    </SurveyBuilderAssistantProvider>
  );
};

export default SurveyBuilderAssistant;
