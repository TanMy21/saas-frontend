import { Box } from "@mui/material";

import { CardOption } from "./CardOption";

export const GenerateSurveyTools = ({
  onAppend,
  onReplace,
}: {
  onAppend: () => void;
  onReplace: () => void;
}) => {
  return (
    <Box sx={{ p:2, gap: 2, display: "flex", flexDirection: "column" }}>
      <CardOption
        title="Generate Additional Questions"
        description="Append new questions to the end of your survey."
        onClick={onAppend}
      />
      <CardOption
        title="Regenerate Entire Survey"
        description="Replace all existing questions."
        onClick={onReplace}
        variant="secondary"
      />
    </Box>
  );
};
