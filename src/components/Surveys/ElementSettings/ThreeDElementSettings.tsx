import { Box } from "@mui/material";

import { usePermission } from "../../../context/PermissionContext";

import QuestionContentSettings from "./ElementSettingsComponents/QuestionSettings";
import { QuestionTypeMutationSettings } from "./ElementSettingsComponents/QuestionTypeMutationSettings";

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
      <QuestionContentSettings />
    </Box>
  );
};

export default ThreeDElementSettings;
