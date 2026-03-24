import { Box } from "@mui/material";

import { usePermission } from "../../../context/PermissionContext";

import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import { QuestionTypeMutationSettings } from "./ElementSettingsComponents/QuestionTypeMutationSettings";
import ShowQuestionSettings from "./ElementSettingsComponents/ShowQuestionSettings";

const ThreeDElementSettings = () => {
  const { canEditQuestion } = usePermission();
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
      {canEditQuestion && <QuestionTypeMutationSettings />}
      <QuestionTextandDescriptionSettings />
      <ShowQuestionSettings />
    </Box>
  );
};

export default ThreeDElementSettings;
