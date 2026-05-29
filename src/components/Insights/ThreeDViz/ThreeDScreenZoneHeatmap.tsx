import { Box, Typography } from "@mui/material";

const ZONES = [
  ["top-left", "top-center", "top-right"],
  ["middle-left", "middle-center", "middle-right"],
  ["bottom-left", "bottom-center", "bottom-right"],
];

 
export const ThreeDScreenZoneHeatmap = ({
  summary,
}: {
  summary: Record<string, number>;
}) => {
  const maxValue = Math.max(1, ...Object.values(summary));

  return (
    <Box>
      <Typography fontWeight={700} mb={1}>
        Viewer interaction heatmap
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          maxWidth: 420,
        }}
      >
        {ZONES.flat().map((zone) => {
          const count = summary[zone] ?? 0;
          const intensity = count / maxValue;

          return (
            <Box
              key={zone}
              sx={{
                height: 88,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider", 
                bgcolor: `rgba(0, 116, 235, ${0.08 + intensity * 0.5})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography fontSize={12} color="text.secondary">
                {zone}
              </Typography>
              <Typography fontSize={18} fontWeight={700}>
                {count}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
