import { Box } from "@mui/material";

import {
  useGet3DModelBehaviorQuery,
  useGet3DModelsForSurveyQuery,
} from "../../../app/slices/resultsApiSlice";
import { ThreeDOptionChartProps } from "../../../types/insightTypes";
import { LikeDislikeSplitSummary } from "../ThreeDViz/LikeDislikeSplit";
import { ThreeDBehaviorInsights } from "../ThreeDViz/ThreeDBehaviorInsights";

export const ThreeDOptionChart = ({
  question,
  surveyID,
}: ThreeDOptionChartProps) => {
  const { meta, result } = question;

  const { data: modelBehaviorData, isLoading } = useGet3DModelBehaviorQuery({
    surveyID: surveyID,
    questionID: question.questionID,
  });

  const { data: modelsData, isLoading: isModelsLoading } =
    useGet3DModelsForSurveyQuery(surveyID);

  const model3D = modelsData?.modelMap?.[question.questionID];

  const modelUrl = model3D?.fileUrl;

  const total = meta.totalResponses;

  const likePercentage = total > 0 ? (result.left.count / total) * 100 : 0;
  const dislikePercentage = total > 0 ? (result.right.count / total) * 100 : 0;

  const formatValue = (count: number, pct: number) =>
    `${count.toLocaleString()} (${pct.toFixed(1)}%)`;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Like/Dislike Split*/}
      <LikeDislikeSplitSummary
        likeCount={result.left.count}
        dislikeCount={result.right.count}
        likePercentage={likePercentage}
        dislikePercentage={dislikePercentage}
        formatValue={formatValue}
      />
      {/* ───────────── 3D behavior insights ────────────────── */}
      <ThreeDBehaviorInsights
        data={modelBehaviorData}
        isLoading={isLoading || isModelsLoading}
        modelUrl={modelUrl}
      />
    </Box>
  );
};
