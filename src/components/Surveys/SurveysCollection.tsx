import { Box } from "@mui/material";

import { SurveysCollectionProps } from "../../utils/types";

import GridLayout from "./GridLayout";
import ListLayout from "./ListLayout";

const COMPACT_1366_MEDIA_QUERY =
  "@media (min-width: 1360px) and (max-width: 1370px) and (max-height: 740px)";

const SurveysCollection = ({
  surveys,
  workspaceId,
  workspaceName,
  viewMode,
  isArchiveWorkspace,
  isSurveyLimitReached = false,
}: SurveysCollectionProps) => {
  const layoutContainerHeightLG = viewMode === "list" ? "72vh" : "72%";

  return (
    <Box component="div"
      sx={{
        display: "flex",
        flexDirection: "row",
        margin: "auto",
        marginTop: { md: "2%", xl: "1%" },
        width: "98%",
        height: { md: "72%", lg: layoutContainerHeightLG, xl: "92%" },
        [COMPACT_1366_MEDIA_QUERY]: {
          paddingTop: "8px",
        },
      }}
    >
      {viewMode === "grid" ? (
        <GridLayout
          surveys={surveys}
          workspaceId={workspaceId!}
          workspaceName={workspaceName!}
          viewMode={viewMode}
          isArchiveWorkspace={isArchiveWorkspace}
          isSurveyLimitReached={isSurveyLimitReached}
        />
      ) : (
        <ListLayout
          surveys={surveys}
          workspaceId={workspaceId!}
          workspaceName={workspaceName!}
          viewMode={viewMode!}
          isArchiveWorkspace={isArchiveWorkspace}
          isSurveyLimitReached={isSurveyLimitReached}
        />
      )}
    </Box>
  );
};

export default SurveysCollection;
