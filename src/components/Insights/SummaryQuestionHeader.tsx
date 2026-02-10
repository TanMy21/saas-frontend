import { Box, Typography } from "@mui/material";

import { SummaryQuestion } from "../../utils/insightTypes";

import { QuestionTypeBadge } from "./QuestionTypeBadge";

export const SummaryQuestionHeader = ({
  question,
}: {
  question: SummaryQuestion;
}) => {
  return (
    <Box mb={3}>
      <Box
        display="flex"
        flexWrap="wrap"
        alignItems="flex-start"
        justifyContent="space-between"
        gap={2}
      >
        {/* Left */}
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {question.order}
          </Box>

          <Typography fontSize={18} fontWeight={500}>
            {question.text}
          </Typography>
        </Box>

        {/* Right */}
        <QuestionTypeBadge type={question.type} />
      </Box>

      {/* Metadata */}
      <Box mt={1} ml="40px" display="flex" flexWrap="wrap" gap={2}>
        <Typography variant="body2" color="text.secondary">
          {question.meta.totalResponses} responses
        </Typography>

        {question.meta.skipped > 0 && (
          <Typography variant="body2" color="text.secondary">
            {question.meta.skipped.toLocaleString()} skipped
          </Typography>
        )}
      </Box>
    </Box>
  );
};
