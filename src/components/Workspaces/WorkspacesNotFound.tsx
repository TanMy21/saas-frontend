import { Box, Grid, Typography } from "@mui/material";
// import CreateNewSurveyBtn from "./CreateNewSurveyBtn";
import empty from "../../assets/empty.svg";
import CreateNewWorkspaceBtn from "./CreateNewWorkspaceBtn";

const WorkspacesNotFound = () => {
  return (
    <>
      <Grid
        item
        sx={{
          marginTop: "8%",
          width: "400",
          height: "400",
          border: "2px solid blue",
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyItems={"center"}
          alignItems={"center"}
          sx={{
            width: "80vw",
            height: "72vh",
          }}
        >
          <Box
            sx={{
              width: "80%",
              height: "88%",
            }}
          >
            <Box mt={2}>
              <Typography
                variant="h5"
                align="center"
                sx={{
                  fontSize: "36px",
                  fontWeight: "200",
                  fontFamily: "Roboto",
                }}
              >
                No workspace found
              </Typography>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyItems={"center"}
              alignItems={"center"}
              mt={2}
              mb={2}
            >
              <CreateNewWorkspaceBtn />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyItems={"center"}
              alignItems={"center"}
              border={"2px solid red"}
              mt={2}
            >
              <Box
                component={"img"}
                src={empty}
                alt="No workspace found"
                sx={{
                  width: "50%",
                  height: "40%",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default WorkspacesNotFound;
