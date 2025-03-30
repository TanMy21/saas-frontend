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
          gridAutoRows: "200px",
          minHeight: "60vh",
          mb: 2,
          maxHeight: {
            lg: "640px",
          },
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "10px", // Scrollbar width
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1", // Scrollbar track color
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#61A5D2", // Scrollbar thumb color
            borderRadius: "10px", // Rounded corners on the scrollbar thumb
            "&:hover": {
              background: "#555", // Scrollbar thumb hover color
            },
          },
          // border: "2px solid green",
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
