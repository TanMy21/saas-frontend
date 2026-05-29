import { Box, Typography } from "@mui/material";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { LikeDislikeSplitSummaryProps } from "../../../types/behaviorTypes";

function SplitSegmentContent({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
        textAlign: "center",
      }}
    >
      {icon}

      <Typography fontSize={13} fontWeight={700} lineHeight={1}>
        {label}
      </Typography>

      <Typography fontSize={13} fontWeight={600} lineHeight={1.2}>
        {value}
      </Typography>
    </Box>
  );
}

export function LikeDislikeSplitSummary({
  likeCount,
  dislikeCount,
  likePercentage,
  dislikePercentage,
  formatValue,
}: LikeDislikeSplitSummaryProps) {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: { xs: 86, sm: 104 },
          overflow: "hidden",
          borderRadius: 6,
          bgcolor: "grey.100",
        }}
      >
        {/* Like split area */}
        <Box
          sx={{
            width: `${likePercentage}%`,
            minWidth: likePercentage > 0 ? 48 : 0,
            bgcolor: "#22C55E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "width 0.5s ease",
            color: "white",
          }}
        >
          {likePercentage > 12 && (
            <SplitSegmentContent
              icon={<ThumbsUp size={22} />}
              label="Like"
              value={formatValue(likeCount, likePercentage)}
            />
          )}
        </Box>

        {/* Dislike split area */}
        <Box
          sx={{
            width: `${dislikePercentage}%`,
            minWidth: dislikePercentage > 0 ? 48 : 0,
            bgcolor: "#EF4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "width 0.5s ease",
            color: "white",
          }}
        >
          {dislikePercentage > 12 && (
            <SplitSegmentContent
              icon={<ThumbsDown size={22} />}
              label="Dislike"
              value={formatValue(dislikeCount, dislikePercentage)}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
