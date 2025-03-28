import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchUser, selectUser } from "../app/slices/userSlice";
import { useGetWorkspacesQuery } from "../app/slices/workspaceApiSlice";
import { AppDispatch } from "../app/store";
import DashBoardHeader from "../components/DashBoardHeader";
import DeleteWorkspaceModal from "../components/Modals/DeleteWorkspaceModal";
import NewWorkspaceModal from "../components/Modals/NewWorkspaceModal";
import RenameWorkspaceModal from "../components/Modals/RenameWorkspaceModal";
import DashboardTour from "../components/Tour/DashboardTour";
import WorkspaceConsole from "../components/Workspaces/WorkspaceConsole";
import useAuth from "../hooks/useAuth";
import { ErrorData, Workspace } from "../utils/types";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const { isAuthenticated } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [runTour, setRunTour] = useState(false);
  const [newWorkspaceModalOpen, setNewWorkspaceModalOpen] = useState(false);
  const [renameWorkspaceModalOpen, setRenameWorkspaceModalOpen] =
    useState(false);
  const [deleteWorkspaceModalOpen, setDeleteWorkspaceModalOpen] =
    useState(false);
  const {
    data: workspaces,
    isLoading: isLoadingWorkspaces,
    isError: isErrorWorkspaces,
    error: workspaceError,
    isSuccess,
  } = useGetWorkspacesQuery("workspacesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>();

  useEffect(() => {
    if (isErrorWorkspaces) {
      const errorData = workspaceError as ErrorData;

      if (errorData?.data.status === 429) {
        toast.error(
          "Too many requests. Please wait for a minute and try again.",
          {
            position: "top-right",
          }
        );
      }

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
    if (isSuccess && workspaces?.length && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [isSuccess, workspaces, selectedWorkspace]);

  useEffect(() => {
    if (!user && isAuthenticated) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    setRunTour(true);
  }, []);

  if (!user) {
    return null;
  }

  const { tours } = user;
  const { hasCompletedDashboardTour, hasSkippedDashboardTour } = tours;

  let isTourEnabled = false;

  if (import.meta.env.VITE_ENABLE_TOUR === "true") {
    isTourEnabled = !hasCompletedDashboardTour && !hasSkippedDashboardTour;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          overflowY: "hidden",
          width: "100%",
          height: "100%",
          // border: "2px solid black",
        }}
      >
        {isTourEnabled && (
          <DashboardTour
            stepIndex={stepIndex}
            runTour={runTour}
            setStepIndex={setStepIndex}
            setRunTour={setRunTour}
          />
        )}

        <Box
          display={"flex"}
          flexDirection={"row"}
          sx={{
            position: "sticky",
            top: "0",
            width: "100%",
            zIndex: "5",
          }}
        >
          <DashBoardHeader
            selectedWorkspace={selectedWorkspace!}
            setSelectedWorkspace={setSelectedWorkspace}
            setNewWorkspaceModalOpen={setNewWorkspaceModalOpen}
            setRenameWorkspaceModalOpen={setRenameWorkspaceModalOpen}
            setDeleteWorkspaceModalOpen={setDeleteWorkspaceModalOpen}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            zIndex: 1,
            width: "100%",
            minHeight: "95vh",
            overflowX: "hidden",
            overflowY: "hidden",
          }}
        >
          {/* content area */}
          {/* Main content area */}
          <Box
            sx={{
              background: "#F9FAFB",
              flexGrow: 1,
              width: "100%",
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
            <Box
              sx={{
                display: "flex",
                margin: "auto",
                marginTop: "1%",
                width: "80%",
                height: "96%",
                // border: "2px solid green",
              }}
            >
              <WorkspaceConsole selectedWorkspace={selectedWorkspace!} />
            </Box>
          </Box>
        </Box>
      </Box>
      <NewWorkspaceModal
        open={newWorkspaceModalOpen}
        setOpen={setNewWorkspaceModalOpen}
      />
      {/* {workspaceId && workspaceName && ( */}
      <RenameWorkspaceModal
        open={renameWorkspaceModalOpen}
        onClose={() => setRenameWorkspaceModalOpen(false)}
        selectedWorkspace={selectedWorkspace!}
      />
      {/* )} */}
      <DeleteWorkspaceModal
        open={deleteWorkspaceModalOpen}
        onClose={() => setDeleteWorkspaceModalOpen(false)}
        selectedWorkspace={selectedWorkspace!}
      />
    </>
  );
};

export default Dashboard;
