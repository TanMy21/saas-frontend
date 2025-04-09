import { Box } from "@mui/material";

import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScaleRangeSettings from "./ElementSettingsComponents/ScaleRangeSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const ScaleElementSettings = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
      }}
    >
      <QuestionTextandDescriptionSettings />
      <ValidationSettings />
      <ScaleRangeSettings />
      <ScreenTypographySettings />
    </Box>
  );
};

export default ScaleElementSettings;
