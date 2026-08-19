import type { ReactElement } from "react";

import { MessagePrimitive } from "@assistant-ui/react";
import {
  Button,
  CircularProgress,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { Bot, RefreshCw } from "lucide-react";

import type { AssistantMessage as AssistantMessageData } from "../../../../types/surveyBuilderAssistant.types";
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
  const isUser = message.role === "USER";
  const isPending = message.status === "PENDING";
  const isFailed = message.status === "FAILED";

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
              color: isUser ? "#FFFFFF" : "#334155",
              backgroundColor: isUser ? "#0F172A" : "transparent",
            }}
          >
            <AssistantMessageParts message={message} />
          </Box>

          {isUser && (isPending || isFailed) && (
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={0.5}
              sx={{ mt: 0.4 }}
            >
              {isPending ? (
                <>
                  <CircularProgress size={10} thickness={5} />
                  <Typography sx={{ color: "#94A3B8", fontSize: "0.625rem" }}>
                    Sending…
                  </Typography>
                </>
              ) : (
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
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </MessagePrimitive.Root>
  );
};

export default AssistantMessage;
