// import { useLocation } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import SurveyBuilderHeader from "../components/SurveyBuilderHeader";

const SurveyBuilder = () => {
  // const navigate = useNavigate();
  // const location = useLocation();
  // const { workspaceId } = location.state || {};
  return (
    <>
      <Grid container direction={"column"}>
        <Grid
          item
          xs={12}
          sx={{
            bgcolor: "blue",
            width: "100%",
            height: "5vh",
            zIndex: "10",
            position: "sticky",
            top: "0",
          }}
        >
          <SurveyBuilderHeader />
        </Grid>
        <Grid
          item
          container
          direction={"row"}
          sx={{ background: "red", width: "100%", minHeight: "95vh" }}
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
            <Box />
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
