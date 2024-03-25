import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";

const SurveyCardDropDownMenu = ({ survey }) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(menuAnchor);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleClose = (option: string) => {
    setMenuAnchor(null);
  };
  return (
    <>
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
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        
      >
        <MenuItem sx={{ width: 200 }}>Open</MenuItem>
        <MenuItem>Copy Link</MenuItem>
        <Divider />
        <MenuItem>Share</MenuItem>
        <MenuItem>Results</MenuItem>
        <Divider />
        <MenuItem>Rename</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Copy To</MenuItem>
        <MenuItem>Move To</MenuItem>
        <Divider />
        <MenuItem sx={{ color: "red" }}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default SurveyCardDropDownMenu;
