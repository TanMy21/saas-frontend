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

import { useGetWorkspacesQuery } from "../../app/slices/workspaceApiSlice";
import { useElectricTheme } from "../../theme/useElectricTheme";
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
}: WorkspaceDropDownMenuProps) => {
  const { iconStyle, grey } = useElectricTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openWorkspaceMenu = Boolean(anchorEl);

  const { data: workspaces } = useGetWorkspacesQuery("workspacesList");

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
            {workspaces?.map((workspace: Workspace) => (
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
            <Divider />
            <NewWorkspaceMenuOption
              setAnchorEl={setAnchorEl}
              setOpenModal={setNewWorkspaceModalOpen}
            />
            <RenameWorkspaceMenuOption
              workspaceId={selectedWorkspace?.workspaceId}
              workspaceName={selectedWorkspace?.name}
              setAnchorEl={setAnchorEl}
              setOpenModal={setRenameWorkspaceModalOpen}
            />
            <DeleteWorkspaceMenuOption
              workspaceId={selectedWorkspace?.workspaceId}
              workspaceName={selectedWorkspace?.name}
              setAnchorEl={setAnchorEl}
              setOpenModal={setDeleteWorkspaceModalOpen}
            />
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default WorkspacesDropDownMenu;
