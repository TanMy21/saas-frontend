import SettingsIcon from "@mui/icons-material/Settings";
import { Box } from "@mui/material";

import { SurveyPreferencesPanelProps } from "../../utils/types";

import ElementSettingsContainer from "./ElementSettings/ElementSettingsContainer";

const SurveyPreferencesPanel = ({
  survey,
  questionId,
  display,
}: SurveyPreferencesPanelProps) => {
  return (
    <Box
      id="question-settings"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100%",
        left: "0",
        right: "0",
        border:"2px solid green",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "2%",
          marginTop: "2%",
          width: "100%",
          height: "48px",
          //   border: "2px solid red",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            height: "100%",
            pl: "4%",
            gap: 2,
            fontSize: "20px",
            fontWeight: 600,
            color: "#3F3F46",
            // border: "1px solid red",
            borderBottom: "2px solid #F3F4F6",
          }}
        >
          <SettingsIcon sx={{ color: "#752FEC", mt: 0.3 }} />
          Settings
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: "92%",
          // pt: "2%",
          // border: "2px solid green",
        }}
      >
        <ElementSettingsContainer
          survey={survey}
          questionId={questionId}
          display={display}
        />
      </Box>
    </Box>
  );
};

export default SurveyPreferencesPanel;
