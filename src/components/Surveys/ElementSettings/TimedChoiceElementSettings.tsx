import { Box } from "@mui/material";

import { usePermission } from "../../../context/PermissionContext";
import { ElementSettingsProps } from "../../../utils/types";

import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import { QuestionTypeMutationSettings } from "./ElementSettingsComponents/QuestionTypeMutationSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import TimedChoiceOptionSettings from "./ElementSettingsComponents/TimedChoiceOptionSettings";
import TimedChoiceSettings from "./ElementSettingsComponents/TimedChoiceSettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

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
      {canEditQuestion && <QuestionTypeMutationSettings />}
      <QuestionTextandDescriptionSettings />
      <TimedChoiceOptionSettings qID={qID} canEdit={canEditQuestion} />
      <TimedChoiceSettings qID={qID} />
      <ScreenTypographySettings key={qID} qID={qID} />
      <ValidationSettings />
    </Box>
  );
};

export default TimedChoiceElementSettings;
