import { Box, Typography } from "@mui/material";

import { summaryVisualizationMap } from "../../utils/elementsConfig";
import { QuestionSectionProps } from "../../utils/insightTypes";

import { SummaryQuestionHeader } from "./SummaryQuestionHeader";

export function QuestionSection({ question }: QuestionSectionProps) {
  const Visualization = summaryVisualizationMap[question.type];

  return (
    <Box
      component="section"
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        p: 3,
        boxShadow: 1,
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      {/* Header */}
      <SummaryQuestionHeader question={question} />

      {/* Visualization */}
      <Box pl={{ xs: 0, lg: "40px" }}>
        {Visualization ? (
          <Visualization question={question} />
        ) : (
          <Typography color="text.secondary" fontSize={14}>
            Unsupported question type: {question.type}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
