import { Box } from "@mui/material";

import { useElectricTheme } from "../../theme/useElectricTheme";
import { SurveyPreferencesPanelProps } from "../../utils/types";

import ElementSettingsContainer from "./ElementSettings/ElementSettingsContainer";

const SurveyPreferencesPanel = ({
  questionId,
  question,
}: SurveyPreferencesPanelProps) => {
  const { scrollStyles } = useElectricTheme();
  return (
    <Box
      id="question-settings"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "98%",
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        left: "0",
        right: "0",
        backgroundColor: "white",
        pt: { md: 2, xl: 1 },
        ...scrollStyles.elementsPanel,
      }}
    >
      <ElementSettingsContainer questionId={questionId} question={question} />
    </Box>
  );
};

export default SurveyPreferencesPanel;
