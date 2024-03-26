import { Grid, Paper } from "@mui/material";
import DashBoardHeader from "../components/DashBoardHeader";
import { Outlet } from "react-router-dom";
import Workspaces from "../components/Workspaces";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useGetWorkspacesQuery } from "../app/slices/workspaceApiSlice";

const Dashboard = () => {
  const {
    data: workspaces,
    // isLoading: isLoadingWorkspaces,
    // isSuccess: isSuccessWorkspaces,
    // isError: isErrorWorkspaces,
    // error: workspaceError,
  } = useGetWorkspacesQuery("workspacesList", {
    pollingInterval: 2000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <>
      <Grid container direction={"column"}>
        <Grid
          item
          xs={16}
          sx={{ background: "blue", height: "5vh", zIndex: "20" }}
        >
          <DashBoardHeader />
        </Grid>
        <Grid item container direction={"row"}>
          <Grid item sx={{ background: "red", height: "100vh", width: "12%" }}>
            <Paper
              elevation={1}
              square={true}
              style={{
                background: "white",
                height: "100vh",
                position: "sticky",
              }}
            >
              <Workspaces workspaces={workspaces} />
            </Paper>
          </Grid>
          <Grid
            item
            sx={{ background: "#EDEDED", height: "100vh", width: "88%" }}
          >
            <Outlet context={{ workspaces }} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
