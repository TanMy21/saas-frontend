import { Box, ListItemText } from "@mui/material";
import { useGetWorkspaceSurveysQuery } from "../app/slices/workspaceApiSlice";
import { Workspace } from "../utils/types";

const WorkspaceSurveysListCount = ({ workspaceId }: Workspace) => {
  const { data: surveys } = useGetWorkspaceSurveysQuery(workspaceId);

  return (
    <>
      <Box>
        <ListItemText primary={surveys?.length} />
      </Box>
    </>
  );
};
export default WorkspaceSurveysListCount;
