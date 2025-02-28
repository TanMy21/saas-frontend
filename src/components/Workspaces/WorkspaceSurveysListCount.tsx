import { Box } from "@mui/material";

import { useGetWorkspaceSurveysQuery } from "../../app/slices/workspaceApiSlice";
import { WorkspaceSurveysListCountProps } from "../../utils/types";

const WorkspaceSurveysListCount = ({
  workspaceId,
}: WorkspaceSurveysListCountProps) => {
  const { data: surveys } = useGetWorkspaceSurveysQuery(workspaceId);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1%",
          width: "40px",
          height: "32px",
          borderRadius: "32px",
          backgroundColor: "#E1E8FF",
          fontWeight: 800,
          color: "#4C6FFF",
        }}
      >
        {surveys?.length}
      </Box>
    </>
  );
};
export default WorkspaceSurveysListCount;
