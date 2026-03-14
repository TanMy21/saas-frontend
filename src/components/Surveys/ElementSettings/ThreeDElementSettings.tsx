import { Box } from "@mui/material";

import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import { QuestionTypeMutationSettings } from "./ElementSettingsComponents/QuestionTypeMutationSettings";
import ShowQuestionSettings from "./ElementSettingsComponents/ShowQuestionSettings";

const ThreeDElementSettings = () => {
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
      <QuestionTypeMutationSettings />
      <QuestionTextandDescriptionSettings />
      <ShowQuestionSettings />
    </Box>
  );
};

export default ThreeDElementSettings;
