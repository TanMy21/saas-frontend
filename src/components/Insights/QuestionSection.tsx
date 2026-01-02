import { useState } from "react";

import { Box, Typography, IconButton } from "@mui/material";
import { Hash, Percent } from "lucide-react";

import { QuestionResult } from "../../utils/MockData";

import { QuestionTypeBadge } from "./QuestionTypeBadge";
import { BinaryChart } from "./visualizations/BinaryChart";
import { MediaOptionsViz } from "./visualizations/MediaOptionsViz";
import { MultipleChoiceChart } from "./visualizations/MultipleChoiceChart";
import { NumericChart } from "./visualizations/NumericChart";
import { RankingChart } from "./visualizations/RankingChart";
import { ScaleChart } from "./visualizations/ScaleChart";
import { SingleChoiceChart } from "./visualizations/SingleChart";
import { TextResponses } from "./visualizations/TextResponses";
import { ThreeDOptionChart } from "./visualizations/ThreeDOptionChart";

interface QuestionSectionProps {
  question: QuestionResult;
  displayMode: "count" | "percentage";
  searchQuery: string;
}

// Question types that support the #/% toggle
const TOGGLE_SUPPORTED_TYPES = [
  "binary",
  "single-choice",
  "multiple-choice",
  "rating",
  "numeric",
  "media",
  "3d-option",
];

export function QuestionSection({
  question,
  displayMode: globalDisplayMode,
  searchQuery,
}: QuestionSectionProps) {
  const [localDisplayMode, setLocalDisplayMode] = useState<
    "count" | "percentage" | null
  >(null);

  // Use local override if set, otherwise use global
  const effectiveDisplayMode = localDisplayMode ?? globalDisplayMode;

  const supportsToggle = TOGGLE_SUPPORTED_TYPES.includes(question.type);

  const renderVisualization = () => {
    switch (question.type) {
      case "binary":
        return (
          <BinaryChart
            yes={question.data.yes}
            no={question.data.no}
            displayMode={effectiveDisplayMode}
          />
        );

      case "single-choice":
        return (
          <SingleChoiceChart
            options={question.data.options}
            displayMode={effectiveDisplayMode}
          />
        );

      case "multiple-choice":
        return (
          <MultipleChoiceChart
            options={question.data.options}
            totalResponses={question.totalResponses}
            displayMode={effectiveDisplayMode}
          />
        );

      case "rating":
        return (
          <ScaleChart
            distribution={question.data.distribution}
            mean={question.data.mean}
            median={question.data.median}
            stdDev={question.data.stdDev}
            scale={question.data.scale}
            displayMode={effectiveDisplayMode}
          />
        );

      case "ranking":
        return <RankingChart options={question.data.options} />;

      case "numeric":
        return (
          <NumericChart
            mean={question.data.mean}
            median={question.data.median}
            min={question.data.min}
            max={question.data.max}
            stdDev={question.data.stdDev}
            distribution={question.data.distribution}
            displayMode={effectiveDisplayMode}
          />
        );

      case "text":
        return (
          <TextResponses
            responses={question.data.responses}
            searchQuery={searchQuery}
          />
        );

      case "media":
        return (
          <MediaOptionsViz
            options={question.data.options}
            displayMode={effectiveDisplayMode}
          />
        );

      case "3d-option":
        return (
          <ThreeDOptionChart
            like={question.data.like}
            dislike={question.data.dislike}
            displayMode={effectiveDisplayMode}
          />
        );

      default:
        return null;
    }
  };

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
      {/* Question header */}
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
              {question.number}
            </Box>

            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 500,
                color: "text.primary",
              }}
            >
              {question.text}
            </Typography>
          </Box>

          {/* Right */}
          <Box display="flex" alignItems="center" gap={2}>
            {supportsToggle && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: "2px",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "action.hover",
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setLocalDisplayMode("count")}
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    color:
                      effectiveDisplayMode === "count"
                        ? "text.primary"
                        : "text.secondary",
                    bgcolor:
                      effectiveDisplayMode === "count"
                        ? "background.paper"
                        : "transparent",
                    boxShadow: effectiveDisplayMode === "count" ? 1 : "none",
                  }}
                >
                  <Hash size={12} />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => setLocalDisplayMode("percentage")}
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    color:
                      effectiveDisplayMode === "percentage"
                        ? "text.primary"
                        : "text.secondary",
                    bgcolor:
                      effectiveDisplayMode === "percentage"
                        ? "background.paper"
                        : "transparent",
                    boxShadow:
                      effectiveDisplayMode === "percentage" ? 1 : "none",
                  }}
                >
                  <Percent size={12} />
                </IconButton>
              </Box>
            )}

            <QuestionTypeBadge type={question.type} />
          </Box>
        </Box>

        {/* Metadata */}
        <Box mt={1} ml="40px" display="flex" flexWrap="wrap" gap={2}>
          <Typography variant="body2" color="text.secondary">
            {question.totalResponses.toLocaleString()} responses
          </Typography>

          {question.skipped > 0 && (
            <Typography variant="body2" color="text.secondary">
              {question.skipped.toLocaleString()} skipped
            </Typography>
          )}
        </Box>
      </Box>

      {/* Visualization */}
      <Box pl={{ xs: 0, lg: "40px" }}>{renderVisualization()}</Box>
    </Box>
  );
}
