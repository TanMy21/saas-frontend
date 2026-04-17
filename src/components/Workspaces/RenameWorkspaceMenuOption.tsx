import EditIcon from "@mui/icons-material/Edit";
import { MenuItem } from "@mui/material";

import { useAppTheme } from "../../theme/useAppTheme";
import { WorkspaceMenuOptionsProps } from "../../utils/types";

const RenameWorkspaceMenuOption = ({
  setAnchorEl,
  setOpenModal,
}: WorkspaceMenuOptionsProps) => {
  const { primary } = useAppTheme();
  const handleClick = () => {
    setAnchorEl(null);

    setTimeout(() => {
      setOpenModal(true);
    }, 150);
  };
  return (
    <MenuItem
      onClick={handleClick}
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        color: primary.main,
        fontWeight: "500",
        gap: 1,
        mx: 1,
        my: 0.4,
        borderRadius: "8px",
        "&:hover": {
          borderRadius: "12px",
        },
        "&.Mui-selected": {
          borderRadius: "12px",
        },
        "&.Mui-selected:hover": {
          borderRadius: "12px",
        },
      }}
    >
      <EditIcon fontSize="small" />
      Rename workspace
    </MenuItem>
  );
};

export default RenameWorkspaceMenuOption;
