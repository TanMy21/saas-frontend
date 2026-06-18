import { Box, Chip, Typography } from "@mui/material";

import { ConceptFitSummaryChartProps } from "../../../types/insightTypes";
import { LEFT_COLOR, RIGHT_COLOR, TRACK_COLOR } from "../../../utils/constants";
import { formatMs, formatPercent, getSafePercent } from "../../../utils/utils";

const ConceptFitSummaryChart = ({ question }: ConceptFitSummaryChartProps) => {
  const result = question.result;

  const leftLabel = result.labels?.left || "Fits";
  const rightLabel = result.labels?.right || "Doesn't fit";

  const leftCount = result.counts?.left ?? 0;
  const rightCount = result.counts?.right ?? 0;

  const totalAttributeResponses =
    result.totalAttributeResponses || leftCount + rightCount;

  const leftPercentage = getSafePercent(
    result.percentages?.left,
    totalAttributeResponses > 0
      ? (leftCount / totalAttributeResponses) * 100
      : 0,
  );

  const rightPercentage = getSafePercent(
    result.percentages?.right,
    totalAttributeResponses > 0
      ? (rightCount / totalAttributeResponses) * 100
      : 0,
  );

  const attributes = result.attributes ?? [];

  if (!attributes.length && totalAttributeResponses === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography fontSize={14} color="text.secondary">
          No concept fit responses yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
        }}
      >
        <Chip
          size="small"
          label={`Submissions: ${result.totalSubmissions ?? question.meta.totalResponses ?? 0}`}
          sx={{
            fontWeight: 700,
            bgcolor: "#eff6ff",
            color: LEFT_COLOR,
          }}
        />

        <Chip
          size="small"
          label={`Completed: ${result.completedCount ?? 0} (${formatPercent(
            result.completionPercentage,
          )})`}
          sx={{
            fontWeight: 700,
            bgcolor: "#f8fafc",
            color: "#334155",
          }}
        />

        <Chip
          size="small"
          label={`Avg time: ${formatMs(result.timing?.meanResponseTimeMs)}`}
          sx={{
            fontWeight: 700,
            bgcolor: "#fff7ed",
            color: RIGHT_COLOR,
          }}
        />

        <Chip
          size="small"
          label={`Attribute responses: ${totalAttributeResponses}`}
          sx={{
            fontWeight: 700,
            bgcolor: "#f8fafc",
            color: "#334155",
          }}
        />
      </Box>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 2,
          mb: 2.5,
          bgcolor: "#ffffff",
        }}
      >
        <Typography fontSize={13} fontWeight={800} color="text.primary" mb={1}>
          Overall split
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              borderRadius: 2,
              p: 1.5,
              bgcolor: "#eff6ff",
              border: "1px solid #bfdbfe",
            }}
          >
            <Typography fontSize={12} fontWeight={700} color="text.secondary">
              {leftLabel}
            </Typography>

            <Typography fontSize={24} fontWeight={900} color={LEFT_COLOR}>
              {leftCount}
            </Typography>

            <Typography fontSize={12} fontWeight={700} color="text.secondary">
              {formatPercent(leftPercentage)}
            </Typography>
          </Box>

          <Box
            sx={{
              borderRadius: 2,
              p: 1.5,
              bgcolor: "#fff7ed",
              border: "1px solid #fed7aa",
            }}
          >
            <Typography fontSize={12} fontWeight={700} color="text.secondary">
              {rightLabel}
            </Typography>

            <Typography fontSize={24} fontWeight={900} color={RIGHT_COLOR}>
              {rightCount}
            </Typography>

            <Typography fontSize={12} fontWeight={700} color="text.secondary">
              {formatPercent(rightPercentage)}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            height: 14,
            width: "100%",
            display: "flex",
            overflow: "hidden",
            borderRadius: 999,
            bgcolor: TRACK_COLOR,
          }}
        >
          <Box
            sx={{
              width: `${Math.max(0, Math.min(100, leftPercentage))}%`,
              bgcolor: LEFT_COLOR,
            }}
          />

          <Box
            sx={{
              width: `${Math.max(0, Math.min(100, rightPercentage))}%`,
              bgcolor: RIGHT_COLOR,
            }}
          />
        </Box>
      </Box>

      <Box>
        <Typography
          fontSize={13}
          fontWeight={800}
          color="text.primary"
          mb={1.25}
        >
          Attribute breakdown
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {attributes.map((attribute) => {
            const total = attribute.total || 0;

            const attrLeftCount = attribute.counts?.left ?? 0;
            const attrRightCount = attribute.counts?.right ?? 0;

            const attrLeftPercentage = getSafePercent(
              attribute.percentages?.left,
              total > 0 ? (attrLeftCount / total) * 100 : 0,
            );

            const attrRightPercentage = getSafePercent(
              attribute.percentages?.right,
              total > 0 ? (attrRightCount / total) * 100 : 0,
            );

            return (
              <Box
                key={attribute.attributeOptionID || attribute.attributeText}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "30% 68%" },
                  columnGap: "2%",
                  rowGap: 0.75,
                  alignItems: "center",
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    fontSize={14}
                    fontWeight={700}
                    color="text.primary"
                    title={attribute.attributeText}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {attribute.attributeText}
                  </Typography>

                  <Typography fontSize={12} color="text.secondary">
                    Avg {formatMs(attribute.avgResponseTimeMs)}
                  </Typography>
                </Box>

                <Box>
                  <Box
                    sx={{
                      height: 28,
                      width: "100%",
                      display: "flex",
                      overflow: "hidden",
                      borderRadius: 1.5,
                      bgcolor: TRACK_COLOR,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${Math.max(0, Math.min(100, attrLeftPercentage))}%`,
                        bgcolor: LEFT_COLOR,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        fontSize: 12,
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {attrLeftPercentage >= 18 ? attrLeftCount : ""}
                    </Box>

                    <Box
                      sx={{
                        width: `${Math.max(0, Math.min(100, attrRightPercentage))}%`,
                        bgcolor: RIGHT_COLOR,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        fontSize: 12,
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {attrRightPercentage >= 18 ? attrRightCount : ""}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 0.5,
                      gap: 1,
                    }}
                  >
                    <Typography fontSize={12} color="text.secondary">
                      {leftLabel}: {attrLeftCount} (
                      {formatPercent(attrLeftPercentage)})
                    </Typography>

                    <Typography fontSize={12} color="text.secondary">
                      {rightLabel}: {attrRightCount} (
                      {formatPercent(attrRightPercentage)})
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ConceptFitSummaryChart;
