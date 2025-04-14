import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScaleRangeSettings from "./ElementSettingsComponents/ScaleRangeSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const ScaleElementSettings = ({ qID, question }: ElementSettingsProps) => {
  const { text, description, questionPreferences } = question || {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
      }}
    >
      <QuestionTextandDescriptionSettings
        qID={qID}
        qText={text}
        qDescription={description}
      />
      <ScreenTypographySettings key={qID} qID={qID} />
      <ScaleRangeSettings />
      <ValidationSettings qID={qID} questionPreferences={questionPreferences}/>
    </Box>
  );
};

export default ScaleElementSettings;
