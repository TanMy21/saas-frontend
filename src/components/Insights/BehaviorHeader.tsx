import { Box, Typography, Chip } from "@mui/material";
import { FileText, Users, Clock, TrendingUp } from "lucide-react";

interface SurveyHeaderProps {
  name: string;
  totalResponses: number;
  completionRate: number;
  avgCompletionTime: number;
}

/**
 * SurveyHeader
 * UI-only conversion from Tailwind + shadcn Badge to MUI sx
 */
export function BehaviorHeader({
  name,
  totalResponses,
  completionRate,
  avgCompletionTime,
}: SurveyHeaderProps) {
  return (
    // Root container (bg-card + border-b)
    <Box
      sx={{
        bgcolor: "white", // replaces bg-card
        borderBottom: 1,
        borderColor: "divider", // replaces border-border
      }}
    >
      {/* Inner width-constrained wrapper */}
      <Box
        sx={{
          maxWidth: "72rem", // max-w-6xl
          mx: "auto",
          px: 3, // px-6
          py: 3, // py-6
        }}
      >
        {/* Header row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Left section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {/* Icon container */}
            <Box
              sx={{
                height: 48, // h-12
                width: 48, // w-12
                borderRadius: 2, // rounded-xl
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                opacity: 0.1, // bg-primary/10
              }}
            >
              <FileText
                size={24}
                style={{ color: "var(--mui-palette-primary-main)" }}
              />
            </Box>

            {/* Title + subtitle */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700, // font-bold
                }}
              >
                {name}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mt: 0.5,
                }}
              >
                Behavior Analytics Dashboard
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3, // gap-6
            mt: 3, // mt-6
          }}
        >
          {/* Responses */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Users
              size={16}
              style={{ color: "var(--mui-palette-text-secondary)" }}
            />
            <Typography variant="body2" color="text.secondary">
              Responses:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {totalResponses.toLocaleString()}
            </Typography>
          </Box>

          {/* Completion rate */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingUp
              size={16}
              style={{ color: "var(--mui-palette-text-secondary)" }}
            />
            <Typography variant="body2" color="text.secondary">
              Completion:
            </Typography>

            {/* Replaces shadcn Badge */}
            <Chip
              label={`${completionRate}%`}
              size="small"
              sx={{
                fontWeight: 600,
                bgcolor: "action.hover", // equivalent to secondary badge
              }}
            />
          </Box>

          {/* Avg completion time */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Clock
              size={16}
              style={{ color: "var(--mui-palette-text-secondary)" }}
            />
            <Typography variant="body2" color="text.secondary">
              Avg. time:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {avgCompletionTime} min
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
