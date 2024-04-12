import { Avatar, Box, Grid, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import HeaderIconMenu from "./HeaderIconMenu";
import useAuth from "../hooks/useAuth";

const DashBoardHeader = () => {
  const { email } = useAuth();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        m: "0px",
        bgcolor: "white",
        borderBottom: 1,
        borderColor: "#EDEDED",
        width: "100%",
        height: "48px",
      }}
    >
      <Grid
        container
        xs={12}
        display={"flex"}
        direction={"row"}
        alignItems={"center"}
        sx={{ width: "100%", height: "100%" }}
      >
        <Grid item xs={6} sx={{ width: "100%", height: "100%" }}>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"start"}
            alignContent={"center"}
            sx={{ width: "20%", height: "100%" }}
          >
            <Box ml={2}>
              <Avatar
                sx={{
                  bgcolor: "#44546A",
                  color: "white",
                  width: 32,
                  height: 32,
                  marginTop: "5px",
                }}
                variant="rounded"
              >
                {email?.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  color: "black",
                  padding: "8px",
                }}
                ml={2}
              >
                {email}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sx={{ width: "100%", height: "100%" }}>
          <Box
            display={"flex"}
            justifyContent={"end"}
            alignContent={"center"}
            sx={{ width: "100%", height: "100%" }}
          >
            <HeaderIconMenu />
          </Box>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default DashBoardHeader;
