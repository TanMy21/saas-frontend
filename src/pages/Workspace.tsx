import { Button, Typography } from "@mui/material";
import DashBoardHeader from "../components/DashBoardHeader";
import { Link } from "react-router-dom";
// import useAuth from "../hooks/useAuth";

const Workspace = () => {
  return (
    <>
      <DashBoardHeader />
      <Typography variant="h1" component="h2">
        Create New Survey
      </Typography>

      <Link to="/dash" style={{ textDecoration: "none", color: "white" }}>
        <Button
          style={{ backgroundColor: "#0068FF" }}
          variant="contained"
          size="large"
        >
          Back
        </Button>
      </Link>
    </>
  );
};

export default Workspace;
