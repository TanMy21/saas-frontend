import { Box } from "@mui/material";

import NumberInputRangeSettings from "./ElementSettingsComponents/NumberInputRangeSettings";
import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const NumberElementSettings = () => {
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
      <NumberInputRangeSettings />
      <ScreenTypographySettings />
    </Box>
  );
};

export default NumberElementSettings;
