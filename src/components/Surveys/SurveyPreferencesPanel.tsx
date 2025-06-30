import { Box } from "@mui/material";

import { useAppTheme } from "../../theme/useAppTheme";
import { SurveyPreferencesPanelProps } from "../../utils/types";

import ElementSettingsContainer from "./ElementSettings/ElementSettingsContainer";

const SurveyPreferencesPanel = ({
  questionId,
  question,
}: SurveyPreferencesPanelProps) => {
  const { scrollStyles } = useAppTheme();
  return (
    <Box
      id="question-settings"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { md: "64%", xl: "100%" },
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: "white",
        m: 0,
        marginTop: { md: 2, xl: 1 },
        boxSizing: "border-box",
        p: 0,
        ...scrollStyles.elementsPanel,
        border: "2px solid red",
      }}
    >
      <ElementSettingsContainer questionId={questionId} question={question} />
    </Box>
  );
};

export default SurveyPreferencesPanel;
