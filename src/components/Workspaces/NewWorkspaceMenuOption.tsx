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
    <>
      <MenuItem
        onClick={handleClick}
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          color: primary.main,
          fontWeight: "500",
          gap: 1,
        }}
      >
        <AddIcon fontSize="small" />
        Create new workspace
      </MenuItem>
    </>
  );
};

export default NewWorkspaceMenuOption;
