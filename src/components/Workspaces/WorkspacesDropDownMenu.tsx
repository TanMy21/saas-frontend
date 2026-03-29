import { useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Archive } from "lucide-react";

import { useGetWorkspacesQuery } from "../../app/slices/workspaceApiSlice";
import useAuth from "../../hooks/useAuth";
import { useAppTheme } from "../../theme/useAppTheme";
import { Workspace, WorkspaceDropDownMenuProps } from "../../utils/types";

import DeleteWorkspaceMenuOption from "./DeleteWorkspaceMenuOption";
import NewWorkspaceMenuOption from "./NewWorkspaceMenuOption";
import RenameWorkspaceMenuOption from "./RenameWorkspaceMenuOption";

const WorkspacesDropDownMenu = ({
  selectedWorkspace,
  setSelectedWorkspace,
  setNewWorkspaceModalOpen,
  setRenameWorkspaceModalOpen,
  setDeleteWorkspaceModalOpen,
  archivedCount = 0,
}: WorkspaceDropDownMenuProps) => {
  const { iconStyle, grey } = useAppTheme();
  const { can } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openWorkspaceMenu = Boolean(anchorEl);

  const { data: workspaces } = useGetWorkspacesQuery("workspacesList");
  const archiveWorkspace = workspaces?.find(
    (ws: Workspace) => ws.isArchiveWorkspace,
  );

  const hasArchived = !!archiveWorkspace;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ maxWidth: "360px", mx: "auto" }}>
      {/* Header with Dropdown */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ flex: 1, position: "relative" }}>
          <Button onClick={handleClick} variant="headerBtn1">
            {selectedWorkspace?.name || "Select Workspace"}
            <ExpandMoreIcon sx={iconStyle.expandMore} />
          </Button>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={openWorkspaceMenu}
            keepMounted={false}
            onClose={handleClose}
            sx={{
              mt: 1,
              "& .MuiPaper-root": {
                width: 280,
                borderRadius: 2,
                boxShadow: 3,
                border: "1px solid",
                borderColor: grey[300],
              },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" sx={{ color: grey[700] }}>
                YOUR WORKSPACES
              </Typography>
            </Box>
            {workspaces
              ?.filter((ws: Workspace) => !ws.isArchiveWorkspace)
              .map((workspace: Workspace) => (
                <MenuItem
                  key={workspace?.workspaceId}
                  selected={
                    workspace.workspaceId === selectedWorkspace?.workspaceId
                  }
                  onClick={() => {
                    setSelectedWorkspace(workspace);
                    handleClose();
                  }}
                  sx={{
                    // "&:hover": { bgcolor: "#A195F8" },
                    fontWeight:
                      workspace.workspaceId === selectedWorkspace?.workspaceId
                        ? "bold"
                        : "normal",
                  }}
                >
                  {workspace?.name}
                </MenuItem>
              ))}
            {hasArchived && archiveWorkspace && (
              <>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                  disabled={archivedCount === 0}
                  selected={
                    selectedWorkspace?.workspaceId ===
                    archiveWorkspace.workspaceId
                  }
                  onClick={() => {
                    setSelectedWorkspace(archiveWorkspace);
                    handleClose();
                  }}
                  sx={{
                    fontWeight:
                      selectedWorkspace?.workspaceId ===
                      archiveWorkspace.workspaceId
                        ? "bold"
                        : "normal",
                    color: "#6B7280",
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Archive fontSize="small" />
                  Archived{" "}
                  <Box sx={{ fontSize: 18, fontWeight: 600, }}>
                    {`(${archivedCount})`}
                  </Box>
                </MenuItem>
              </>
            )}
            {can("CREATE_WORKSPACE") && <Divider />}{" "}
            {can("CREATE_WORKSPACE") && (
              <NewWorkspaceMenuOption
                setAnchorEl={setAnchorEl}
                setOpenModal={setNewWorkspaceModalOpen}
              />
            )}
            {can?.("UPDATE_WORKSPACE") && (
              <RenameWorkspaceMenuOption
                workspaceId={selectedWorkspace?.workspaceId}
                workspaceName={selectedWorkspace?.name}
                setAnchorEl={setAnchorEl}
                setOpenModal={setRenameWorkspaceModalOpen}
              />
            )}
            {can?.("DELETE_WORKSPACE") && (
              <DeleteWorkspaceMenuOption
                workspaceId={selectedWorkspace?.workspaceId}
                workspaceName={selectedWorkspace?.name}
                setAnchorEl={setAnchorEl}
                setOpenModal={setDeleteWorkspaceModalOpen}
              />
            )}
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default WorkspacesDropDownMenu;
