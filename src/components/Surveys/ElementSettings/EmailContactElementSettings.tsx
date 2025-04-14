import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import InstructionScreenSettings from "./ElementSettingsComponents/InstructionScreenSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const EmailContactElementSettings = ({
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
      }}
    >
      <InstructionScreenSettings
        qID={qID}
        qText={text}
        qDescription={description}
      />
      <ScreenTypographySettings key={qID} qID={qID} />
      <ValidationSettings qID={qID} questionPreferences={questionPreferences}/>
    </Box>
  );
};

export default EmailContactElementSettings;
