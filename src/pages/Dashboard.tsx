import { useEffect, useMemo, useState } from "react";

import { Box } from "@mui/material";

import { closeFeedbackModal } from "../app/slices/feedbackSlice";
import { fetchUser, selectUser } from "../app/slices/userSlice";
import { useGetWorkspacesQuery } from "../app/slices/workspaceApiSlice";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";
import SpinnerBackdrop from "../components/alert/SpinnerBackdrop";
import { DashBoardHeader } from "../components/DashBoardHeader";
import DeleteWorkspaceModal from "../components/Modals/DeleteWorkspaceModal";
import FeedbackModal from "../components/Modals/FeedbackModal";
import NewWorkspaceModal from "../components/Modals/NewWorkspaceModal";
import RenameWorkspaceModal from "../components/Modals/RenameWorkspaceModal";
import DashboardTour from "../components/tour/DashboardTour";
import WorkspaceConsole from "../components/Workspaces/WorkspaceConsole";
import useAuth from "../hooks/useAuth";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useStoredState } from "../hooks/useStoredState";
import { useToast } from "../hooks/useToast";
import { useAppTheme } from "../theme/useAppTheme";
import { LAST_WS_KEY } from "../utils/constants";
import { Workspace } from "../utils/types";

const Dashboard = () => {
  const { background, brand } = useAppTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { isAuthenticated, can } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [runTour, setRunTour] = useState(false);
  const [newWorkspaceModalOpen, setNewWorkspaceModalOpen] = useState(false);
  const [renameWorkspaceModalOpen, setRenameWorkspaceModalOpen] =
    useState(false);
  const [deleteWorkspaceModalOpen, setDeleteWorkspaceModalOpen] =
    useState(false);
  const { isFeedbackModalOpen } = useAppSelector((state) => state.feedbackUI);

  const {
    data: workspaces,
    isError: isErrorWorkspaces,
    error: workspaceError,
  } = useGetWorkspacesQuery("workspacesList", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  useBodyScrollLock(true);

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useStoredState<
    string | null
  >(LAST_WS_KEY, null, (id) => {
    if (!workspaces?.length) return id;

    if (id && workspaces.some((w: Workspace) => w.workspaceId === id)) {
      return id;
    }

    const myWorkspace = workspaces.find(
      (w: Workspace) => w.name === "My Workspace",
    );
    if (myWorkspace) return myWorkspace.workspaceId;

    return workspaces[0].workspaceId;
  });

  const archiveWorkspace = workspaces?.find(
    (ws: Workspace) => ws.isArchiveWorkspace,
  );

  const archivedCount = archiveWorkspace?.archivedCount ?? 0;

  const selectedWorkspace = useMemo(() => {
    if (!workspaces?.length) return null;

    return (
      workspaces.find(
        (ws: Workspace) => ws.workspaceId === selectedWorkspaceId,
      ) || workspaces[0]
    );
  }, [workspaces, selectedWorkspaceId]);

  const handleSetWorkspace: React.Dispatch<
    React.SetStateAction<Workspace | undefined>
  > = (value) => {
    const resolvedValue =
      typeof value === "function" ? value(selectedWorkspace) : value;

    if (!resolvedValue) return;

    setSelectedWorkspaceId(resolvedValue.workspaceId!);
  };

  useEffect(() => {
    if (!workspaces?.length) return;

    const exists = workspaces.some(
      (ws: Workspace) => ws.workspaceId === selectedWorkspaceId,
    );

    if (!exists) {
      setSelectedWorkspaceId(workspaces[0]?.workspaceId ?? null);
    }
  }, [workspaces, selectedWorkspaceId]);

  useToast({
    isError: isErrorWorkspaces,
    error: workspaceError,
    errorFallbackMessage: "Could not load workspaces. Please try again.",
  });

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
            selectedWorkspace={selectedWorkspace}
            setSelectedWorkspace={handleSetWorkspace}
            setNewWorkspaceModalOpen={setNewWorkspaceModalOpen}
            setRenameWorkspaceModalOpen={setRenameWorkspaceModalOpen}
            setDeleteWorkspaceModalOpen={setDeleteWorkspaceModalOpen}
            archivedCount={archivedCount}
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
                selectedWorkspace={selectedWorkspace}
                setSelectedWorkspace={handleSetWorkspace}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {can?.("CREATE_WORKSPACE") && (
        <NewWorkspaceModal
          open={newWorkspaceModalOpen}
          onClose={() => setNewWorkspaceModalOpen(false)}
        />
      )}

      {can?.("UPDATE_WORKSPACE") && (
        <RenameWorkspaceModal
          open={renameWorkspaceModalOpen}
          onClose={() => setRenameWorkspaceModalOpen(false)}
          selectedWorkspace={selectedWorkspace}
          setSelectedWorkspace={handleSetWorkspace}
        />
      )}

      {can?.("DELETE_WORKSPACE") && (
        <DeleteWorkspaceModal
          open={deleteWorkspaceModalOpen}
          onClose={() => setDeleteWorkspaceModalOpen(false)}
          selectedWorkspace={selectedWorkspace}
        />
      )}

      <FeedbackModal
        open={isFeedbackModalOpen}
        onClose={() => dispatch(closeFeedbackModal())}
      />
      <SpinnerBackdrop />
    </>
  );
};

export default Dashboard;
