import { Box } from "@mui/material";

import ScreenSettings from "./ElementSettingsComponents/ScreenSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const EndScreenElementSettings = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <ScreenSettings />
      <ScreenTypographySettings />
    </Box>
  );
};

export default EndScreenElementSettings;
