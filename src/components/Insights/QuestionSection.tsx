import { lazy, Suspense } from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import { QuestionSectionProps } from "../../types/insightTypes";
import { questionTypeMap } from "../../utils/elementsConfig";
import { summaryVisualizationMap } from "../../utils/summaryVisualizationRegistry";

import { SummaryQuestionHeader } from "./SummaryQuestionHeader";

const ThreeDOptionChart = lazy(() =>
  import("./visualizations/ThreeDOptionChart").then((module) => ({
    default: module.ThreeDOptionChart,
  })),
);

export function QuestionSection({
  question,
  surveyID,
  displayOrder,
}: QuestionSectionProps) {
  const config = questionTypeMap[question.type];

  const isThreeD = question.type === "THREE_D";
  const Visualization = isThreeD
    ? null
    : summaryVisualizationMap[question.type];

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
      <SummaryQuestionHeader question={question} displayOrder={displayOrder} />

      {/* Visualization */}
      <Box component="div"
        sx={{
          pl: { xs: 0, lg: "40px" },
        }}
      >
        <Suspense
          fallback={
            <Box component="div"
              sx={{
                minHeight: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={28} />
            </Box>
          }
        >
          {isThreeD ? (
            <ThreeDOptionChart question={question} surveyID={surveyID} />
          ) : Visualization ? (
            <Visualization question={question} />
          ) : (
            <Typography color="text.secondary" fontSize={14}>
              Unsupported question type: {question.type}
            </Typography>
          )}
        </Suspense>
      </Box>
    </Box>
  );
}
