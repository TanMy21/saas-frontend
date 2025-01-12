import { useState } from "react";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";

import {
  WorkspaceData,
  WorkspaceDropdownOutletContextType,
} from "../../utils/types";
import DeleteWorkspaceModal from "../Modals/DeleteWorkspaceModal";
import RenameWorkspaceModal from "../Modals/RenameWorkspaceModal";

const WorkspaceDropDown = ({ workspaceName: wsName }: WorkspaceData) => {
  const { workspaceId: wsID } = useParams();

  const { setStepIndex } =
    useOutletContext<WorkspaceDropdownOutletContextType>();

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
    <>
      <Box id="workspace-dropdown-menu">
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            console.log("dropdown clicked");
            setStepIndex((prev) => prev + 1);
            handleClick(e);
          }}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleOpenModalRename}>Rename</MenuItem>
          <Divider />
          <MenuItem sx={{ color: "red" }} onClick={handleOpenModalDelete}>
            Delete
          </MenuItem>
        </Menu>
        {/* Remame Modal */}
        <RenameWorkspaceModal
          open={openRenameModel}
          onClose={() => setOpenRenameModel(false)}
          workspaceId={wsID}
          workspaceName={wsName}
        />
        {/* Delete Modal */}
        <DeleteWorkspaceModal
          open={openDeleteModel}
          onClose={() => setOpenDeleteModel(false)}
          wsID={wsID}
          wsName={wsName}
        />
      </Box>
    </>
  );
};
export default WorkspaceDropDown;
