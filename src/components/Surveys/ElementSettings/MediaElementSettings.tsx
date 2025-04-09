import { Box } from "@mui/material";

import MediaOptionSettings from "./ElementSettingsComponents/MediaOptionSettings";
import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const MediaElementSettings = () => {
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
      <ScreenTypographySettings />
      <MediaOptionSettings />
    </Box>
  );
};

export default MediaElementSettings;
