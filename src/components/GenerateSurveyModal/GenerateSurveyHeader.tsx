import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/material";

import { GenerateSurveyState } from "../../utils/constants";

const headerSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: 4,
  pt: 3,
  pb: 2,
  borderBottom: "1px solid #f1f5f9",
  backgroundColor: "#ffffff",
};

export const GenerateSurveyHeader = ({
  state,
  onClose,
}: {
  state: GenerateSurveyState;
  onClose: () => void;
}) => {
  const titleMap = {
    INITIAL_CONFIG: "Generate Survey",
    TOOLS: "Survey Generation Options",
    APPEND_CONFIG: "Generate Additional Questions",
    REPLACE_CONFIRM: "Regenerate Entire Survey",
    LOADING: "Generating...",
  };

  return (
    <Box sx={headerSx}>
      <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
        {titleMap[state]}
      </Typography>

      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Box>
  );
};
