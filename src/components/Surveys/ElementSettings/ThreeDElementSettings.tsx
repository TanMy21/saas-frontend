import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ShowQuestionSettings from "./ElementSettingsComponents/ShowQuestionSettings";

const ThreeDElementSettings = ({ qID }: ElementSettingsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
        // border:"2px solid blue",
      }}
    >
      <QuestionTextandDescriptionSettings />
      <ShowQuestionSettings />
    </Box>
  );
};

export default ThreeDElementSettings;
