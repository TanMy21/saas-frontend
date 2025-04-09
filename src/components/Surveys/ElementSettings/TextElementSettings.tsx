import { Box } from "@mui/material";

import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const TextElementSettings = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
      }}
    >
      {" "}
      <QuestionTextandDescriptionSettings />
      <ValidationSettings />
      <ScreenTypographySettings />
    </Box>
  );
};

export default TextElementSettings;
