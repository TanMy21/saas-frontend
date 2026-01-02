import { Box, Typography } from "@mui/material";
import { Check, X } from "lucide-react";

interface BinaryChartProps {
  yes: number;
  no: number;
  displayMode: "count" | "percentage";
}

interface BinaryChartProps {
  yes: number;
  no: number;
  displayMode: "count" | "percentage";
}

export function BinaryChart({ yes, no, displayMode }: BinaryChartProps) {
  const total = yes + no;
  const yesPercentage = total > 0 ? (yes / total) * 100 : 0;
  const noPercentage = total > 0 ? (no / total) * 100 : 0;

  const formatValue = (count: number, percentage: number) => {
    if (displayMode === "percentage") {
      return `${percentage.toFixed(1)}%`;
    }
    return count.toLocaleString();
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* ───────────────── Visual split ───────────────── */}
      <Box
        sx={{
          display: "flex",
          height: 96,
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        {/* Yes */}
        <Box
          sx={{
            width: `${yesPercentage}%`,
            bgcolor: "success.main",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            transition: "width 0.5s ease",
          }}
        >
          {yesPercentage > 20 && (
            <>
              <Check
                size={24}
                color="var(--mui-palette-success-contrastText)"
              />
              <Typography
                fontSize={14}
                fontWeight={600}
                color="success.contrastText"
              >
                {formatValue(yes, yesPercentage)}
              </Typography>
            </>
          )}
        </Box>

        {/* No */}
        <Box
          sx={{
            width: `${noPercentage}%`,
            bgcolor: "error.main",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            transition: "width 0.5s ease",
          }}
        >
          {noPercentage > 20 && (
            <>
              <X size={24} color="var(--mui-palette-error-contrastText)" />
              <Typography
                fontSize={14}
                fontWeight={600}
                color="error.contrastText"
              >
                {formatValue(no, noPercentage)}
              </Typography>
            </>
          )}
        </Box>
      </Box>

      {/* ───────────────── Legend ───────────────── */}
      <Box display="flex" justifyContent="center" gap={6}>
        {/* Yes */}
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "success.main",
              opacity: 0.1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={20} color="var(--mui-palette-success-main)" />
          </Box>
          <Box>
            <Typography fontSize={14} color="text.secondary">
              Yes
            </Typography>
            <Typography fontSize={18} fontWeight={600}>
              {formatValue(yes, yesPercentage)}
            </Typography>
          </Box>
        </Box>

        {/* No */}
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "error.main",
              opacity: 0.1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} color="var(--mui-palette-error-main)" />
          </Box>
          <Box>
            <Typography fontSize={14} color="text.secondary">
              No
            </Typography>
            <Typography fontSize={18} fontWeight={600}>
              {formatValue(no, noPercentage)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
