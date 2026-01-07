import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

import Results from "../components/Surveys/Results";
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import { LocationStateProps, Survey } from "../utils/types";

const SurveyResults = () => {
  const location = useLocation();
  const { headerProps } = (location.state as LocationStateProps) || {};
  const { tabValue, survey, workspaceId, workspaceName } = headerProps || {};
  const { title } = (survey as Survey) || "";

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Fixed Header */}
      <Box
        sx={{
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <SurveyBuilderHeader
          tabValue={tabValue}
          survey={survey!}
          workspaceId={workspaceId}
          workspaceName={workspaceName}
          title={title}
        />
      </Box>

      {/* Main content area */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Results />
      </Box>
    </Box>
  );
};

export default SurveyResults;
