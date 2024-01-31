import { Button } from "@mui/material";
import DashBoardHeader from "../components/DashBoardHeader";
import { useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../app/slices/authApiSlice";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

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
      <div>Dashboard</div>
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
