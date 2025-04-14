import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const InstructionsElementSettings = ({
  qID,
  question,
}: ElementSettingsProps) => {
  const { text, description } = question || {};

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
    </Box>
  );
};

export default InstructionsElementSettings;
