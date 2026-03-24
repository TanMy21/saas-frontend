import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import NavigationButtonTextSettings from "./ElementSettingsComponents/NavigationButtonTextSettings";
import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const EndScreenElementSettings = ({ qID }: ElementSettingsProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <QuestionTextandDescriptionSettings />
      <NavigationButtonTextSettings />
      <ScreenTypographySettings key={qID} qID={qID} />
    </Box>
  );
};

export default EndScreenElementSettings;
