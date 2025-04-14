import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import NavigationButtonTextSettings from "./ElementSettingsComponents/NavigationButtonTextSettings";
import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const EndScreenElementSettings = ({ qID, question }: ElementSettingsProps) => {
  const { text, description, questionPreferences } = question || {};

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <QuestionTextandDescriptionSettings
        qID={qID}
        qText={text}
        qDescription={description}
      />
      <NavigationButtonTextSettings
        qID={qID}
        questionPreferences={questionPreferences}
      />
      <ScreenTypographySettings key={qID} qID={qID} />
    </Box>
  );
};

export default EndScreenElementSettings;
