// import { useLocation } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import { useGetSurveyByIdQuery } from "../app/slices/surveysApiSlice";
import { useLocation, useParams } from "react-router-dom";

const SurveyBuilder = () => {
  const { surveyID } = useParams();
  // const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId, workspaceName } = location.state || {};

  const { data: survey } = useGetSurveyByIdQuery(surveyID);

  return (
    <>
      <Grid container direction={"column"}>
        <Grid
          item
          xs={12}
          sx={{
            width: "100%",
            height: "5vh",
            zIndex: "10",
            position: "sticky",
            top: "0",
          }}
        >
          <SurveyBuilderHeader
            survey={survey}
            workspaceId={workspaceId}
            workspaceName={workspaceName}
          />
        </Grid>
        <Grid
          item
          container
          direction={"row"}
          sx={{ width: "100%", minHeight: "95vh" }}
        >
          {/* Left Sidebar */}
          <Grid
            item
            sx={{
              background: "white",
              width: "14%",
              borderRight: 1,
              borderColor: "#EDEDED",
            }}
          >
            <Box
              p={2}
              sx={{
                background: "white",
                height: "100vh",
                position: "fixed",
                top: "5vh",
              }}
            >
              Questions
            </Box>
          </Grid>
          <Grid
            item
            xs
            sx={{ bgcolor: "#EDEDED", height: "100vh", overflowY: "auto" }}
          >
            {/* Main content area */}
            <Box p={4}>
              <Typography variant="h5">
                Create Survey: {survey?.title}
              </Typography>
            </Box>
          </Grid>
          {/* Right Sidebar */}
          <Grid item sx={{ background: "white", width: "14%" }}>
            <Box
              p={2}
              sx={{
                background: "white",
                height: "100vh",
                position: "fixed",
                top: "5vh",
                right: "0",
              }}
            >
              Toolbar
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SurveyBuilder;
