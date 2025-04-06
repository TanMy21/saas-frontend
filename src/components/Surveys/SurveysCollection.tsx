import { Box } from "@mui/material";

import { SurveysCollectionProps } from "../../utils/types";

import GridLayout from "./GridLayout";
import ListLayout from "./ListLayout";

const SurveysCollection = ({
  surveys,
  workspaceId,
  workspaceName,
  viewMode,
}: SurveysCollectionProps) => {
  const layoutContainerMarginTopLG = viewMode === "list" ? "0%" : "0%";
  const layoutContainerHeightLG = viewMode === "list" ? "72vh" : "72%";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        margin: "auto",
        marginTop: { md: "0%", lg: layoutContainerMarginTopLG, xl: "0%" },
        width: "98%",
        height: { md: "84%", lg: layoutContainerHeightLG, xl: "84%" },
        // border: "2px solid red",
      }}
    >
      {viewMode === "grid" ? (
        <GridLayout
          surveys={surveys}
          workspaceId={workspaceId!}
          workspaceName={workspaceName!}
          viewMode={viewMode}
        />
      ) : (
        <ListLayout
          surveys={surveys}
          workspaceId={workspaceId!}
          workspaceName={workspaceName!}
          viewMode={viewMode!}
        />
      )}
    </Box>
  );
};

export default SurveysCollection;
