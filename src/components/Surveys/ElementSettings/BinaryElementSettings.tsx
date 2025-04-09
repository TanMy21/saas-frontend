import { Box } from "@mui/material";

import BinaryOptionsSettings from "./ElementSettingsComponents/BinaryOptionsSettings";
import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const BinaryElementSettings = () => {
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
      <BinaryOptionsSettings />
    </Box>
  );
};

export default BinaryElementSettings;
