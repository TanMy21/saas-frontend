import { Box, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";

import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import { LocationStateProps, Survey } from "../utils/types";

const QuestionFlow = () => {
  const location = useLocation();
  const { headerProps } = (location.state as LocationStateProps) || {};
  const { tabValue, survey, workspaceId, workspaceName } = headerProps || {};
  const { title } = (survey as Survey) || "";

  return (
    <>
      <Box
        sx={{
          overflowX: "hidden",
          overflowY: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        <Grid container>
          <Grid
            item
            display={"flex"}
            flexDirection={"row"}
            xs={12}
            sx={{
              position: "sticky",
              top: "0",
              width: "100%",
              zIndex: "10",
            }}
          >
            <SurveyBuilderHeader
              tabValue={tabValue}
              survey={survey!}
              workspaceId={workspaceId!}
              workspaceName={workspaceName!}
              title={title}
            />
          </Grid>
          <Grid
            item
            xl={12}
            lg={12}
            md={12}
            xs={12}
            display={"flex"}
            flexDirection={"row"}
            sx={{
              width: "100%",
              minHeight: "90%",
              overflowX: "hidden",
              overflowY: "auto",
              border: "2px solid green",
            }}
          >
            {/* Main content area */}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default QuestionFlow;
