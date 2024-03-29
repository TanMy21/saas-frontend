import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress, Grid, Paper } from "@mui/material";
import { ErrorData } from "../utils/types";
import { useGetWorkspacesQuery } from "../app/slices/workspaceApiSlice";
import DashBoardHeader from "../components/DashBoardHeader";
import Workspaces from "../components/Workspaces";

const Dashboard = () => {
  const {
    data: workspaces,
    isLoading: isLoadingWorkspaces,
    isError: isErrorWorkspaces,
    error: workspaceError,
  } = useGetWorkspacesQuery("workspacesList", {
    pollingInterval: 5000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isErrorWorkspaces) {
      const errorData = workspaceError as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isErrorWorkspaces, workspaceError]);

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
              {isLoadingWorkspaces ? (
                <CircularProgress />
              ) : (
                <Workspaces workspaces={workspaces} />
              )}
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
