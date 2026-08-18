import { ReactElement } from "react";

import { ThreadPrimitive } from "@assistant-ui/react";
import { ButtonBase, Chip, styled, Tooltip, Typography } from "@mui/material";
import { RotateCcw, Sparkles } from "lucide-react";

import { useAppTheme } from "../../../theme/useAppTheme";

import { useSurveyBuilderChat } from "./SurveyBuilderChatContext";
import { SurveyBuilderChatProvider } from "./SurveyBuilderChatProvider";
import ChatComposer from "./ui/ChatComposer";
import ChatMessage from "./ui/ChatMessage";

const Box = styled("div")({});

const SurveyBuilderChatThread = (): ReactElement => {
  const { messages, resetConversation } = useSurveyBuilderChat();
  const { scrollStyles } = useAppTheme();

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.85, minWidth: 0 }}>
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
            <Typography noWrap sx={{ color: "#0F172A", fontSize: "0.8rem", fontWeight: 750 }}>
              Survey assistant
            </Typography>
            <Typography noWrap sx={{ color: "#64748B", fontSize: "0.65rem" }}>
              Document-to-survey prototype
            </Typography>
          </Box>
          <Chip
            size="small"
            label="Demo"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              height: 20,
              color: "#4338CA",
              backgroundColor: "#EEF2FF",
              fontSize: "0.6rem",
              fontWeight: 700,
            }}
          />
        </Box>
        <Tooltip title="Reset demo" arrow>
          <ButtonBase
            aria-label="Reset chat demo"
            onClick={resetConversation}
            sx={{
              width: 30,
              height: 30,
              flexShrink: 0,
              borderRadius: 1.75,
              color: "#64748B",
              "&:hover": { color: "#0F172A", backgroundColor: "#F1F5F9" },
            }}
          >
            <RotateCcw size={15} aria-hidden="true" />
          </ButtonBase>
        </Tooltip>
      </Box>

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
          <ThreadPrimitive.Messages>
            {({ message }) => {
              const chatMessage = messages.find((item) => item.id === message.id);
              return chatMessage ? <ChatMessage message={chatMessage} /> : null;
            }}
          </ThreadPrimitive.Messages>
        </Box>
      </ThreadPrimitive.Viewport>

      <ChatComposer />
    </ThreadPrimitive.Root>
  );
};

const SurveyBuilderChat = (): ReactElement => (
  <SurveyBuilderChatProvider>
    <SurveyBuilderChatThread />
  </SurveyBuilderChatProvider>
);

export default SurveyBuilderChat;
