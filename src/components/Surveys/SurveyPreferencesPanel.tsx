import SettingsIcon from "@mui/icons-material/Settings";
import { Box } from "@mui/material";

import { SurveyPreferencesPanelProps } from "../../utils/types";

import ElementSettingsContainer from "./ElementSettings/ElementSettingsContainer";

const SurveyPreferencesPanel = ({
  questionId,
  question,
}: SurveyPreferencesPanelProps) => {
  return (
    <Box
      id="question-settings"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        width: "100%",
        minHeight: "100%",
        height: "auto",
        overflowY: "scroll",
        overflowX: "hidden",
        scrollBehavior: "smooth",
        left: "0",
        right: "0",
        // border: "2px solid green",
        borderLeft: "2px solid #E5E7EB",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: "92%",
          // border: "2px solid green",
        }}
      >
        <ElementSettingsContainer questionId={questionId} question={question} />
      </Box>
    </Box>
  );
};

export default SurveyPreferencesPanel;
