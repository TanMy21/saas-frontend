import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashBoardHeader from "../components/DashBoardHeader";
import { Link, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../app/slices/authApiSlice";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useGetMeQuery } from "../app/slices/userApiSlice";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";

const Dashboard = () => {
  const navigate = useNavigate();

  const { email: authEmail, isAdmin } = useAuth();

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useGetMeQuery("getMe", {
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [
    sendLogout,
    {
      isLoading: isLoadingLogout,
      isSuccess: isSuccessLogout,
      isError: isErrorLogout,
      // error
    },
  ] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccessLogout) navigate("/");
  }, [isSuccessLogout, navigate]);

  useEffect(() => {
    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: "top-right",
        });
      }
    }
  }, [isError]);

  const onLogoutClicked = () => sendLogout();

  if (isLoading) return <p>Logging Out...</p>;
  if (isLoadingLogout) return <p>Logging Out...</p>;

  if (isErrorLogout) return <p>Error: </p>;
  const { firstname, lastname, organization, verified, email } = profile;
  const drawerWidth = 240;
  const displayName = `${firstname}'${
    firstname.endsWith("s") ? "" : "s"
  } account`;

  return (
    <>
      <DashBoardHeader />
      <Box display="flex" flexDirection="row">
        <Box flexGrow={0} sx={{ width: "12%", height: "95vh", color: "green" }}>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <Toolbar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {email}
              </Typography>
            </Toolbar>
            <Divider />
            <List>
              {["Workspace 1", "Workspace 2", "Workspace 3", "Workspace 4"].map(
                (text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                )
              )}
            </List>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemText>
                  <Typography
                    variant="h6"
                    sx={{
                      ml: 2,
                      fontWeight: "medium",
                      fontFamily: "Monospace",
                    }}
                  >
                    {displayName}
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
          </Drawer>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h1" component="h2">
            Workspace
          </Typography>
          <Typography variant="h5" component="h2">
            Welcome, {firstname} {lastname}
          </Typography>
          <Typography variant="h5" component="h2">
            {organization}
          </Typography>
          <Typography variant="h5" component="h2">
            {verified ? "Verified" : "Not Verified "}
          </Typography>
          <Typography variant="h5" component="h2">
            {isAdmin ? "Admin" : "Not Admin"}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Link
              to="/workspace"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Button
                sx={{
                  backgroundColor: "#0068FF",
                  mr: 2,
                  textTransform: "capitalize",
                }}
                variant="contained"
                size="large"
              >
                <AddIcon />
                Create New Survey
              </Button>
            </Link>
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

        {/* <Box display="flex" flexDirection="column" flexGrow={1}>
          <Typography variant="h1" component="h2">
            Dashboard
          </Typography>
          <Typography variant="h5" component="h2">
            {firstname} {lastname}
          </Typography>
          <Typography variant="h5" component="h2">
            {email}
          </Typography>
          <Typography variant="h5" component="h2">
            {organization}
          </Typography>
          <Typography variant="h5" component="h2">
            {verified ? "Verified" : "Not Verified "}
          </Typography>
          <Typography variant="h5" component="h2">
            {isAdmin ? "Admin" : "Not Admin"}
          </Typography>
          <Typography variant="h5" component="h2">
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Typography>
          <Link
            to="/workspace"
            style={{ textDecoration: "none", color: "white" }}
          >
            <Button
              style={{ backgroundColor: "#0068FF" }}
              variant="contained"
              size="large"
            >
              Workspace
            </Button>
          </Link>
          <Button
            style={{ backgroundColor: "#44546A" }}
            variant="contained"
            size="large"
            onClick={onLogoutClicked}
          >
            Logout
          </Button>
        </Box> */}
      </Box>
    </>
  );
};

export default Dashboard;
