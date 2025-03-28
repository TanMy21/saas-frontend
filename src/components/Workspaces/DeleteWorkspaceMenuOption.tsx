import DeleteIcon from "@mui/icons-material/Delete";
import { MenuItem } from "@mui/material";

import { WorkspaceMenuOptionsProps } from "../../utils/types";

const DeleteWorkspaceMenuOption = ({
  setAnchorEl,
  setOpenModal,
}: WorkspaceMenuOptionsProps) => {
  const handleClick = () => {
    setAnchorEl(null);

    setTimeout(() => {
      setOpenModal(true);
    }, 150);
  };
  return (
    <>
      <MenuItem
        onClick={handleClick}
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          color: "red",
          fontWeight: "500",
          gap: 1,
        }}
      >
        <DeleteIcon fontSize="small" />
        Delete workspace
      </MenuItem>
    </>
  );
};

export default DeleteWorkspaceMenuOption;
