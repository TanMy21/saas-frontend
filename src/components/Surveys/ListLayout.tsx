import { Box } from "@mui/material";

import useAuth from "../../hooks/useAuth";
import { WorkspaceLayoutProps } from "../../utils/types";

import CreateNewSurveyCard from "./CreateNewSurveyCard";
import SurveyListCard from "./SurveyListCard";

const ListLayout = ({
  surveys,
  workspaceId,
  workspaceName,
}: WorkspaceLayoutProps) => {
  const { can } = useAuth();
  return (
    <Box
      sx={{
        marginTop: "1%",
        width: "100%",
        height: { lg: "96%", xl: "96%" },
      }}
    >
      {can?.("CREATE_SURVEY") && (
        <CreateNewSurveyCard
          workspaceId={workspaceId}
          workspaceName={workspaceName}
          viewMode={"list"}
        />
      )}

      {surveys.map((survey) => (
        <SurveyListCard
          key={survey.surveyID}
          survey={survey}
          workspaceId={workspaceId}
          workspaceName={workspaceName}
        />
      ))}
    </Box>
  );
};

export default ListLayout;
