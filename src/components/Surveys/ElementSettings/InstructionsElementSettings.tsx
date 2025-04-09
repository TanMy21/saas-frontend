import { Box } from "@mui/material";

import InstructionScreenSettings from "./ElementSettingsComponents/InstructionScreenSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const InstructionsElementSettings = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
      }}
    >
      <InstructionScreenSettings />
      <ScreenTypographySettings />
    </Box>
  );
};

export default InstructionsElementSettings;
