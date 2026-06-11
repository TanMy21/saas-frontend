import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Box, CircularProgress, Typography } from "@mui/material";

import { SettingSaveState } from "../../../../types/surveyBuilderTypes";

const SettingSaveStatus = ({
  state,
  message,
}: {
  state: SettingSaveState;
  message?: string;
}) => {
  const config = {
    idle: {
      label: message || "No changes",
      color: "#64748B",
      icon: <PendingOutlinedIcon sx={{ fontSize: 15 }} />,
    },
    dirty: {
      label: message || "Unsaved changes",
      color: "#B45309",
      icon: <SaveOutlinedIcon sx={{ fontSize: 15 }} />,
    },
    saving: {
      label: message || "Saving...",
      color: "#2563EB",
      icon: <CircularProgress size={13} thickness={5} />,
    },
    saved: {
      label: message || "Saved",
      color: "#16A34A",
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 15 }} />,
    },
    error: {
      label: message || "Could not save",
      color: "#DC2626",
      icon: <ErrorOutlineIcon sx={{ fontSize: 15 }} />,
    },
  }[state];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 0.75,
        minHeight: 20,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", color: config.color }}>
        {config.icon}
      </Box>

      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: config.color,
        }}
      >
        {config.label}
      </Typography>
    </Box>
  );
};

export default SettingSaveStatus;
