import { Box, Typography } from "@mui/material";

import { questionTypeMap } from "../../utils/elementsConfig";
import { QuestionTypeBadgeProps } from "../../utils/insightTypes";

export function QuestionTypeBadge({ type, className }: QuestionTypeBadgeProps) {
  const config = questionTypeMap[type];

  if (!config) return null;

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1.25,
        py: 0.5,
        borderRadius: "999px",
        fontSize: 12,
        fontWeight: 500,
        color: config.color,
        bgcolor: config.bgColor,
        border: "1px solid",
        borderColor: config.borderColor,
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: 20,
        }}
      >
        {config.icon}
      </Box>

      {/* Label */}
      <Typography component="span" fontSize={14} fontWeight={500}>
        {config.label}
      </Typography>
    </Box>
  );
}
