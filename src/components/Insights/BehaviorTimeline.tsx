import { Box, Typography } from "@mui/material";
import {
  Play,
  Hand,
  Pause,
  EyeOff,
  Eye,
  RotateCcw,
  CheckCircle,
  Clock,
} from "lucide-react";

import { BehaviorEvent } from "../../utils/insightTypes";

interface BehaviorTimelineProps {
  events: BehaviorEvent[];
  className?: string;
}

const eventConfig = {
  question_start: {
    icon: Play,
    label: "Question Started",
    sx: { bgcolor: "primary.main", color: "primary.contrastText" },
    lineSx: { bgcolor: "primary.light" },
  },
  first_interaction: {
    icon: Hand,
    label: "First Interaction",
    sx: { bgcolor: "info.main", color: "primary.contrastText" },
    lineSx: { bgcolor: "info.light" },
  },
  pause: {
    icon: Pause,
    label: "Hesitation",
    sx: { bgcolor: "warning.main", color: "primary.contrastText" },
    lineSx: { bgcolor: "warning.light" },
  },
  blur: {
    icon: EyeOff,
    label: "Lost Focus",
    sx: { bgcolor: "warning.main", color: "warning.contrastText" },
    lineSx: { bgcolor: "warning.light" },
  },
  focus: {
    icon: Eye,
    label: "Regained Focus",
    sx: { bgcolor: "success.main", color: "success.contrastText" },
    lineSx: { bgcolor: "success.light" },
  },
  backtrack: {
    icon: RotateCcw,
    label: "Backtracked",
    sx: { bgcolor: "secondary.main", color: "secondary.contrastText" },
    lineSx: { bgcolor: "secondary.light" },
  },
  answer: {
    icon: CheckCircle,
    label: "Answered",
    sx: { bgcolor: "success.main", color: "success.contrastText" },
    lineSx: { bgcolor: "success.light" },
  },
  idle: {
    icon: Clock,
    label: "Went Idle",
    sx: { bgcolor: "text.secondary", color: "background.paper" },
    lineSx: { bgcolor: "action.hover" },
  },
} as const;

// Helpers (unchanged)
function formatTimestamp(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatDuration(ms: number): string {
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
}

export function BehaviorTimeline({ events, className }: BehaviorTimelineProps) {
  return (
    // Root wrapper (replaces space-y-0)
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {events.map((event, index) => {
        const config = eventConfig[event.type];
        const Icon = config.icon;
        const isLast = index === events.length - 1;

        return (
          <Box
            key={`${event.type}-${event.timestamp}-${index}`}
            sx={{
              position: "relative",
              display: "flex",
              gap: 2,
              animation: "fadeIn 0.2s ease-in",
            }}
            // preserve stagger
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Timeline vertical line */}
            {!isLast && (
              <Box
                sx={{
                  position: "absolute",
                  left: 15,
                  top: 32,
                  width: 2,
                  height: "calc(100% - 8px)",
                  bgcolor: "divider",
                }}
              />
            )}

            {/* Icon circle */}
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                ...config.sx,
              }}
            >
              <Icon size={16} />
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, pb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {config.label}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontFamily: "monospace",
                  }}
                >
                  {formatTimestamp(event.timestamp)}
                </Typography>
              </Box>

              {event.details && (
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.5 }}
                >
                  {event.details}
                </Typography>
              )}

              {event.duration && (
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    mt: 1,
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: 12,
                    fontWeight: 500,
                    bgcolor: "action.hover",
                    color: "text.secondary",
                  }}
                >
                  Duration: {formatDuration(event.duration)}
                </Box>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
