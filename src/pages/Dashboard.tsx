import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchUser, selectUser } from "../app/slices/userSlice";
import { useGetWorkspacesQuery } from "../app/slices/workspaceApiSlice";
import { AppDispatch } from "../app/store";
import SpinnerBackdrop from "../components/alert/SpinnerBackdrop";
import { DashBoardHeader } from "../components/DashBoardHeader";
import DeleteWorkspaceModal from "../components/Modals/DeleteWorkspaceModal";
import NewWorkspaceModal from "../components/Modals/NewWorkspaceModal";
import RenameWorkspaceModal from "../components/Modals/RenameWorkspaceModal";
import DashboardTour from "../components/Tour/DashboardTour";
import WorkspaceConsole from "../components/Workspaces/WorkspaceConsole";
import useAuth from "../hooks/useAuth";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useAppTheme } from "../theme/useAppTheme";
import { LAST_WS_KEY } from "../utils/constants";
import { ErrorData, Workspace } from "../utils/types";

const Dashboard = () => {
  const { background, brand } = useAppTheme();
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
    isError: isErrorWorkspaces,
    error: workspaceError,
    isSuccess,
  } = useGetWorkspacesQuery("workspacesList", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  useBodyScrollLock(true);
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
          toast.error(el.message, { position: "top-right" })
        );
      } else {
        toast.error(errorData.data.message, { position: "top-right" });
      }
    }
  }, [isErrorWorkspaces, workspaceError]);

  useEffect(() => {
    if (!isSuccess || !workspaces?.length) return;

    if (selectedWorkspace) return;

    try {
      const lastId = localStorage.getItem(LAST_WS_KEY);
      if (lastId) {
        const found = workspaces.find(
          (w: Workspace) => w.workspaceId === lastId
        );
        if (found) {
          setSelectedWorkspace(found);
          return;
        }
      }

      setSelectedWorkspace(workspaces[0]);
    } catch {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [isSuccess, workspaces, selectedWorkspace]);

  useEffect(() => {
    if (selectedWorkspace?.workspaceId) {
      try {
        localStorage.setItem(LAST_WS_KEY, selectedWorkspace.workspaceId);
      } catch {
        // ignore
      }
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    if (!workspaces || !workspaces.length) return;

    if (!selectedWorkspace) return;

    const stillExists = workspaces.some(
      (w: Workspace) => w.workspaceId === selectedWorkspace.workspaceId
    );
    if (!stillExists) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces, selectedWorkspace]);

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
          background: `linear-gradient(180deg, ${brand?.bgColor1 || "#f9fafb"} 0%, ${brand?.bgColor3 || "#F8F9FF"} 100%)`,
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
          sx={{
            display: "flex",
            position: "sticky",
            top: "0",
            width: "100%",
            zIndex: "5",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            backdropFilter: "saturate(120%)",
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
            background: background.paper,
            overflowX: "hidden",
            overflowY: "hidden",
          }}
        >
          {/* content area */}
          {/* Main content area */}
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              minHeight: "95vh",
              overflowY: "hidden",
              overflowX: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                margin: "auto",
                height: "96%",
                // border: "2px solid green",
                mt: { xs: "12px", sm: "1%" },
                width: {
                  xs: "94%",
                  sm: "92%",
                  md: "90%",
                  lg: "84%",
                  xl: "80%",
                },
                overflowX: "hidden",
                overflowY: "hidden",
                p: { xs: 1, sm: 1.5, md: 2 },
              }}
            >
              <WorkspaceConsole
                selectedWorkspace={selectedWorkspace!}
                setSelectedWorkspace={setSelectedWorkspace}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <NewWorkspaceModal
        open={newWorkspaceModalOpen}
        onClose={() => setNewWorkspaceModalOpen(false)}
      />

      <RenameWorkspaceModal
        open={renameWorkspaceModalOpen}
        onClose={() => setRenameWorkspaceModalOpen(false)}
        selectedWorkspace={selectedWorkspace!}
        setSelectedWorkspace={setSelectedWorkspace}
      />

      <DeleteWorkspaceModal
        open={deleteWorkspaceModalOpen}
        onClose={() => setDeleteWorkspaceModalOpen(false)}
        selectedWorkspace={selectedWorkspace!}
      />
      <SpinnerBackdrop />
    </>
  );
};

export default Dashboard;
