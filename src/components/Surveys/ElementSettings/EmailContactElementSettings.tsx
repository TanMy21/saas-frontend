import { Box } from "@mui/material";

import ScreenSettings from "./ElementSettingsComponents/ScreenSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const EmailContactElementSettings = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
      }}
    >
      <ScreenSettings />
      <ScreenTypographySettings />
      <ValidationSettings />
    </Box>
  );
};

export default EmailContactElementSettings;
