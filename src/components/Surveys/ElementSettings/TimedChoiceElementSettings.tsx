import { Box } from "@mui/material";

import { usePermission } from "../../../context/PermissionContext";
import { ElementSettingsProps } from "../../../utils/types";

import QuestionContentSettings from "./ElementSettingsComponents/QuestionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import TimedChoiceOptionSettings from "./ElementSettingsComponents/TimedChoiceOptionSettings";
import TimedChoiceSettings from "./ElementSettingsComponents/TimedChoiceSettings";

const TimedChoiceElementSettings = ({ qID }: ElementSettingsProps) => {
  const { canEditQuestion } = usePermission();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        // border:"2px solid blue",
      }}
    >
      <QuestionContentSettings />
      <TimedChoiceOptionSettings qID={qID} canEdit={canEditQuestion} />
      <TimedChoiceSettings qID={qID} />
      <ScreenTypographySettings key={qID} qID={qID} />
    </Box>
  );
};

export default TimedChoiceElementSettings;
