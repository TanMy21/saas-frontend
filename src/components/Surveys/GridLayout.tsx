import { Box } from "@mui/material";

import useAuth from "../../hooks/useAuth";
import { WorkspaceLayoutProps } from "../../utils/types";

import CreateNewSurveyCard from "./CreateNewSurveyCard";
import GridSurveyCard from "./GridSurveyCard";

const GridLayout = ({
  surveys,
  workspaceId,
  workspaceName,
  viewMode,
  isArchiveWorkspace,
}: WorkspaceLayoutProps) => {
  const { can } = useAuth();

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
      {can?.("CREATE_SURVEY") && !isArchiveWorkspace && (
        <CreateNewSurveyCard
          workspaceId={workspaceId}
          workspaceName={workspaceName}
          viewMode={"grid"}
        />
      )}

      {surveys.map((survey) => (
        <GridSurveyCard
          key={survey.surveyID}
          survey={survey}
          workspaceId={workspaceId}
          workspaceName={workspaceName}
          viewMode={viewMode}
        />
      ))}
    </Box>
  );
};

export default GridLayout;
