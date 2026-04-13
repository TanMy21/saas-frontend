import { Box, Typography } from "@mui/material";

import {
  questionTypeMap,
  summaryVisualizationMap,
} from "../../utils/elementsConfig";
import { QuestionSectionProps } from "../../utils/insightTypes";

import { SummaryQuestionHeader } from "./SummaryQuestionHeader";

export function QuestionSection({ question }: QuestionSectionProps) {
  const Visualization = summaryVisualizationMap[question.type];
  const config = questionTypeMap[question.type];

  return (
    <Box
      component="section"
      sx={{
        borderRadius: 2,
        borderTop: `4px solid black99`,
        minHeight: 200,
        bgcolor: "background.paper",
        p: 3,
        boxShadow: 1,
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: 3,
          borderTop: `6px solid ${config.color}99`,
        },
      }}
    >
      {/* Header */}
      <SummaryQuestionHeader question={question} />

      {/* Visualization */}
      <Box
        sx={{
          pl: { xs: 0, lg: "40px" },
        }}
      >
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
