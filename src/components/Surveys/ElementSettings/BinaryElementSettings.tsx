import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import BinaryOptionsSettings from "./ElementSettingsComponents/BinaryOptionsSettings";
import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const BinaryElementSettings = ({ qID, question }: ElementSettingsProps) => {
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
      <ValidationSettings qID={qID} questionPreferences={questionPreferences} />
      <BinaryOptionsSettings />
    </Box>
  );
};

export default BinaryElementSettings;
