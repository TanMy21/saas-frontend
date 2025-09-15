import { Box } from "@mui/material";

import { WorkspaceLayoutProps } from "../../utils/types";
import NoSurveysFound from "../NoSurveysFound";

import CreateNewSurveyCard from "./CreateNewSurveyCard";
import GridSurveyCard from "./GridSurveyCard";

const GridLayout = ({
  surveys,
  workspaceId,
  workspaceName,
  viewMode,
}: WorkspaceLayoutProps) => {
  const hasSurveys = Array.isArray(surveys) && surveys.length > 0;

  return (
    <Box
      sx={{
        display: "grid",
        boxSizing: "border-box",
        px: 2,
        pt: 2,
        pb: 1.5,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
          xl: "repeat(3, minmax(0, 1fr))",
        },
        gap: 2,
        gridAutoRows: "180px",
        width: "100%",
        maxWidth: "100%",
        p: 2,
        mb: 2,
        maxHeight: {
          lg: "calc((180px * 3) + (16px * 2) + 28px)",
          xl: "calc((180px * 3) + (16px * 2) + 32px)",
        },
        minHeight: { xs: "auto", md: "60vh" },
        // border: "2px solid green",
      }}
    >
      <CreateNewSurveyCard
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        viewMode={"grid"}
      />
      {hasSurveys ? (
        surveys.map((survey) => (
          <GridSurveyCard
            key={survey.surveyID}
            survey={survey}
            workspaceId={workspaceId}
            workspaceName={workspaceName}
            viewMode={viewMode}
          />
        ))
      ) : (
        <NoSurveysFound />
      )}
    </Box>
  );
};

export default GridLayout;
