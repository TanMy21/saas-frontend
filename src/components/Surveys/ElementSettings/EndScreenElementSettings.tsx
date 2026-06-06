import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import NavigationButtonTextSettings from "./ElementSettingsComponents/NavigationButtonTextSettings";
import QuestionContentSettings from "./ElementSettingsComponents/QuestionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const EndScreenElementSettings = ({ qID }: ElementSettingsProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <QuestionContentSettings />
      <NavigationButtonTextSettings />
      <ScreenTypographySettings key={qID} qID={qID} />
    </Box>
  );
};

export default EndScreenElementSettings;
