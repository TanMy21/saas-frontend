import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { useSendLogoutMutation } from "../app/slices/authApiSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

const DashBoardHeader = () => {
  const navigate = useNavigate();

  const { email, isAdmin } = useAuth();

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

  const onLogoutClicked = () => {
    sendLogout();
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      sx={{ m: "0px", bgcolor: "white", borderBottom: 2, height: "48px" }}
    >
      <Stack direction="row" spacing={2}>
        <Box sx={{ width: "80%", height: "40px" }}>
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
        <Box sx={{ width: "20%", height: "40px" }}>
          <Button
            style={{
              backgroundColor: "#44546A",
              marginTop: "1%",
              marginLeft: "64%",
            }}
            variant="contained"
            size="medium"
            onClick={onLogoutClicked}
          >
            Logout
          </Button>
        </Box>
      </Stack>
    </AppBar>
  );
};

export default DashBoardHeader;
