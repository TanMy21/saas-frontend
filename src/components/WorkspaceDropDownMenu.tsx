import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Workspace } from "../utils/types";
import RenameWorkspaceModal from "./Modals/RenameWorkspaceModal";
import DeleteWorkspaceModal from "./Modals/DeleteWorkspaceModal";

const WorkspaceDropDown = ({ workspaceName: wsName }: Workspace) => {
  const { workspaceId: wsID } = useParams();

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
      <Box>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
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
        {/* /* Modal **/}
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
