import { Box } from "@mui/material";

import { WorkspaceLayoutProps } from "../../utils/types";

import CreateNewSurveyCard from "./CreateNewSurveyCard";
import GridSurveyCard from "./GridSurveyCard";

const GridLayout = ({
  surveys,
  workspaceId,
  workspaceName,
  viewMode,
}: WorkspaceLayoutProps) => {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 2,
          width: "100%",
          p: 2,
          gridAutoRows: "180px",
          minHeight: "60vh",
          mb: 2,
          maxHeight: {
            lg: "640px",
          },
        }}
      >
        <CreateNewSurveyCard
          workspaceId={workspaceId}
          workspaceName={workspaceName}
          viewMode={"grid"}
        />
        {surveys?.map((survey) => (
          <GridSurveyCard
            key={survey.surveyID}
            survey={survey}
            workspaceId={workspaceId}
            workspaceName={workspaceName}
            viewMode={viewMode}
          />
        ))}
      </Box>
    </>
  );
};

export default GridLayout;
