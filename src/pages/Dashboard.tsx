import { Button, Typography } from "@mui/material";
import DashBoardHeader from "../components/DashBoardHeader";
import { Link, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../app/slices/authApiSlice";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();

  const { email, isAdmin, isAuthenticated } = useAuth();

  const [
    sendLogout,
    {
      isLoading,
      isSuccess,
      isError,
      // error
    },
  ] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  const onLogoutClicked = () => sendLogout();

  if (isLoading) return <p>Logging Out...</p>;

  if (isError) return <p>Error: </p>;

  return (
    <>
      <DashBoardHeader />
      <Typography variant="h1" component="h2">
        Dashboard
      </Typography>
      <Typography variant="h5" component="h2">
        {email}
      </Typography>
      <Typography variant="h5" component="h2">
        {isAdmin ? "Admin" : "Not Admin"}
      </Typography>
      <Typography variant="h5" component="h2">
        {isAuthenticated ? "Authenticated" : "Not Authenticated"}
      </Typography>
      <Link to="/profile" style={{ textDecoration: "none", color: "white" }}>
        <Button
          style={{ backgroundColor: "#0068FF" }}
          variant="contained"
          size="large"
        >
          Profile
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
    </>
  );
};

export default Dashboard;
