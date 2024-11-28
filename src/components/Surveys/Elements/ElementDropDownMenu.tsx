import { useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";

import { useDeleteElementMutation } from "../../../app/slices/elementApiSlice";
import { ElementDropDownMenuProps } from "../../../utils/types";

const ElementDropDownMenu = ({
  questionID,
  elements,
  refetch,
  setQuestionId,
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

      const index = elements.findIndex((e) => e.questionID === questionID);

      if (index === 0 && elements.length > 1) {
        // If the deleted element is the first one, select the next element
        setQuestionId(elements[index + 1].questionID);
      } else if (index > 0) {
        // Select the previous element
        setQuestionId(elements[index - 1].questionID);
      } else {
        // No more elements left
        setQuestionId(null);
      }
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
