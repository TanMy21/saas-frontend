import { Drawer, Box, Typography, Chip, Divider } from "@mui/material";
import { Users, Clock, TrendingDown } from "lucide-react";

import {
  BehavioralSignals,
  MockQuestionBeh,
  SegmentComparison,
} from "../../utils/insightTypes";

import { BehavioralSignal } from "./BehaviorSignal";
import { BehaviorSignalMetricCard } from "./BehaviorSignalMetricCard";

interface QuestionDetailDrawerProps {
  question: MockQuestionBeh | null;
  signals: BehavioralSignals | null;
  comparisons?: SegmentComparison[];
  open: boolean;
  onClose: () => void;
}

const questionTypeLabels: Record<string, string> = {
  multiple_choice: "Multiple Choice",
  text: "Open Text",
  rating: "Rating",
  scale: "Scale",
};

export function BehaviorQuestionDetailDrawer({
  question,
  signals,
  comparisons,
  open,
  onClose,
}: QuestionDetailDrawerProps) {
  // Guard clause preserved
  if (!question || !signals) return null;

  return (
    // ✅ Replaces <Sheet />
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 480, // sm:max-w-lg
          overflowY: "auto",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
        }}
      >
        {/* Top row: question number + type */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          {/* Question number pill */}
          <Box
            sx={{
              height: 28, // h-7
              width: 28, // w-7
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              opacity: 0.1, // bg-primary/10
              color: "primary.main",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {question.number}
          </Box>

          {/* Replaces shadcn Badge */}
          <Chip
            size="small"
            label={questionTypeLabels[question.type]}
            sx={{
              fontSize: 12,
              bgcolor: "action.hover", // secondary badge feel
            }}
          />
        </Box>

        {/* Question title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            textAlign: "left",
            mt: 1,
          }}
        >
          {question.text}
        </Typography>
      </Box>

      {/* Body */}
      <Box
        sx={{
          px: 3,
          pb: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Engagement Metrics */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mb: 2,
              display: "block",
            }}
          >
            Engagement
          </Typography>

          {/* Metrics grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1.5,
            }}
          >
            <BehaviorSignalMetricCard
              label="Response Rate"
              value={question.responseRate}
              unit="%"
              icon={<Users size={16} />}
              tooltip="Percentage of participants who answered this question."
            />

            <BehaviorSignalMetricCard
              label="Drop-off Rate"
              value={question.dropOffRate}
              unit="%"
              icon={<TrendingDown size={16} />}
              tooltip="Percentage of participants who left the survey at this question."
            />

            <BehaviorSignalMetricCard
              label="Avg. Time"
              value={question.avgTimeSpent}
              unit="s"
              icon={<Clock size={16} />}
              tooltip="Average time participants spent on this question."
              className="col-span-2" // preserved behavior for MetricCard
            />
          </Box>
        </Box>

        {/* Replaces shadcn Separator */}
        <Divider />

        {/* Behavioral Signals */}
        <BehavioralSignal signals={signals} comparisons={comparisons} />
      </Box>
    </Drawer>
  );
}
