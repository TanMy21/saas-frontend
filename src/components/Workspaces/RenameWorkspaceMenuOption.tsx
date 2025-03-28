import EditIcon from "@mui/icons-material/Edit";
import { MenuItem } from "@mui/material";

import { WorkspaceMenuOptionsProps } from "../../utils/types";

const RenameWorkspaceMenuOption = ({
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
          color: "purple",
          fontWeight: "500",
          gap: 1,
        }}
      >
        <EditIcon fontSize="small" />
        Rename workspace
      </MenuItem>
    </>
  );
};

export default RenameWorkspaceMenuOption;
