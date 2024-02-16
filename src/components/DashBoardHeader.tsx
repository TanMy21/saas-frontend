import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { useSendLogoutMutation } from "../app/slices/authApiSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DashBoardHeader = () => {
  const navigate = useNavigate();

  const [
    sendLogout,
    {
      isSuccess: isSuccessLogout,
      // isError: isErrorLogout,
      // // error
    },
  ] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccessLogout) navigate("/");
  }, [isSuccessLogout, navigate]);

  const onLogoutClicked = () => sendLogout();

  return (
    <AppBar
      position="static"
      sx={{ m: "0px", bgcolor: "white", borderBottom: 2, height: "64px" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 0 }}>
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"flex-end"}
              sx={{ width: "85vw" }}
            >
              <Button
                style={{ backgroundColor: "#44546A" }}
                variant="contained"
                size="large"
                onClick={onLogoutClicked}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DashBoardHeader;
