import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import { HelpCircle } from "lucide-react";

import { BehaviorMetricCardProps } from "../../types/behaviorTypes";

export function BehaviorSignalMetricCard({
  label,
  value,
  unit,
  tooltip,
  icon,
  trend,
  trendValue,
  variant = "default",
  className,
}: BehaviorMetricCardProps) {
  const variantStyles = {
    default: {},
    signal: {
      bgcolor: "primary.light",
      borderColor: "primary.main",
      opacity: 0.9,
    },
    comparison: {
      bgcolor: "secondary.light",
      borderColor: "secondary.main",
      opacity: 0.9,
    },
  }[variant];

  return (
    <Box component="div"
      className={className}
      sx={{
        position: "relative",
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        p: 2,
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "divider",
          boxShadow: 1,
        },
        ...variantStyles,
      }}
    >
      {/* Header row */}
      <Box component="div"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        {/* Label + icon */}
        <Box component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {icon && <Box component="div" sx={{ color: "text.secondary" }}>{icon}</Box>}

          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "text.secondary",
            }}
          >
            {label}
          </Typography>
        </Box>

        {/* Tooltip */}
        {tooltip && (
          <Tooltip
            title={tooltip}
            placement="top"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  maxWidth: 240,
                  fontSize: 13,
                },
              },
            }}
          >
            <IconButton
              size="small"
              sx={{
                color: "text.secondary",
                opacity: 0.6,
                "&:hover": {
                  opacity: 1,
                },
              }}
            >
              <HelpCircle size={14} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Value */}
      <Box component="div"
        sx={{
          mt: 1,
          display: "flex",
          alignItems: "baseline",
          gap: 0.5,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
          }}
        >
          {value}
        </Typography>

        {unit && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {unit}
          </Typography>
        )}
      </Box>

      {/* Trend */}
      {trend && trendValue && (
        <Box component="div"
          sx={{
            mt: 1,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color:
                trend === "up"
                  ? "success.main"
                  : trend === "down"
                    ? "error.main"
                    : "text.secondary",
            }}
          >
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trendValue}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
