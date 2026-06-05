import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import ConceptFitDisplaySettings from "./ElementSettingsComponents/ConceptFitDisplaySettings";
import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ShowQuestionSettings from "./ElementSettingsComponents/ShowQuestionSettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const ConceptFitElementSettings = ({ qID }: ElementSettingsProps) => {
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
      <ConceptFitDisplaySettings qID={qID} />
      <ScreenTypographySettings key={qID} qID={qID} />
      <ValidationSettings />
      <ShowQuestionSettings />
    </Box>
  );
};

export default ConceptFitElementSettings;
