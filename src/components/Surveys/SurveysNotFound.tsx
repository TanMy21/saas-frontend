import { Box, Grid, Typography } from "@mui/material";

import notFound from "../../assets/notFound2.svg";

import CreateNewSurveyBtn from "./CreateNewSurveyBtn";

const SurveysNotFound = () => {
  return (
    <>
      <Grid item sx={{ width: "400", height: "400" }}>
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
                  fontSize: "24px",
                  fontWeight: "200",
                  fontFamily: "Roboto",
                }}
              >
                No surveys are visible
              </Typography>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyItems={"center"}
              alignItems={"center"}
              mt={1}
            >
              <CreateNewSurveyBtn />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyItems={"center"}
              alignItems={"center"}
              mt={1}
            >
              <Box
                component={"img"}
                src={notFound}
                alt="No record found"
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

export default SurveysNotFound;
