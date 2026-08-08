import { Box, Typography } from "@mui/material";

import { SummaryQuestion } from "../../types/insightTypes";
import { getSummaryQuestionTitle } from "../../utils/utils";

import { QuestionTypeBadge } from "./QuestionTypeBadge";

export const SummaryQuestionHeader = ({
  question,
  displayOrder,
}: {
  question: SummaryQuestion;
  displayOrder: number;
}) => {
  return (
    <Box component="div" mb={3}>
      <Box component="div"
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
        gap={2}
      >
        <Box component="div"
          display="flex"
          alignItems="flex-start"
          gap={2}
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box component="div"
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
            {displayOrder}
          </Box>

          <Typography
            fontSize={18}
            fontWeight={500}
            sx={{
              minWidth: 0,
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {getSummaryQuestionTitle(question)}
          </Typography>
        </Box>

        <Box component="div"
          sx={{
            flexShrink: 0,
            alignSelf: "flex-start",
          }}
        >
          <QuestionTypeBadge type={question.type} />
        </Box>
      </Box>

      {/* Metadata */}
      <Box component="div" mt={1} ml="40px" display="flex" flexWrap="wrap" gap={2}>
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
