import AddIcon from "@mui/icons-material/Add";
import { MenuItem } from "@mui/material";

import { useAppTheme } from "../../theme/useAppTheme";
import { NewWorkspaceMenuOptionProps } from "../../utils/types";

const NewWorkspaceMenuOption = ({
  setAnchorEl,
  setOpenModal,
}: NewWorkspaceMenuOptionProps) => {
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
        mt: 0.5,
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
      <AddIcon fontSize="small" />
      Create workspace
    </MenuItem>
  );
};

export default NewWorkspaceMenuOption;
