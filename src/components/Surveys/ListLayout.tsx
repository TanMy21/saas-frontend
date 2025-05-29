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
