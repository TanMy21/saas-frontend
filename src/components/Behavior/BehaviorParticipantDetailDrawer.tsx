import { Drawer, Box, Typography, Chip, Divider } from "@mui/material";
import { Monitor, Smartphone } from "lucide-react";

import { ParticipantDetailDrawerProps } from "../../types/behaviorTypes";
import { surveyStatusConfig } from "../../utils/constants";
import { formatDateTime } from "../../utils/utils";
import PariticpantBehaviorLoader from "../LoadingSkeletons/PariticpantBehaviorLoader";

import { Metric } from "./BehaviorMetric";
import { BehaviorSignalMetricCard } from "./BehaviorSignalMetricCard";
import { BehaviorTimeline } from "./BehaviorTimeline";
import { PrivacyNote } from "./PrivacyNote";

export function BehaviorParticipantDetailDrawer({
  participant,
  detail,
  loading,
  open,
  onClose,
}: ParticipantDetailDrawerProps) {
  if (!participant) return null;

  console.log("Participant Detail:", detail); // Debug log for detail data

  const summary = detail?.summary;
  const meta = detail?.meta;

  const sessionState = detail?.summary?.sessionState;
  const status = sessionState ? surveyStatusConfig[sessionState] : undefined;

  const DeviceIcon = summary?.deviceType === "mobile" ? Smartphone : Monitor;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 520,
          overflowY: "auto",
        },
      }}
    >
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Participant {participant.serialNumber}
        </Typography>

        {summary && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {formatDateTime(summary.sessionStartedAt)}
          </Typography>
        )}
      </Box>

      {loading && <PariticpantBehaviorLoader />}

      {!loading && summary && meta && (
        <Box
          sx={{
            px: 3,
            pb: 4,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Status & Device */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {status && (
              <Chip
                variant="outlined"
                icon={<status.icon size={14} />}
                label={status.label}
                size="small"
                sx={{
                  fontWeight: 600,
                  ...status.sx,
                }}
              />
            )}

            <Chip
              size="small"
              icon={<DeviceIcon size={14} />}
              label={summary.deviceType}
              sx={{ bgcolor: "#F3F4F6" }}
            />
          </Box>

          {/* Progress */}
          <Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
              }}
            >
              <BehaviorSignalMetricCard
                label="Questions Answered"
                value={`${detail.summary.progress.answered}/${detail.summary.progress.total}`}
                tooltip="Number of questions answered out of total questions in the survey."
              />

              <BehaviorSignalMetricCard
                label="Completion"
                value={`${detail.summary.progress.percent}%`}
                tooltip="Completion percentage based on answered questions."
              />
            </Box>
          </Box>

          <PrivacyNote />

          <Divider />

          {/* Aggregates */}
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
              <Metric
                label="Hesitations"
                value={meta.totalHesitationCount}
                sx={{
                  bgcolor: "#FEF3C7",
                  color: "#92400E",
                }}
              />

              <Metric
                label="Focus Losses"
                value={meta.totalFocusLosses}
                sx={{
                  bgcolor: "#FFE4E6",
                  color: "#9F1239",
                }}
              />

              <Metric
                label="Backtracks"
                value={meta.totalBacktracks}
                sx={{
                  bgcolor: "#EDE9FE",
                  color: "#4C1D95",
                }}
              />
            </Box>
          </Box>

          <Divider />

          {/* Timeline */}
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

            {detail && <BehaviorTimeline timeline={detail.timeline} />}
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
