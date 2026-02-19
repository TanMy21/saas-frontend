import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Chip,
  Button,
  IconButton,
} from "@mui/material";
import {
  Smartphone,
  Monitor,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { BehaviorTableProps } from "../../types/behaviorTypes";
import { surveyStatusConfig } from "../../utils/constants";
import { formatDateTime } from "../../utils/utils";

export function BehaviorParticipantsTable({
  rows,
  meta,
  onPageChange,
  onViewBehavior,
}: BehaviorTableProps) {
  const { page, totalPages, totalRows, pageSize } = meta;

  const startItem = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalRows);

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: 1,
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#F3F4F6" }}>
            <TableCell sx={{ px: 3, fontWeight: 700 }}>#</TableCell>
            <TableCell sx={{ px: 3, fontWeight: 700 }}>Status</TableCell>
            <TableCell sx={{ px: 3, fontWeight: 700 }}>Device</TableCell>
            <TableCell sx={{ px: 3, fontWeight: 700 }} align="center">
              Progress
            </TableCell>
            <TableCell sx={{ px: 3, fontWeight: 700 }}>Started</TableCell>
            <TableCell sx={{ px: 3 }} />
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((participant, index) => {
            const status = surveyStatusConfig[participant.sessionState];
            const StatusIcon = status.icon;

            const DeviceIcon =
              participant.deviceType === "mobile" ? Smartphone : Monitor;

            const participantNumber = (page - 1) * pageSize + index + 1;

            return (
              <TableRow
                key={participant.participantID}
                sx={{
                  bgcolor: index % 2 === 0 ? "background.paper" : "#F8FAFC",
                  transition: "background-color 150ms",
                  "&:hover": {
                    bgcolor: "action.selected",
                    cursor: "pointer",
                  },
                }}
                onClick={() =>
                  onViewBehavior({
                    ...participant,
                    serialNumber: participantNumber,
                  })
                }
              >
                {/* Participant Number */}
                <TableCell sx={{ px: 3, fontWeight: 600 }}>
                  {participantNumber}
                </TableCell>

                {/* Status */}
                <TableCell sx={{ px: 3 }}>
                  <Chip
                    variant="outlined"
                    icon={<StatusIcon size={16} />}
                    label={status.label}
                    size="small"
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      ...status.sx,
                    }}
                  />
                </TableCell>

                {/* Device */}
                <TableCell sx={{ px: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "text.secondary",
                    }}
                  >
                    <DeviceIcon size={20} />
                    <Typography
                      variant="body2"
                      sx={{ textTransform: "capitalize", fontSize: 16 }}
                    >
                      {participant.deviceType}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Progress */}
                <TableCell align="center" sx={{ px: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        height: 6,
                        width: 64,
                        bgcolor: "action.hover",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          borderRadius: 999,
                          transition: "width 0.2s ease",
                          bgcolor:
                            participant.sessionState === "COMPLETED"
                              ? "success.main"
                              : "warning.main",
                          width: `${participant.progress.percent}%`,
                        }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {participant.progress.answered}/
                      {participant.progress.total}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Started */}
                <TableCell sx={{ px: 3 }}>
                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                    color="text.secondary"
                    fontWeight={600}
                    fontSize={16}
                  >
                    {formatDateTime(participant.startedAt)}
                  </Typography>
                </TableCell>

                {/* Action */}
                <TableCell sx={{ px: 3 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewBehavior({
                        ...participant,
                        serialNumber: participantNumber,
                      });
                    }}
                    startIcon={<Eye size={14} />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "#F3F4F6",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing <b>{startItem}</b> to <b>{endItem}</b> of <b>{totalRows}</b>{" "}
          participants
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={18} />
          </IconButton>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              size="small"
              onClick={() => onPageChange(p)}
              variant={p === page ? "contained" : "text"}
              sx={{
                minWidth: 0,
                width: 32,
                height: 32,
                borderRadius: "50%",
                padding: 0,
                fontWeight: 600,
              }}
            >
              {p}
            </Button>
          ))}

          <IconButton
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight size={18} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
