import { Box, Typography } from "@mui/material";

import { ThreeDQuestionResultAggregate } from "../../../types/behaviorTypes";

export const BehaviorMetricCard = ({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) => {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 2,
        bgcolor: "background.paper",
        minHeight: 100,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        fontSize={13}
        color="text.secondary"
        sx={{
          minHeight: 38,
          lineHeight: 1.35,
        }}
      >
        {label}
      </Typography>

      <Typography
        fontSize={24}
        fontWeight={700}
        sx={{
          minHeight: 40,
          display: "flex",
          alignItems: "center",
          mt: 0.5,
        }}
      >
        {value}
      </Typography>

      <Typography
        fontSize={12}
        color="text.secondary"
        sx={{
          mt: "8%",
          minHeight: 32,
          lineHeight: 1.35,
        }}
      >
        {helper}
      </Typography>
    </Box>
  );
};
export const ThreeDBehaviorSummaryCards = ({
  data,
}: {
  data: ThreeDQuestionResultAggregate;
}) => {
  const summary = data.behaviorSummary;

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "1fr",
        sm: "repeat(2, minmax(0, 1fr))",
        md: "repeat(3, minmax(0, 1fr))",
        xl: "repeat(5, minmax(0, 1fr))",
      }}
      gap={2}
    >
      <BehaviorMetricCard
        label="Answered without interaction"
        value={`${summary.answeredWithoutInteractionRate.toFixed(1)}%`}
        helper="First-impression decisions"
      />

      <BehaviorMetricCard
        label="Viewed multiple angles"
        value={`${summary.viewedMultipleAnglesRate.toFixed(1)}%`}
        helper="Users inspected the model"
      />

      <BehaviorMetricCard
        label="Deep zoom used"
        value={`${summary.deepZoomUsedRate.toFixed(1)}%`}
        helper="Users inspected details"
      />

      <BehaviorMetricCard
        label="Model clicks"
        value={summary.modelClickCountTotal.toLocaleString()}
        helper="Direct model interactions"
      />

      <BehaviorMetricCard
        label="Empty clicks"
        value={`${summary.emptyClickRate.toFixed(1)}%`}
        helper="Viewer clicks that missed model"
      />
    </Box>
  );
};
