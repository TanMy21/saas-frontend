import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../../utils/types";

import QuestionTextandDescriptionSettings from "./QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ScreenTypographySettings";

const InstructionScreenSettings = ({ qID }: ElementSettingsProps) => {
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
      <QuestionTextandDescriptionSettings />
      <ScreenTypographySettings key={qID} qID={qID} />
    </Box>
  );
};

export default InstructionScreenSettings;
