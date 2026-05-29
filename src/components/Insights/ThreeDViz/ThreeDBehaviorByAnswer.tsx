import { Box, Typography } from "@mui/material";

import {
  ThreeDBehaviorGroupSummary,
  ThreeDQuestionResultAggregate,
} from "../../../types/behaviorTypes";

const MetricRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <Box display="flex" justifyContent="space-between" py={0.75}>
      <Typography fontSize={14} color="text.secondary">
        {label}
      </Typography>
      <Typography fontSize={14} fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
};

const BehaviorGroupCard = ({
  title,
  summary,
}: {
  title: string;
  summary: ThreeDBehaviorGroupSummary;
}) => {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 2,
      }}
    >
      <Typography fontWeight={700} mb={2}>
        {title}
      </Typography>

      <MetricRow
        label="Total responses"
        value={summary.total.toLocaleString()}
      />
      <MetricRow
        label="Answered without interaction"
        value={`${summary.answeredWithoutInteractionRate.toFixed(1)}%`}
      />
      <MetricRow
        label="Viewed multiple angles"
        value={`${summary.viewedMultipleAnglesRate.toFixed(1)}%`}
      />
      <MetricRow
        label="Deep zoom used"
        value={`${summary.deepZoomUsedRate.toFixed(1)}%`}
      />
      <MetricRow
        label="Avg model clicks"
        value={summary.avgModelClicks.toFixed(1)}
      />
      <MetricRow
        label="Avg empty clicks"
        value={summary.avgEmptyClicks.toFixed(1)}
      />
    </Box>
  );
};

export const ThreeDBehaviorByAnswer = ({
  data,
}: {
  data: ThreeDQuestionResultAggregate;
}) => {
  const like = data.behaviorByAnswer.like;
  const dislike = data.behaviorByAnswer.dislike;

  return (
    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
      <BehaviorGroupCard title="Liked users" summary={like} />
      <BehaviorGroupCard title="Disliked users" summary={dislike} />
    </Box>
  );
};
