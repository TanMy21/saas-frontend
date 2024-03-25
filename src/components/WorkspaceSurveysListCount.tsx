import { Box } from "@mui/material";
import { ListItemText } from "@mui/material";
import { useGetWorkspaceSurveysQuery } from "../app/slices/workspaceApiSlice";
const WorkspaceSurveysListCount = ({ workspaceId }) => {
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
