import type { ReactElement } from "react";

import {
  CircularProgress,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { Sparkles } from "lucide-react";

import { useSurveyBuilderAssistant } from "../SurveyBuilderAssistantContext";

const Box = styled("div")({});

const AssistantEmptyState = (): ReactElement => {
  const { isInitializing } = useSurveyBuilderAssistant();

  if (isInitializing) {
    return (
      <Stack alignItems="center" spacing={1.25} sx={{ py: 5 }}>
        <CircularProgress size={22} thickness={4} />
        <Typography sx={{ color: "#64748B", fontSize: "0.75rem" }}>
          Preparing the survey assistant…
        </Typography>
      </Stack>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        p: 2,
        borderColor: "#E2E8F0",
        borderRadius: 2.5,
        backgroundColor: "#FFFFFF",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
        boxSizing: "border-box",
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 34,
            height: 34,
            flexShrink: 0,
            borderRadius: 2,
            color: "#4F46E5",
            backgroundColor: "#EEF2FF",
          }}
        >
          <Sparkles size={18} aria-hidden="true" />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{ color: "#0F172A", fontSize: "0.875rem", fontWeight: 700 }}
          >
            Build with the survey assistant
          </Typography>
          <Typography
            sx={{
              mt: 0.4,
              color: "#64748B",
              fontSize: "0.75rem",
              lineHeight: 1.55,
            }}
          >
            Paste existing questions and options, or describe the questions you
            want prepared. You can review the draft before anything is added to
            the survey.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default AssistantEmptyState;
