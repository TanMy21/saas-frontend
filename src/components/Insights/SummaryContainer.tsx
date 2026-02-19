import { useState } from "react";

import { Box, Typography } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useParams } from "react-router-dom";

import { useGetResponsesSummaryQuery } from "../../app/slices/resultsApiSlice";
import { InsightsFilters } from "../../utils/insightTypes";
import { normalizeQuestion } from "../../utils/utils";
import { SummarySkeleton } from "../LoadingSkeletons/SummarySkeleton";
import { EmptyState } from "../States/EmptyState";

import { QuestionSection } from "./QuestionSection";
import { SummaryControls } from "./SummaryControls";

export const SummaryContainer = () => {
  const { surveyID } = useParams();

  const [filters, setFilters] = useState<InsightsFilters>({
    time: "all",
    device: "all",
  });

  // Custom date range validation
  const isCustomRangeValid =
    filters.time !== "custom" ||
    (filters.from && filters.to && filters.from <= filters.to);

  // query args only when valid
  const queryArgs = isCustomRangeValid
    ? {
        surveyID: surveyID!,
        range: filters.time,
        from: filters.from,
        to: filters.to,
        deviceType: filters.device,
      }
    : skipToken;

  const { data, isLoading, isFetching, error } =
    useGetResponsesSummaryQuery(queryArgs);

  const normalizedQuestions = data?.questions.map(normalizeQuestion) ?? [];

  // Render helpers
  const showEmptyState =
    !isLoading && !isFetching && data && normalizedQuestions.length === 0;

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      <SummaryControls filters={filters} setFilters={setFilters} />

      <Box component="main" px={{ xs: 3, lg: 4 }} py={4}>
        <Box
          mx="auto"
          maxWidth={960}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          {/* ───────────── Invalid custom range ───────────── */}
          {!isCustomRangeValid && (
            <Box
              p={3}
              borderRadius={2}
              border="1px dashed"
              borderColor="warning.main"
              bgcolor="warning.light"
            >
              <Typography fontWeight={600}>Invalid date range</Typography>
              <Typography variant="body2" color="text.secondary">
                “From” date must be earlier than or equal to “To” date.
              </Typography>
            </Box>
          )}

          {/* ───────────── Initial loading ───────────── */}
          {isLoading && (
            <>
              <SummarySkeleton />
              <SummarySkeleton />
              <SummarySkeleton />
            </>
          )}

          {/* ───────────── Error state ───────────── */}
          {error && !isLoading && (
            <Box p={3}>
              <Typography color="error.main" fontWeight={600}>
                Failed to load responses
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please try again or adjust filters.
              </Typography>
            </Box>
          )}

          {/* ───────────── Empty state ───────────── */}
          {showEmptyState && (
            <Box
              p={6}
              borderRadius={3}
              border="1px dashed"
              borderColor="divider"
              textAlign="center"
            >
              <EmptyState />
            </Box>
          )}

          {/* ───────────── Data loaded ───────────── */}
          {!isLoading &&
            normalizedQuestions.map((question) => (
              <QuestionSection key={question.questionID} question={question} />
            ))}

          {/* ───────────── Background refetch indicator ───────────── */}
          {isFetching && !isLoading && (
            <Box
              position="fixed"
              bottom={24}
              right={24}
              px={2}
              py={1}
              borderRadius={999}
              bgcolor="background.paper"
              boxShadow="0 4px 12px rgba(0,0,0,0.12)"
            >
              <Typography fontSize={12} color="text.secondary">
                Updating…
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
