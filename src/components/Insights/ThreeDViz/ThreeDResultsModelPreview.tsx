import { Box, Typography } from "@mui/material";

import { Interactive3DModelViewer } from "../../Surveys/Elements/Interactive3DModelViewer";

export function ThreeDResultModelPreview({ modelUrl }: { modelUrl?: string }) {
  if (!modelUrl) {
    return null;
  }

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "background.paper",
        minHeight: 320,
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography fontWeight={700}>3D model preview</Typography>
        <Typography fontSize={13} color="text.secondary">
          Preview of the model used in this question.
        </Typography>
      </Box>

      <Box sx={{ height: 320 }}>
        <Interactive3DModelViewer
          key={modelUrl}
          src={modelUrl}
          autoRotate={false}
          height={200}
        />
      </Box>
    </Box>
  );
}
