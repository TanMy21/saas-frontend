import { ReactElement } from "react";

import { MessagePrimitive } from "@assistant-ui/react";
import { styled, Typography } from "@mui/material";
import { Bot } from "lucide-react";

import type { SurveyChatMessage } from "../surveyBuilderChat.types";

import {
  AttachmentCard,
  ErrorCard,
  PreviewCard,
  ProgressCard,
  QuestionCountCard,
  QuestionTypesCard,
  SuccessCard,
  WelcomeCard,
} from "./ChatInteractiveCards";

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

const renderContent = (message: SurveyChatMessage): ReactElement => {
  switch (message.kind) {
    case "welcome":
      return <WelcomeCard />;
    case "attachment":
      return <AttachmentCard message={message} />;
    case "progress":
      return <ProgressCard message={message} />;
    case "question-count":
      return <QuestionCountCard />;
    case "question-types":
      return <QuestionTypesCard />;
    case "preview":
      return <PreviewCard message={message} />;
    case "success":
      return <SuccessCard message={message} />;
    case "error":
      return <ErrorCard message={message} />;
    default:
      return (
        <Box
          sx={{
            maxWidth: message.role === "user" ? "88%" : "100%",
            px: message.role === "user" ? 1.25 : 0,
            py: message.role === "user" ? 0.9 : 0,
            borderRadius: message.role === "user" ? "14px 14px 4px 14px" : 0,
            color: message.role === "user" ? "#FFFFFF" : "#334155",
            backgroundColor: message.role === "user" ? "#0F172A" : "transparent",
          }}
        >
          <Typography sx={{ fontSize: "0.78rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
            {message.text}
          </Typography>
        </Box>
      );
  }
};

const ChatMessage = ({
  message,
}: {
  message: SurveyChatMessage;
}): ReactElement => {
  const isUser = message.role === "user";

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
          width: isUser && message.kind === "text" ? "auto" : "100%",
          maxWidth: "100%",
          minWidth: 0,
        }}
      >
        {!isUser && <AssistantAvatar />}
        <Box sx={{ minWidth: 0, flex: isUser && message.kind === "text" ? "initial" : 1 }}>
          {!isUser && message.kind !== "welcome" && (
            <Typography sx={{ mb: 0.45, color: "#64748B", fontSize: "0.65rem", fontWeight: 650 }}>
              Survey assistant
            </Typography>
          )}
          {message.text &&
            !["text", "success", "error", "welcome"].includes(message.kind) && (
              <Typography sx={{ mb: 0.75, color: "#334155", fontSize: "0.76rem", lineHeight: 1.5 }}>
                {message.text}
              </Typography>
            )}
          {renderContent(message)}
        </Box>
      </Box>
    </MessagePrimitive.Root>
  );
};

export default ChatMessage;
