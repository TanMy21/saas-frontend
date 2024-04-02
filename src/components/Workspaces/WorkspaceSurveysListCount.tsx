import { Box, ListItemText } from "@mui/material";
import { useGetWorkspaceSurveysQuery } from "../../app/slices/workspaceApiSlice";
import { WorkspaceSurveysListCountProps } from "../../utils/types";

const WorkspaceSurveysListCount = ({
  workspaceId,
}: WorkspaceSurveysListCountProps) => {
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
