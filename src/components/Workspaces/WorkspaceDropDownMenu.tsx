import { useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  type Theme,
} from "@mui/material";
import { Trash } from "lucide-react";

import { WorkspaceDropDownMenu } from "../../utils/types";
import DeleteWorkspaceModal from "../Modals/DeleteWorkspaceModal";
import RenameWorkspaceModal from "../Modals/RenameWorkspaceModal";

const WorkspaceDropDown = ({
  selectedWorkspace,
  setSelectedWorkspace,
}: WorkspaceDropDownMenu) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const [openRenameModel, setOpenRenameModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  const handleOpenModalRename = () => {
    setOpenRenameModel(true);
    handleClose();
  };

  const handleOpenModalDelete = () => {
    setOpenDeleteModel(true);
    handleClose();
  };

  return (
    <Box id="workspace-dropdown-menu">
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          handleClick(e);
        }}
        sx={{
          // ✨ style: subtle, tactile icon button
          borderRadius: 2,
          p: 0.75,
          transition: "all .2s ease",
          "&:hover": {
            backgroundColor: (t: Theme) =>
              t.palette.mode === "dark"
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.06)",
            transform: "translateY(-1px)",
          },
          "&:active": { transform: "translateY(0)" },
        }}
      >
        <MoreHorizIcon />
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleClose}
        // ✨ style: cleaner placement
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        // ✨ style: smooth grow transition
        // TransitionComponent={OpenInFullIcon}
        // ✨ style: glassy paper with border & shadow
        PaperProps={{
          elevation: 0,
          sx: (t: Theme) => ({
            mt: 1,
            minWidth: 160,
            borderRadius: 2,
            boxShadow:
              t.palette.mode === "dark"
                ? "0 10px 24px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.06) inset"
                : "0 10px 24px rgba(0,0,0,.08), 0 1px 0 rgba(255,255,255,.6) inset",
            backdropFilter: "blur(6px)", // subtle glass
            overflow: "hidden",
          }),
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          // ✨ style: tighter vertical rhythm
          dense: true,
          sx: {
            py: 0.75,
          },
        }}
      >
        <MenuItem
          onClick={handleOpenModalRename}
          // ✨ style: add icon & hover/focus states
          sx={{
            gap: 1.25,
            px: 1.5,
            py: 1,
            "&:hover": {
              backgroundColor: (t: Theme) =>
                t.palette.mode === "dark"
                  ? "rgba(144,202,249,.12)"
                  : "rgba(25,118,210,.06)",
            },
            "& .MuiSvgIcon-root": { fontSize: 20, opacity: 0.9 },
          }}
        >
          <EditIcon style={{ color: "#005BC4" }} />{" "}
          <Typography sx={{ fontWeight: 500 }}>Rename</Typography>
        </MenuItem>

        <Divider
          // ✨ style: softer divider
          sx={{ my: 0.5, opacity: 0.7 }}
        />

        <MenuItem
          onClick={handleOpenModalDelete}
          // ✨ style: danger emphasis with gentle hover
          sx={{
            gap: 1.25,
            px: 1.5,
            py: 1,
            color: (t: Theme) =>
              t.palette.mode === "dark"
                ? t.palette.error.light
                : t.palette.error.main,
            "&:hover": {
              backgroundColor: (t: Theme) =>
                t.palette.mode === "dark"
                  ? "rgba(244, 67, 54, .12)"
                  : "rgba(244, 67, 54, .06)",
            },
            "& .MuiSvgIcon-root": { fontSize: 20, opacity: 0.95 },
          }}
        >
          <Trash style={{ marginTop: "-2%" }} />{" "}
          <Typography
            sx={{ fontWeight: 500, fontSize: 18, color: "#c52828ff" }}
          >
            {" "}
            Delete
          </Typography>
        </MenuItem>
      </Menu>

      {/* Remame Modal */}
      <RenameWorkspaceModal
        open={openRenameModel}
        onClose={() => setOpenRenameModel(false)}
        selectedWorkspace={selectedWorkspace}
        setSelectedWorkspace={setSelectedWorkspace}
      />
      {/* Delete Modal */}
      <DeleteWorkspaceModal
        open={openDeleteModel}
        onClose={() => setOpenDeleteModel(false)}
        selectedWorkspace={selectedWorkspace}
      />
    </Box>
  );
};
export default WorkspaceDropDown;
