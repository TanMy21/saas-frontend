import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, CircularProgress, Grid } from "@mui/material";
import { ErrorData } from "../utils/types";
import { useGetWorkspacesQuery } from "../app/slices/workspaceApiSlice";
import DashBoardHeader from "../components/DashBoardHeader";
import Workspaces from "../components/Workspaces/Workspaces";

const Dashboard = () => {
  const {
    data: workspaces,
    isLoading: isLoadingWorkspaces,
    isError: isErrorWorkspaces,
    error: workspaceError,
  } = useGetWorkspacesQuery("workspacesList", {
    pollingInterval: 15000,
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
          xs={12}
          sx={{
            width: "100%",
            height: "5vh",
            zIndex: "10",
            position: "sticky",
            top: "0",
          }}
        >
          <DashBoardHeader />
        </Grid>
        <Grid
          item
          container
          display={"flex"}
          direction={"row"}
          sx={{ width: "100%", minHeight: "95vh" }}
        >
          {/* Left Sidebar Workspaces*/}
          <Grid
            item
            container
            sx={{
              background: "white",
              width: "12%",
              borderRight: 1,
              borderColor: "#EDEDED",
            }}
          >
            <Box
              sx={{
                background: "white",
                width: "12%",
                height: "100vh",
                position: "fixed",
                top: "5vh",
              }}
            >
              {isLoadingWorkspaces ? (
                <CircularProgress />
              ) : (
                <Workspaces workspaces={workspaces} />
              )}
            </Box>
          </Grid>
          <Grid
            item
            sx={{
              bgcolor: "#EDEDED",
              minWidth: "88%",
              maxWidth: "88%",
              minHeight: "100vh",
              marginLeft: "12%",
              overflowX: "hidden",
            }}
          >
            {/* Main content area */}
            <Outlet context={{ workspaces }} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
