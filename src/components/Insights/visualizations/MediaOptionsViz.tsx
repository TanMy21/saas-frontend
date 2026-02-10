import { Box, Typography } from "@mui/material";

import { MediaOptionsVizProps } from "../../../utils/insightTypes";

export const MediaOptionsViz = ({ question }: MediaOptionsVizProps) => {
  const total = question.meta.totalResponses;

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "repeat(2, 1fr)",
        sm: "repeat(4, 1fr)",
      }}
      gap={2}
    >
      {question.result.options.map((option) => {
        const percentage = total > 0 ? (option.count / total) * 100 : 0;

        return (
          <Box
            key={option.optionID}
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "action.hover",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "primary.main",
                boxShadow: 3,
              },
              "&:hover img": {
                transform: "scale(1.05)",
              },
            }}
          >
            {/* Image */}
            <Box
              sx={{
                aspectRatio: "3 / 2",
                overflow: "hidden",
              }}
            >
              {option.image ? (
                <Box
                  component="img"
                  src={option.image}
                  alt={option.label}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    No image
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Gradient overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)",
              }}
            />

            {/* Label + value */}
            <Box
              sx={{
                position: "absolute",
                insetX: 0,
                bottom: 0,
                p: 1.5,
              }}
            >
              <Typography fontSize={14} fontWeight={500} color="common.white">
                {option.label}
              </Typography>
              <Typography fontSize={18} fontWeight={700} color="common.white">
                {option.count}
              </Typography>
            </Box>

            {/* Percentage badge */}
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                borderRadius: 999,
                bgcolor: "background.paper",
                px: 1,
                py: "2px",
              }}
            >
              <Typography fontSize={12} fontWeight={500} color="text.primary">
                {percentage.toFixed(0)}%
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
