import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import NavigationButtonTextSettings from "./ElementSettingsComponents/NavigationButtonTextSettings";
import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const WelcomeScreenElementSettings = ({
  qID,
  question,
}: ElementSettingsProps) => {
  const { text, description, questionPreferences } = question || {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
        // border: "2px solid red",
      }}
    >
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

export default WelcomeScreenElementSettings;
