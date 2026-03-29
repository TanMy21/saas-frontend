import { Box } from "@mui/material";

import { SurveysCollectionProps } from "../../utils/types";

import GridLayout from "./GridLayout";
import ListLayout from "./ListLayout";

const SurveysCollection = ({
  surveys,
  workspaceId,
  workspaceName,
  viewMode,
  isArchiveWorkspace,
}: SurveysCollectionProps) => {
  const layoutContainerHeightLG = viewMode === "list" ? "72vh" : "72%";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        margin: "auto",
        marginTop: { md: "2%", xl: "1%" },
        width: "98%",
        height: { md: "72%", lg: layoutContainerHeightLG, xl: "92%" },
      }}
    >
      {viewMode === "grid" ? (
        <GridLayout
          surveys={surveys}
          workspaceId={workspaceId!}
          workspaceName={workspaceName!}
          viewMode={viewMode}
          isArchiveWorkspace={isArchiveWorkspace}
        />
      ) : (
        <ListLayout
          surveys={surveys}
          workspaceId={workspaceId!}
          workspaceName={workspaceName!}
          viewMode={viewMode!}
          isArchiveWorkspace={isArchiveWorkspace}
        />
      )}
    </Box>
  );
};

export default SurveysCollection;
