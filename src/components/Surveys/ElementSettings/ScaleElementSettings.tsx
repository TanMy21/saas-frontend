import { Box } from "@mui/material";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { usePermission } from "../../../context/PermissionContext";

import QuestionContentSettings from "./ElementSettingsComponents/QuestionSettings";
import { QuestionTypeMutationSettings } from "./ElementSettingsComponents/QuestionTypeMutationSettings";
import ScaleRangeSettings from "./ElementSettingsComponents/ScaleRangeSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const ScaleElementSettings = () => {
  const { canEditQuestion } = usePermission();
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const { questionID } = question || {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
      }}
    >
      {canEditQuestion && <QuestionTypeMutationSettings />}
      <QuestionContentSettings />
      <ScreenTypographySettings key={questionID} qID={questionID!} />
      <ScaleRangeSettings />
    </Box>
  );
};

export default ScaleElementSettings;
