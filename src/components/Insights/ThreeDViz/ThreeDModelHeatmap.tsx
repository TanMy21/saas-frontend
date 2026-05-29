import { Box, Chip, Typography } from "@mui/material";

import { ClickedMeshArea } from "../../../types/insightTypes";

export function ThreeDModelHeatmapLegend({
  clickedMeshes,
}: {
  clickedMeshes: ClickedMeshArea[];
}) {
  if (!clickedMeshes.length) {
    return (
      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Typography color="text.secondary" fontSize={13}>
          No direct model area clicks were recorded.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
      <Typography fontSize={13} fontWeight={700} mb={1}>
        Highlighted generic areas
      </Typography>

      <Box display="flex" flexDirection="column" gap={1}>
        {clickedMeshes.slice(0, 6).map((area) => (
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
              gap: 2,
            }}
          >
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography fontSize={13} fontWeight={600}>
                  {area.label}
                </Typography>

                <Chip
                  size="small"
                  label={`${area.clickCount} clicks`}
                  sx={{ height: 20, fontSize: 11 }}
                />
              </Box>

              <Typography fontSize={11} color="text.secondary">
                {area.meshName}
                {area.materialName ? ` / ${area.materialName}` : ""}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
