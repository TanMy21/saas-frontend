import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import { InfoScreenRichTextSettings } from "./ElementSettingsComponents/InfoScreenRichTextSettings";
import { QuestionTextSettings } from "./ElementSettingsComponents/QuestionTextSettings";
import { QuestionTextTypographySettings } from "./ElementSettingsComponents/QuestionTextTypographySettings";

const InfoScreenElementSettings = ({ qID }: ElementSettingsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
      }}
    >
      <QuestionTextSettings />
      <QuestionTextTypographySettings key={qID} qID={qID} />
      <InfoScreenRichTextSettings qID={qID} />
    </Box>
  );
};

export default InfoScreenElementSettings;
