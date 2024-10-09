import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, CircularProgress, Grid } from "@mui/material";
import { ErrorData } from "../utils/types";
import { useGetWorkspacesQuery } from "../app/slices/workspaceApiSlice";
import DashBoardHeader from "../components/DashBoardHeader";
import Workspaces from "../components/Workspaces/Workspaces";
import { useGetMeQuery } from "../app/slices/userApiSlice";
import WorkspacesNotFound from "../components/Workspaces/WorkspacesNotFound";
import NewWorkspaceModal from "../components/Modals/NewWorkspaceModal";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useGetMeQuery("User", {
    refetchOnMountOrArgChange: true,
  });

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

  useEffect(() => {
    if (isAuthenticated) {
      refetchUser();
    }
  }, [isAuthenticated, user]);

  return (
    <>
      <Box
        sx={{
          overflowX: "hidden",
          overflowY: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        <Grid container>
          <Grid
            item
            display={"flex"}
            flexDirection={"row"}
            xs={12}
            sx={{
              position: "sticky",
              top: "0",
              width: "100%",
              // height: "5vh",
              zIndex: "5",
            }}
          >
            <DashBoardHeader />
          </Grid>
          <Grid
            item
            xl={12}
            lg={12}
            md={12}
            xs={12}
            display={"flex"}
            flexDirection={"row"}
            zIndex={1}
            sx={{
              width: "100%",
              minHeight: "95vh",
              overflowX: "hidden",
              overflowY: "hidden",
            }}
          >
            {/* content area */}
            {/* Left Sidebar Workspaces*/}
            <Grid
              item
              xl={2}
              lg={2}
              md={2}
              xs={2}
              sx={{
                background: "white",
                position: "sticky",
                top: "5vh",
                left: "0",
                zIndex: "5",
              }}
            >
              {isLoadingWorkspaces ? (
                <CircularProgress />
              ) : (
                <Workspaces workspaces={workspaces} handleOpen={handleOpen} />
              )}
            </Grid>
            {/* Main content area */}
            <Grid
              item
              xl={10}
              lg={10}
              md={10}
              xs={10}
              sx={{
                background: "#EBEBEB",
                flexGrow: 1,
                width: "80%",
                minHeight: "95vh",
                overflowY: "auto",
                overflowX: "hidden",
                "&::-webkit-scrollbar": {
                  width: "10px", // Scrollbar width
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1", // Scrollbar track color
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#61A5D2", // Scrollbar thumb color
                  borderRadius: "10px", // Rounded corners on the scrollbar thumb
                  "&:hover": {
                    background: "#555", // Scrollbar thumb hover color
                  },
                },
                // border: "2px solid red",
              }}
            >
              {workspaces?.length === 0 ? (
                <WorkspacesNotFound handleOpen={handleOpen} />
              ) : (
                <Outlet context={{ workspaces }} />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <NewWorkspaceModal open={open} setOpen={setOpen} />
    </>
  );
};

export default Dashboard;
