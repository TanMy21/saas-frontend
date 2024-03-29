import { Avatar, Box, Stack, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import HeaderIconMenu from "./HeaderIconMenu";
import useAuth from "../hooks/useAuth";

const DashBoardHeader = () => {
  const { email } = useAuth();

  return (
    <AppBar
      position="static"
      sx={{ m: "0px", bgcolor: "white", borderBottom: 2, height: "48px" }}
    >
      <Stack direction="row" spacing={2}>
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"start"}
          alignContent={"center"}
          sx={{ width: "80%", height: "40px" }}
        >
          <Box ml={2}>
            <Avatar
              sx={{
                bgcolor: "#44546A",
                color: "white",
                width: 32,
                height: 32,
                marginTop: "8px",
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
        <Box
          display={"flex"}
          justifyContent={"end"}
          alignContent={"center"}
          sx={{ width: "16%", height: "40px", marginTop: "8%" }}
        >
          <HeaderIconMenu />
        </Box>
      </Stack>
    </AppBar>
  );
};

export default DashBoardHeader;
