import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
  Typography,
} from "@mui/material";
import {
  Monitor,
  Smartphone,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

import { Participant } from "../../utils/insightTypes";
import { formatDateTime } from "../../utils/utils";

interface ParticipantsTableProps {
  participants: Participant[];
  onViewBehavior: (participant: Participant) => void;
  className?: string;
}

/**
 * ParticipantsTable
 * UI-only conversion from Tailwind + shadcn to MUI sx
 */
export function BehaviorParticipantsTable({
  participants,
  onViewBehavior,
  className,
}: ParticipantsTableProps) {
  /**
   * Status → visual config
   * Converted Tailwind class mapping to MUI sx mapping
   */
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      label: "Completed",
      sx: {
        color: "success.main",
        bgcolor: "success.light",
        borderColor: "success.main",
      },
    },
    dropped: {
      icon: XCircle,
      label: "Dropped",
      sx: {
        color: "error.main",
        bgcolor: "error.light",
        borderColor: "error.main",
      },
    },
    in_progress: {
      icon: Clock,
      label: "In Progress",
      sx: {
        color: "warning.main",
        bgcolor: "warning.light",
        borderColor: "warning.main",
      },
    },
  } as const;

  return (
    // Root container (rounded + border + bg + shadow)
    <Box
      className={className}
      sx={{
        borderRadius: 1, // rounded-lg
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper", // bg-card
        boxShadow: 1, // shadow-card
        overflow: "hidden",
      }}
    >
      <Table>
        {/* TABLE HEADER */}
        <TableHead>
          <TableRow
            sx={{
              bgcolor: "action.hover", // bg-muted/50
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <TableCell sx={{ fontWeight: 600 }}>Participant</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Device</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>
              Progress
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Started</TableCell>
            <TableCell sx={{ width: 112 }} />
          </TableRow>
        </TableHead>

        {/* TABLE BODY */}
        <TableBody>
          {participants.map((participant, index) => {
            const status = statusConfig[participant.status];
            const StatusIcon = status.icon;
            const DeviceIcon =
              participant.device === "mobile" ? Smartphone : Monitor;

            return (
              <TableRow
                key={participant.id}
                sx={{
                  animation: "fadeIn 0.2s ease-in",
                }}
                // preserve staggered animation delay
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Participant ID */}
                <TableCell
                  sx={{
                    fontWeight: 500,
                    fontFamily: "monospace", // font-mono
                  }}
                >
                  {participant.id.toUpperCase()}
                </TableCell>

                {/* Status */}
                <TableCell>
                  {/* Replaces shadcn outline Badge */}
                  <Chip
                    variant="outlined"
                    icon={<StatusIcon size={12} />}
                    label={status.label}
                    size="small"
                    sx={{
                      gap: 0.5,
                      fontSize: 12,
                      ...status.sx,
                    }}
                  />
                </TableCell>

                {/* Device */}
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "text.secondary",
                    }}
                  >
                    <DeviceIcon size={16} />
                    <Typography variant="body2">
                      {participant.device === "mobile" ? "Mobile" : "Desktop"}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Progress */}
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    {/* Progress bar container */}
                    <Box
                      sx={{
                        height: 6, // h-1.5
                        width: 64, // w-16
                        bgcolor: "action.hover", // bg-muted
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      {/* Progress bar fill */}
                      <Box
                        sx={{
                          height: "100%",
                          borderRadius: 999,
                          transition: "width 0.2s ease",
                          bgcolor:
                            participant.status === "completed"
                              ? "success.main"
                              : "warning.main",
                          width: `${
                            (participant.questionsAnswered /
                              participant.totalQuestions) *
                            100
                          }%`,
                        }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {participant.questionsAnswered}/
                      {participant.totalQuestions}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Started at */}
                <TableCell
                  sx={{
                    color: "text.secondary",
                    fontSize: 14,
                  }}
                >
                  {formatDateTime(participant.startedAt)}
                </TableCell>

                {/* Action */}
                <TableCell>
                  {/* Replaces shadcn ghost Button */}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => onViewBehavior(participant)}
                    sx={{
                      gap: 1,
                      color: "primary.main",
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "primary.light", // hover:bg-primary-muted
                      },
                    }}
                    startIcon={<Eye size={14} />}
                  >
                    View behavior
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}
