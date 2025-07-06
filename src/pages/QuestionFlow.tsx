import { Box, Grid } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

import { useGetElementsForSurveyQuery } from "../app/slices/elementApiSlice";
import { RootState } from "../app/store";
import { useAppSelector } from "../app/typedReduxHooks";
import QuestionFlowContainer from "../components/Flow/QuestionFlowContainer";
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import { LocationStateProps } from "../utils/types";

const QuestionFlow = () => {
  const location = useLocation();
  const params = useParams();
  const { headerProps } = (location.state as LocationStateProps) || {};
  const { survey, workspaceId, workspaceName } = headerProps || {};

  const surveyCanvas = useAppSelector(
    (state: RootState) => state.surveyCanvas.data
  );
  const { getSurveyCanvas } = surveyCanvas ?? {};
  const { surveyID: flowSurveyID, title } = getSurveyCanvas ?? {};

  const surveyID = flowSurveyID ?? params.surveyID;

  const { data } = useGetElementsForSurveyQuery(surveyID);

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
          <QuestionFlowContainer Elements={data!} surveyID={surveyID} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionFlow;
