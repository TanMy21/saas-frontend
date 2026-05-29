import { Box, Typography } from "@mui/material";

import { ColoredClickedMeshArea } from "../../../types/behaviorTypes";

export const ThreeDModelAreaSummary = ({
  areas,
}: {
  areas: ColoredClickedMeshArea[];
}) => {
  if (!areas.length) {
    return (
      <Typography color="text.secondary" fontSize={14}>
        No direct model area clicks were recorded.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography fontWeight={700} mb={1}>
        Most interacted model areas
      </Typography>

      <Box display="flex" flexDirection="column" gap={1}>
        {areas.map((area) => (
          <Box
            key={`${area.meshName}-${area.materialName ?? "none"}`}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 1.5,
              bgcolor: `${area.color}10`,
            }}
          >
            <Box display="flex" alignItems="flex-start" gap={1.25}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: area.color,
                  mt: "6px",
                  flexShrink: 0,
                }}
              />

              <Box>
                <Typography fontWeight={600}>{area.label}</Typography>

                <Typography fontSize={12} color="text.secondary">
                  {area.meshName}
                  {area.materialName ? ` / ${area.materialName}` : ""}
                </Typography>
              </Box>
            </Box>

            <Typography fontWeight={700}>{area.clickCount}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
