import { Box, Chip, Typography } from "@mui/material";

import { IATSummaryChartProps } from "../../../types/insightTypes";
import {
  IAT_BLUE,
  IAT_ORANGE,
  IAT_SLATE,
  IAT_TRACK,
} from "../../../utils/constants";
import {
  formatMs,
  formatPercent,
  formatSignedMs,
  getPrimarySchema,
  getPrimaryStrategy,
  getStrengthColor,
  prettifyConstant,
} from "../../../utils/utils";

const StatCard = ({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "blue" | "orange" | "neutral";
}) => {
  const colors =
    tone === "blue"
      ? {
          bg: "#eff6ff",
          border: "#bfdbfe",
          value: IAT_BLUE,
        }
      : tone === "orange"
        ? {
            bg: "#fff7ed",
            border: "#fed7aa",
            value: IAT_ORANGE,
          }
        : {
            bg: "#f8fafc",
            border: "#e2e8f0",
            value: IAT_SLATE,
          };

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: colors.border,
        bgcolor: colors.bg,
        p: 1.5,
        minWidth: 0,
      }}
    >
      <Typography fontSize={12} fontWeight={700} color="text.secondary">
        {label}
      </Typography>

      <Typography
        fontSize={22}
        fontWeight={900}
        color={colors.value}
        sx={{
          lineHeight: 1.15,
          mt: 0.25,
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>

      {hint && (
        <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.25 }}>
          {hint}
        </Typography>
      )}
    </Box>
  );
};

