import { Box, Grid } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

import { useGetElementsForSurveyQuery } from "../app/slices/elementApiSlice";
import QuestionFlowContainer from "../components/Flow/QuestionFlowContainer";
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import { LocationStateProps, Survey } from "../utils/types";

const QuestionFlow = () => {
  const { surveyID } = useParams();
  const location = useLocation();
  const { headerProps } = (location.state as LocationStateProps) || {};
  const { tabValue, survey, workspaceId, workspaceName } = headerProps || {};
  const { title } = (survey as Survey) || "";

  const { data } = useGetElementsForSurveyQuery(surveyID!);

  console.log("Data: ", data);

  return (
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
          justifyContent={"center"}
          sx={{
            width: "100%",
            minHeight: "90vh",
            overflowX: "hidden",
            overflowY: "auto",
            border: "2px solid green",
          }}
        >
          {/* Main content area */}
          <QuestionFlowContainer Elements={data!} surveyID={surveyID!} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionFlow;
