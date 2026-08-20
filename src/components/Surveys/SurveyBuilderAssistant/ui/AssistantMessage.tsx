import type { ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { MessagePrimitive } from "@assistant-ui/react";
import {
  Button,
  CircularProgress,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { Bot, Check, Copy, RefreshCw } from "lucide-react";

import type { AssistantMessage as AssistantMessageData } from "../../../../types/surveyBuilderAssistant.types";
import { safeCopyText } from "../../../../utils/utils";
import { useSurveyBuilderAssistant } from "../SurveyBuilderAssistantContext";

import AssistantMessageParts from "./AssistantMessageParts";

const Box = styled("div")({});

const AssistantAvatar = (): ReactElement => (
  <Box
    sx={{
      display: "grid",
      placeItems: "center",
      width: 25,
      height: 25,
      flexShrink: 0,
      border: "1px solid #E2E8F0",
      borderRadius: 1.75,
      color: "#475569",
      backgroundColor: "#FFFFFF",
    }}
  >
    <Bot size={14} aria-hidden="true" />
  </Box>
);

const AssistantMessage = ({
  message,
}: {
  message: AssistantMessageData;
}): ReactElement => {
  const { retryMessage } = useSurveyBuilderAssistant();
  const [isCopied, setIsCopied] = useState(false);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isUser = message.role === "USER";
  const isPending = message.status === "PENDING";
  const isFailed = message.status === "FAILED";

  const userMessageText = useMemo(
    () =>
      message.content.parts
        .filter((part) => part.type === "text")
        .map((part) => (part.type === "text" ? part.text : ""))
        .join("\n")
        .trim(),
    [message.content.parts],
  );

  useEffect(
    () => () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current);
      }
    },
    [],
  );

  const handleCopyMessage = async () => {
    if (!userMessageText) return;

    const copied = await safeCopyText(userMessageText);

    if (!copied) return;

    if (copyResetTimeoutRef.current) {
      clearTimeout(copyResetTimeoutRef.current);
    }

    setIsCopied(true);
    copyResetTimeoutRef.current = setTimeout(() => {
      setIsCopied(false);
      copyResetTimeoutRef.current = null;
    }, 1600);
  };

  const assistantLabel =
    message.role === "SYSTEM"
      ? "System"
      : message.role === "TOOL"
        ? "Assistant action"
        : "Assistant";

  return (
    <MessagePrimitive.Root
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: isUser ? "row-reverse" : "row",
          gap: 0.9,
          width: isUser ? "auto" : "100%",
          maxWidth: isUser ? "88%" : "100%",
          minWidth: 0,
        }}
      >
        {!isUser && <AssistantAvatar />}

        <Box sx={{ minWidth: 0, flex: isUser ? "initial" : 1 }}>
          {!isUser && (
            <Typography
              sx={{
                mb: 0.45,
                color: "#64748B",
                fontSize: "0.65rem",
                fontWeight: 650,
              }}
            >
              {assistantLabel}
            </Typography>
          )}

          <Box
            sx={{
              px: isUser ? 1.25 : 0,
              py: isUser ? 0.9 : 0,
              borderRadius: isUser ? "14px 14px 4px 14px" : 0,
              color: isUser ? "#FFFFFF" : "#2a2a46",
              backgroundColor: isUser ? "#4F46E5" : "transparent",
            }}
          >
            <AssistantMessageParts message={message} />
          </Box>

          {isUser && (
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={0.5}
              sx={{ mt: 0.4 }}
            >
              <Tooltip title={isCopied ? "Copied" : "Copy"} arrow>
                <span>
                  <IconButton
                    size="small"
                    disabled={!userMessageText}
                    aria-label={isCopied ? "Message copied" : "Copy message"}
                    onClick={() => void handleCopyMessage()}
                    sx={{
                      width: 24,
                      height: 24,
                      color: isCopied ? "#15803D" : "#64748B",
                      "&:hover": { backgroundColor: "#F1F5F9" },
                    }}
                  >
                    {isCopied ? (
                      <Check size={13} aria-hidden="true" />
                    ) : (
                      <Copy size={13} aria-hidden="true" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>

              {isPending ? (
                <>
                  <CircularProgress size={10} thickness={5} />
                  <Typography sx={{ color: "#94A3B8", fontSize: "0.625rem" }}>
                    Sending…
                  </Typography>
                </>
              ) : isFailed ? (
                <Button
                  size="small"
                  onClick={() => void retryMessage()}
                  startIcon={<RefreshCw size={12} />}
                  sx={{
                    minWidth: 0,
                    p: 0,
                    color: "#B91C1C",
                    textTransform: "none",
                    fontSize: "0.65rem",
                  }}
                >
                  Retry
                </Button>
              ) : null}
            </Stack>
          )}
        </Box>
      </Box>
    </MessagePrimitive.Root>
  );
};

export default AssistantMessage;