const RoundBar = ({
  label,
  avgMs,
  medianMs,
  totalTrials,
  maxMs,
  color,
}: {
  label: string;
  avgMs: number;
  medianMs: number;
  totalTrials: number;
  maxMs: number;
  color: string;
}) => {
  const width =
    maxMs > 0 ? Math.max(6, Math.min(100, (avgMs / maxMs) * 100)) : 0;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          mb: 0.75,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography fontSize={14} fontWeight={800} color="text.primary">
            {label}
          </Typography>

          <Typography fontSize={12} color="text.secondary">
            {totalTrials} trials · median {formatMs(medianMs)}
          </Typography>
        </Box>

        <Typography fontSize={13} fontWeight={800} color={color}>
          {formatMs(avgMs)}
        </Typography>
      </Box>

      <Box
        sx={{
          height: 14,
          width: "100%",
          borderRadius: 999,
          bgcolor: IAT_TRACK,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${width}%`,
            borderRadius: 999,
            bgcolor: color,
          }}
        />
      </Box>
    </Box>
  );
};

const IATSummaryChart = ({ question }: IATSummaryChartProps) => {
  const result = question.result;

  const submissions =
    result.totalSubmissions ?? question.meta.totalResponses ?? 0;
  const completed = result.completedCount ?? 0;
  const completionPercentage = result.completionPercentage ?? 0;

  const totalTrials = result.totalTrials ?? 0;
  const errorTrials = result.errorTrials ?? 0;
  const errorRate = result.errorRate ?? 0;

  const initial = result.rounds?.initial ?? {
    totalTrials: 0,
    meanResponseTimeMs: 0,
    medianResponseTimeMs: 0,
    stdDevResponseTimeMs: 0,
  };

  const reversed = result.rounds?.reversed ?? {
    totalTrials: 0,
    meanResponseTimeMs: 0,
    medianResponseTimeMs: 0,
    stdDevResponseTimeMs: 0,
  };

  const comparison = result.comparison ?? {
    averageDifferenceMs: 0,
    medianDifferenceMs: 0,
    associationDirection: "NEUTRAL",
    strength: "NEUTRAL",
  };

  const maxRoundMs = Math.max(
    initial.meanResponseTimeMs || 0,
    reversed.meanResponseTimeMs || 0,
    1,
  );

  const strengthColors = getStrengthColor(comparison.strength);
  const primaryStrategy = getPrimaryStrategy(result.pairingStrategies);
  const primarySchema = getPrimarySchema(result.schemaVersions);

  if (submissions === 0 || totalTrials === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography fontSize={14} color="text.secondary">
          No IAT responses yet.
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
          label={`Submissions: ${submissions}`}
          sx={{
            fontWeight: 700,
            bgcolor: "#eff6ff",
            color: IAT_BLUE,
          }}
        />

        <Chip
          size="small"
          label={`Completed: ${completed} (${formatPercent(completionPercentage)})`}
          sx={{
            fontWeight: 700,
            bgcolor: "#f8fafc",
            color: IAT_SLATE,
          }}
        />

        <Chip
          size="small"
          label={`Avg RT: ${formatMs(result.timing?.meanResponseTimeMs)}`}
          sx={{
            fontWeight: 700,
            bgcolor: "#fff7ed",
            color: IAT_ORANGE,
          }}
        />

        <Chip
          size="small"
          label={`Error: ${formatPercent(errorRate)}`}
          sx={{
            fontWeight: 700,
            bgcolor: "#fee2e2",
            color: "#b91c1c",
          }}
        />

        {primaryStrategy && (
          <Chip
            size="small"
            label={`Strategy: ${primaryStrategy[0]}`}
            sx={{
              fontWeight: 700,
              bgcolor: "#f1f5f9",
              color: "#475569",
            }}
          />
        )}

        {primarySchema && (
          <Chip
            size="small"
            label={`Schema: ${primarySchema[0]}`}
            sx={{
              fontWeight: 700,
              bgcolor: "#f1f5f9",
              color: "#475569",
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <StatCard
          label="Total trials"
          value={totalTrials.toLocaleString()}
          hint={`${submissions} submissions`}
          tone="neutral"
        />

        <StatCard
          label="Average response time"
          value={formatMs(result.timing?.meanResponseTimeMs)}
          hint={`Median ${formatMs(result.timing?.medianResponseTimeMs)}`}
          tone="orange"
        />

        <StatCard
          label="Errors"
          value={formatPercent(errorRate)}
          hint={`${errorTrials} error trials`}
          tone="neutral"
        />

        <StatCard
          label="Avg difference"
          value={formatSignedMs(comparison.averageDifferenceMs)}
          hint="Reversed - Initial"
          tone="blue"
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
        <Typography
          fontSize={13}
          fontWeight={900}
          color="text.primary"
          mb={1.5}
        >
          Round comparison
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <RoundBar
            label="Round 1 · Initial pairing"
            avgMs={initial.meanResponseTimeMs}
            medianMs={initial.medianResponseTimeMs}
            totalTrials={initial.totalTrials}
            maxMs={maxRoundMs}
            color={IAT_BLUE}
          />

          <RoundBar
            label="Round 2 · Reversed pairing"
            avgMs={reversed.meanResponseTimeMs}
            medianMs={reversed.medianResponseTimeMs}
            totalTrials={reversed.totalTrials}
            maxMs={maxRoundMs}
            color={IAT_ORANGE}
          />
        </Box>
      </Box>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 2,
          bgcolor: "#ffffff",
        }}
      >
        <Typography fontSize={13} fontWeight={900} color="text.primary" mb={1}>
          Association summary
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.3fr 0.7fr",
            },
            gap: 1.5,
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              borderRadius: 2,
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              p: 1.5,
            }}
          >
            <Typography fontSize={12} fontWeight={700} color="text.secondary">
              Direction
            </Typography>

            <Typography
              fontSize={18}
              fontWeight={900}
              color={IAT_SLATE}
              sx={{ mt: 0.25 }}
            >
              {prettifyConstant(comparison.associationDirection)}
            </Typography>

            <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>
              Median difference: {formatSignedMs(comparison.medianDifferenceMs)}
            </Typography>
          </Box>

          <Box
            sx={{
              borderRadius: 2,
              bgcolor: strengthColors.bg,
              border: "1px solid rgba(0,0,0,0.06)",
              p: 1.5,
            }}
          >
            <Typography fontSize={12} fontWeight={700} color="text.secondary">
              Strength
            </Typography>

            <Typography
              fontSize={22}
              fontWeight={900}
              color={strengthColors.fg}
              sx={{ mt: 0.25 }}
            >
              {prettifyConstant(comparison.strength)}
            </Typography>

            <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>
              Based on mean round difference
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default IATSummaryChart;
