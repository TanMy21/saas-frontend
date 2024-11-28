import { Box, Grid, Typography } from "@mui/material";

import empty from "../../assets/empty.svg";
import { WorkspacesProp } from "../../utils/types";

import CreateNewWorkspaceBtn from "./CreateNewWorkspaceBtn";

const WorkspacesNotFound = ({ handleOpen }: WorkspacesProp) => {
  return (
    <>
      <Grid
        item
        sx={{
          marginTop: "8%",
          width: "400",
          height: "400",
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
              mb={4}
            >
              <CreateNewWorkspaceBtn handleOpen={handleOpen} />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyItems={"center"}
              alignItems={"center"}
              mt={8}
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
