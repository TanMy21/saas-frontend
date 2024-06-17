import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { ElementDropDownMenuProps } from "../../../utils/types";
import { useDeleteElementMutation } from "../../../app/slices/elementApiSlice";

const ElementDropDownMenu = ({
  questionID,
  refetch,
}: ElementDropDownMenuProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const [deleteElement] = useDeleteElementMutation();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  const handleDuplicateElement = () => {
    // console.log("Duplicate Element: ", questionID);
  };

  const handleDeleteElement = async () => {
    try {
      await deleteElement(questionID).unwrap();
      setMenuAnchor(null);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ marginRight: "48%" }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          left: "2%",
          top: "-4%",
        }}
      >
        <MenuItem onClick={handleDuplicateElement}>Duplicate</MenuItem>
        <MenuItem onClick={handleDeleteElement} sx={{ color: "red" }}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default ElementDropDownMenu;
