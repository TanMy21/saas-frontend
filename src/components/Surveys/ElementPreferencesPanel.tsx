import { useState } from "react";

import { Box, ButtonBase, Typography } from "@mui/material";
import { MessageSquareText, SlidersHorizontal } from "lucide-react";

import { useAppTheme } from "../../theme/useAppTheme";
import { SurveyPreferencesPanelProps } from "../../utils/types";

import ElementSettingsContainer from "./ElementSettings/ElementSettingsContainer";
import SurveyBuilderChat from "./SurveyBuilderChat";

const ElementPreferencesPanel = ({
  questionId,
  question,
}: SurveyPreferencesPanelProps) => {
  const { scrollStyles } = useAppTheme();
  const [activeTab, setActiveTab] = useState<"settings" | "chat">("settings");

  return (
    <Box
      component="div"
      id="question-settings"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        backgroundColor: "white",
        m: 0,
        boxSizing: "border-box",
        p: 0,
      }}
    >
      <Box
        component="div"
        sx={{
          width: "calc(100% - 64px)",
          mx: "auto",
          pt: 2.5,
          pb: 1.5,
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      >
        <Box
          component="div"
          role="tablist"
          aria-label="Question panel"
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 0.5,
            width: "100%",
            p: 0.5,
            borderRadius: 2,
            backgroundColor: "#F1F5F9",
            border: "1px solid #E2E8F0",
          }}
        >
          <ButtonBase
            role="tab"
            id="question-settings-tab"
            aria-controls="question-settings-panel"
            aria-selected={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              minWidth: 0,
              minHeight: 36,
              px: 1,
              borderRadius: 1.5,
              color: activeTab === "settings" ? "#0F172A" : "#64748B",
              backgroundColor:
                activeTab === "settings" ? "#FFFFFF" : "transparent",
              boxShadow:
                activeTab === "settings"
                  ? "0 1px 2px rgba(15, 23, 42, 0.10)"
                  : "none",
              transition:
                "background-color 160ms ease, color 160ms ease, box-shadow 160ms ease",
              "&:hover": {
                color: "#0F172A",
              },
            }}
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
            <Typography
              component="span"
              sx={{ fontSize: "0.875rem", fontWeight: 600, lineHeight: 1 }}
            >
              Settings
            </Typography>
          </ButtonBase>

          <ButtonBase
            role="tab"
            id="question-chat-tab"
            aria-controls="question-chat-panel"
            aria-selected={activeTab === "chat"}
            onClick={() => setActiveTab("chat")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              minWidth: 0,
              minHeight: 36,
              px: 1,
              borderRadius: 1.5,
              color: activeTab === "chat" ? "#0F172A" : "#64748B",
              backgroundColor: activeTab === "chat" ? "#FFFFFF" : "transparent",
              boxShadow:
                activeTab === "chat"
                  ? "0 1px 2px rgba(15, 23, 42, 0.10)"
                  : "none",
              transition:
                "background-color 160ms ease, color 160ms ease, box-shadow 160ms ease",
              "&:hover": {
                color: "#0F172A",
              },
            }}
          >
            <MessageSquareText size={16} aria-hidden="true" />
            <Typography
              component="span"
              sx={{ fontSize: "0.875rem", fontWeight: 600, lineHeight: 1 }}
            >
              Chat
            </Typography>
          </ButtonBase>
        </Box>
      </Box>

      <Box
        component="div"
        role="tabpanel"
        id="question-settings-panel"
        aria-labelledby="question-settings-tab"
        sx={{
          display: activeTab === "settings" ? "block" : "none",
          width: "100%",
          flex: 1,
          minHeight: 0,
          overflowX: "hidden",
          overflowY: "auto",
          ...scrollStyles.elementsPanel,
        }}
      >
        <ElementSettingsContainer questionId={questionId} question={question} />
      </Box>

      <Box
        component="div"
        role="tabpanel"
        id="question-chat-panel"
        aria-labelledby="question-chat-tab"
        sx={{
          display: activeTab === "chat" ? "flex" : "none",
          width: "100%",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <SurveyBuilderChat />
      </Box>
    </Box>
  );
};

export default ElementPreferencesPanel;
