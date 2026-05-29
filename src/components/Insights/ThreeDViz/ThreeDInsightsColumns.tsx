import { Box, Typography } from "@mui/material";

import { ThreeDQuestionResultAggregate } from "../../../types/behaviorTypes";
import { getRotationInspectionMessage } from "../../../utils/utils";

function ThreeDInsightCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        p: 2,
      }}
    >
      <Typography fontSize={14} fontWeight={700} color="text.primary" mb={0.75}>
        {title}
      </Typography>

      <Typography fontSize={13} color="text.secondary" lineHeight={1.65}>
        {children}
      </Typography>
    </Box>
  );
}

function StrongText({ children }: { children: React.ReactNode }) {
  return (
    <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
      {children}
    </Box>
  );
}

export function ThreeDInsightsColumn({
  data,
}: {
  data: ThreeDQuestionResultAggregate;
}) {
  const firstImpression = data.insights?.firstImpressionVsInspected;
  const rotation = data.insights?.rotationInspection;
  const topArea = data.insights?.mostInteractedArea?.area;
  const zoom = data.insights?.zoomInspection;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <ThreeDInsightCard title="Did inspecting change the verdict?">
        {firstImpression ? (
          <>
            Viewers who interacted with the model liked it{" "}
            <StrongText>{firstImpression.inspected.likeRate}%</StrongText> of
            the time, vs{" "}
            <StrongText>{firstImpression.firstImpression.likeRate}%</StrongText>{" "}
            for those who answered without interaction.
          </>
        ) : (
          "Not enough behavior data to compare first impression and inspected responses."
        )}
      </ThreeDInsightCard>

      <ThreeDInsightCard title="Most clicked region">
        {topArea ? (
          <>
            <StrongText>{topArea.label}</StrongText> received the most direct
            clicks ({topArea.clickCount}). This generic area may draw more
            interaction than others.
          </>
        ) : (
          "No direct model area clicks were recorded."
        )}
      </ThreeDInsightCard>

      <ThreeDInsightCard title="How much viewers explored">
        {rotation ? (
          <>
            <StrongText>{rotation.viewedMultipleAnglesRate}%</StrongText> viewed
            multiple angles. Average horizontal coverage of{" "}
            {getRotationInspectionMessage(rotation)}
          </>
        ) : (
          "No rotation or angle-coverage summary is available yet."
        )}
      </ThreeDInsightCard>

      <ThreeDInsightCard title="Detail inspection">
        {zoom ? (
          <>
            <StrongText>{zoom.deepZoomUsedRate}%</StrongText> used deep zoom.
            Deep-zoom users liked it{" "}
            <StrongText>{zoom.deepZoomLikeRate}%</StrongText> of the time.
          </>
        ) : (
          "No deep-zoom summary is available yet."
        )}
      </ThreeDInsightCard>
    </Box>
  );
}
