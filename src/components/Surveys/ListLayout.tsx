import { Box } from "@mui/material";

import { WorkspaceLayoutProps } from "../../utils/types";

import CreateNewSurveyCard from "./CreateNewSurveyCard";
import SurveyListCard from "./SurveyListCard";

const ListLayout = ({
  surveys,
  workspaceId,
  workspaceName,
}: WorkspaceLayoutProps) => {
  return (
    <>
      <Box
        sx={{
          marginTop: "1%",
          width: "100%",
          height: { lg: "96%", xl: "96%" },
          // overflowY: "hidden",
          // overflowX: "hidden",
          // "&::-webkit-scrollbar": {
          //   width: "10px", // Scrollbar width
          // },
          // "&::-webkit-scrollbar-track": {
          //   background: "#f1f1f1", // Scrollbar track color
          // },
          // "&::-webkit-scrollbar-thumb": {
          //   background: "#61A5D2", // Scrollbar thumb color
          //   borderRadius: "10px", // Rounded corners on the scrollbar thumb
          //   "&:hover": {
          //     background: "#555", // Scrollbar thumb hover color
          //   },
          // },
          // border: "2px solid green",
        }}
      >
        <CreateNewSurveyCard
          workspaceId={workspaceId}
          workspaceName={workspaceName}
          viewMode={"list"}
        />
        {/* Rows */}
        {surveys.map((survey) => (
          <SurveyListCard
            key={survey.surveyID}
            survey={survey}
            workspaceId={workspaceId}
            workspaceName={workspaceName}
          />
        ))}
      </Box>
    </>
  );
};

export default ListLayout;
