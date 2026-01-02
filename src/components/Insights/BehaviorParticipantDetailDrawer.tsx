import { useState } from "react";

import { Drawer, Box, Typography, Chip, Divider, Button } from "@mui/material";
import {
  User,
  Monitor,
  Smartphone,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  AlertTriangle,
  Shield,
} from "lucide-react";

import { Participant } from "../../utils/insightTypes";

import { BehaviorSignalMetricCard } from "./BehaviorSignalMetricCard";
import { BehaviorTimeline } from "./BehaviorTimeline";

interface ParticipantDetailDrawerProps {
  participant: Participant | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Native date formatter
 * Replaces date-fns format(date, 'MMM d, yyyy • h:mm a')
 */
function formatDateTimeFull(date: Date) {
  const d = date instanceof Date ? date : new Date(date);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(d)
    .replace(",", " •");
}

export function BehaviorParticipantDetailDrawer({
  participant,
  open,
  onClose,
}: ParticipantDetailDrawerProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!participant) return null;

  const DeviceIcon = participant.device === "mobile" ? Smartphone : Monitor;

  const StatusIcon = participant.status === "completed" ? CheckCircle : XCircle;

  // Status → MUI color mapping
  const statusSx = {
    completed: {
      bgcolor: "success.light",
      color: "success.main",
      borderColor: "success.main",
    },
    dropped: {
      bgcolor: "error.light",
      color: "error.main",
      borderColor: "error.main",
    },
    in_progress: {
      bgcolor: "warning.light",
      color: "warning.main",
      borderColor: "warning.main",
    },
  }[participant.status];

  const responseTimeSx = {
    fast: { bgcolor: "success.light", color: "success.main" },
    average: { bgcolor: "action.hover", color: "text.secondary" },
    slow: { bgcolor: "warning.light", color: "warning.main" },
  }[participant.responseTime];

  // Summary stats (unchanged logic)
  const pauseEvents = participant.behaviorEvents.filter(
    (e) => e.type === "pause"
  );
  const blurEvents = participant.behaviorEvents.filter(
    (e) => e.type === "blur"
  );
  const backtrackEvents = participant.behaviorEvents.filter(
    (e) => e.type === "backtrack"
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 480,
          overflowY: "auto",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              height: 40,
              width: 40,
              borderRadius: "50%",
              bgcolor: "primary.main",
              opacity: 0.1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={20} />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Participant {participant.id.toUpperCase()}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {formatDateTimeFull(participant.startedAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          px: 3,
          pb: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Status & Device */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            variant="outlined"
            icon={<StatusIcon size={12} />}
            label={
              participant.status === "completed"
                ? "Completed"
                : participant.status === "dropped"
                  ? "Dropped"
                  : "In Progress"
            }
            size="small"
            sx={statusSx}
          />

          <Chip
            size="small"
            icon={<DeviceIcon size={12} />}
            label={participant.device === "mobile" ? "Mobile" : "Desktop"}
            sx={{ bgcolor: "action.hover" }}
          />

          <Chip
            size="small"
            icon={<Clock size={12} />}
            label={`${participant.responseTime[0].toUpperCase()}${participant.responseTime.slice(
              1
            )} responder`}
            sx={responseTimeSx}
          />
        </Box>

        {/* Quick stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 1.5,
          }}
        >
          <BehaviorSignalMetricCard
            label="Questions Answered"
            value={`${participant.questionsAnswered}/${participant.totalQuestions}`}
            tooltip="Number of questions answered out of total questions in the survey."
          />

          {participant.droppedAtQuestion && (
            <BehaviorSignalMetricCard
              label="Dropped At"
              value={`Q${participant.droppedAtQuestion}`}
              tooltip="The question where this participant left the survey."
              variant="signal"
            />
          )}
        </Box>

        {/* Privacy notice */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: "action.hover",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Shield size={16} />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            <strong>Privacy note:</strong> This view shows aggregated
            interaction patterns, not a recording. All data is anonymized and
            used only to improve survey design.
          </Typography>
        </Box>

        <Divider />

        {/* Interaction summary */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 0.6,
              mb: 2,
              display: "block",
            }}
          >
            Interaction Summary
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1.5,
            }}
          >
            {[
              {
                label: "Hesitations",
                value: pauseEvents.length,
                color: "success",
              },
              {
                label: "Focus losses",
                value: blurEvents.length,
                color: "warning",
              },
              {
                label: "Backtracks",
                value: backtrackEvents.length,
                color: "secondary",
              },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  textAlign: "center",
                  bgcolor: `${item.color}.light`,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {item.value}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider />

        {/* Behavior timeline */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 0.6,
              mb: 2,
              display: "block",
            }}
          >
            Behavior Timeline
          </Typography>

          <BehaviorTimeline events={participant.behaviorEvents} />
        </Box>

        <Divider />

        {/* Advanced section */}
        <Box>
          <Button
            onClick={() => setShowAdvanced((v) => !v)}
            variant="text"
            fullWidth
            sx={{
              display: "flex",
              justifyContent: "space-between",
              textTransform: "none",
              color: "text.secondary",
            }}
            endIcon={
              <ChevronDown
                size={16}
                style={{
                  transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            }
            startIcon={<AlertTriangle size={16} />}
          >
            Advanced Behavior Analysis
          </Button>

          {showAdvanced && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 1,
                border: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1 }}
              >
                Advanced visualizations like movement paths, dwell points, and
                3D interaction traces are available for enterprise accounts.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Shield size={12} />
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  All advanced analytics maintain user privacy and
                  anonymization.
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
