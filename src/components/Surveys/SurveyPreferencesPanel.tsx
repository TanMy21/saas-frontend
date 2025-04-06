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
        height: "100%",
        gap: "1%",
        left: "0",
        right: "0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "92%",
          margin: "auto",
          marginTop: "0%",
          gap: 2,
          height: { lg: "24px", xl: "24px" },
          maxHeight: { lg: "24px", xl: "24px" },
          fontSize: "20px",
          fontWeight: 600,
          color: "#3F3F46",
          // border: "1px solid red",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <SettingsIcon sx={{ color: "#752FEC" }} />
        Settings
      </Box>
      {/* <Divider
                  sx={{
                    borderWidth: "1px",
                    backgroundColor: "#F3F4F6",
                    marginTop: { lg: "0%", xl: "0%" },
                    marginBottom: { lg: "0%", xl: "0%" },
                  }}
                /> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "92%",
          margin: "auto",
          marginTop: "0%",
          // padding: "2px",
          height: "92%",
          // border: "1px solid black",
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
