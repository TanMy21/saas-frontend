import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import ConceptFitDisplaySettings from "./ElementSettingsComponents/ConceptFitDisplaySettings";
import QuestionContentSettings from "./ElementSettingsComponents/QuestionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

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
      <QuestionContentSettings />
      <ConceptFitDisplaySettings qID={qID} />
      <ScreenTypographySettings key={qID} qID={qID} />
    </Box>
  );
};

export default ConceptFitElementSettings;
