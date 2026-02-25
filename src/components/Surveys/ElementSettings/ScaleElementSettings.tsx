import { Box } from "@mui/material";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";

import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScaleRangeSettings from "./ElementSettingsComponents/ScaleRangeSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const ScaleElementSettings = () => {
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
      <QuestionTextandDescriptionSettings />
      <ScreenTypographySettings key={questionID} qID={questionID!} />
      <ScaleRangeSettings />
      <ValidationSettings />
    </Box>
  );
};

export default ScaleElementSettings;
