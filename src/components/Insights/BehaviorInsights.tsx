import { useState } from "react";

import { Box, Tabs, Tab, Typography } from "@mui/material";
import { LayoutGrid, Users } from "lucide-react";

import { MockQuestionBeh, Participant } from "../../utils/insightTypes";
import {
  mockBehavioralSignals,
  mockParticipants,
  mockQuestionsBeh,
  mockSegmentComparisons,
  mockSurvey,
} from "../../utils/MockData";

import { BehaviorDropOffTable } from "./BehaviorDropOffTable";
import { BehaviorHeader } from "./BehaviorHeader";
import { BehaviorParticipantDetailDrawer } from "./BehaviorParticipantDetailDrawer";
import { BehaviorParticipantsTable } from "./BehaviorParticipantsTable";
import { BehaviorQuestionDetailDrawer } from "./BehaviorQuestionDetailDrawer";

/**
 * Main analytics index page
 * Converted ONLY UI layer from shadcn to MUI sx
 */
export const BehaviorInsights = () => {
  // Selected entities (unchanged)
  const [selectedQuestion, setSelectedQuestion] =
    useState<MockQuestionBeh | null>(null);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);

  // Active tab state (replaces shadcn Tabs internal state)
  const [tab, setTab] = useState<"questions" | "participants">("questions");

  // Handlers (unchanged)
  const handleQuestionClick = (question: MockQuestionBeh) => {
    setSelectedQuestion(question);
  };

  const handleParticipantClick = (participant: Participant) => {
    setSelectedParticipant(participant);
  };

  return (
    // Root container (replaces Tailwind min-h-screen + bg)
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <BehaviorHeader
        name={mockSurvey.name}
        totalResponses={mockSurvey.totalResponses}
        completionRate={mockSurvey.completionRate}
        avgCompletionTime={mockSurvey.avgCompletionTime}
      />

      {/* Main content wrapper (replaces max-w-6xl + padding) */}
      <Box
        component="main"
        sx={{
          maxWidth: "72rem",
          mx: "auto",
          px: 3,
          py: 4,
        }}
      >
        {/* Tabs root */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Tabs header */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              bgcolor: "action.hover", // replaces bg-muted/50
              p: 0.5,
              borderRadius: 1,
              minHeight: "auto",
              "& .MuiTabs-indicator": {
                display: "none", // removes underline to match shadcn style
              },
            }}
          >
            {/* Questions tab */}
            <Tab
              value="questions"
              icon={<LayoutGrid size={16} />}
              iconPosition="start"
              label="Questions"
              sx={{
                textTransform: "none",
                gap: 1,
                borderRadius: 1,
                minHeight: "auto",
                px: 2,
                py: 1,
                "&.Mui-selected": {
                  bgcolor: "background.paper",
                  boxShadow: 1, // replaces shadow-sm
                },
              }}
            />

            {/* Participants tab */}
            <Tab
              value="participants"
              icon={<Users size={16} />}
              iconPosition="start"
              label="Participants"
              sx={{
                textTransform: "none",
                gap: 1,
                borderRadius: 1,
                minHeight: "auto",
                px: 2,
                py: 1,
                "&.Mui-selected": {
                  bgcolor: "background.paper",
                  boxShadow: 1,
                },
              }}
            />
          </Tabs>

          {/* QUESTIONS TAB CONTENT */}
          {tab === "questions" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                animation: "fadeIn 0.2s ease-in", // replaces animate-fade-in
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Question Drop-off Analysis
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.5 }}
                >
                  Click on any question to view detailed behavioral signals
                </Typography>
              </Box>

              <BehaviorDropOffTable
                questions={mockQuestionsBeh}
                onQuestionClick={handleQuestionClick}
              />
            </Box>
          )}

          {/* PARTICIPANTS TAB CONTENT */}
          {tab === "participants" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                animation: "fadeIn 0.2s ease-in",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Individual Participants
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.5 }}
                >
                  View detailed behavior patterns for individual respondents
                </Typography>
              </Box>

              <BehaviorParticipantsTable
                participants={mockParticipants}
                onViewBehavior={handleParticipantClick}
              />
            </Box>
          )}
        </Box>
      </Box>

      <BehaviorQuestionDetailDrawer
        question={selectedQuestion}
        signals={
          selectedQuestion ? mockBehavioralSignals[selectedQuestion.id] : null
        }
        comparisons={
          selectedQuestion
            ? mockSegmentComparisons[selectedQuestion.id]
            : undefined
        }
        open={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
      />

      {/* Participant Detail Drawer (unchanged) */}
      <BehaviorParticipantDetailDrawer
        participant={selectedParticipant}
        open={!!selectedParticipant}
        onClose={() => setSelectedParticipant(null)}
      />
    </Box>
  );
};
