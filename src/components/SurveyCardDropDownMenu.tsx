import { useState } from "react";
import { Box, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useGetWorkspacesQuery } from "../app/slices/workspaceApiSlice";
import { Workspace } from "../utils/types";

const SurveyCardDropDownMenu = (/*{ survey }*/) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [currentMenu, setCurrentMenu] = useState<string | null>("parent");
  const open = Boolean(menuAnchor);

  const { data: workspaces } = useGetWorkspacesQuery("workspacesList", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
    setCurrentMenu("parent");
  };

  const handleNestedOpen = (menuName: string) => {
    setCurrentMenu(menuName);
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
        {/* Parent Menu */}
        {currentMenu === "parent" && (
          <Box>
            <MenuItem sx={{ width: 200 }}>Open</MenuItem>
            <MenuItem>Copy Link</MenuItem>
            <Divider />
            <MenuItem>Share</MenuItem>
            <MenuItem>Results</MenuItem>
            <Divider />
            <MenuItem>Rename</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem onClick={() => handleNestedOpen("copy to")}>
              <Box display={"flex"}>
                <Box>Copy To</Box>
                <Box ml={12}>
                  <ChevronRightIcon />
                </Box>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleNestedOpen("move to")}>
              <Box display={"flex"}>
                <Box>Move To</Box>
                <Box ml={12}>
                  <ChevronRightIcon />
                </Box>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem sx={{ color: "red" }}>Delete</MenuItem>
          </Box>
        )}
        {/* Nested Copy To Menu */}
        {currentMenu === "copy to" && (
          <Box>
            <MenuItem
              onClick={() => setCurrentMenu("parent")}
              sx={{ width: 200 }}
            >
              <Box display={"flex"}>
                <Box mr={1}>
                  <ChevronLeftIcon />
                </Box>
                <Box>Copy To</Box>
              </Box>
            </MenuItem>
            <Divider />
            {workspaces?.map((workspace: Workspace) => (
              <MenuItem>{workspace.name}</MenuItem>
            ))}
          </Box>
        )}

        {/* Nested Move To Menu */}
        {currentMenu === "move to" && (
          <Box>
            <MenuItem
              onClick={() => setCurrentMenu("parent")}
              sx={{ width: 200 }}
            >
              <Box display={"flex"}>
                <Box mr={1}>
                  <ChevronLeftIcon />
                </Box>
                <Box>Move To</Box>
              </Box>
            </MenuItem>
            <Divider />
            {workspaces?.map((workspace: Workspace) => (
              <MenuItem key={workspace.workspaceId}>{workspace.name}</MenuItem>
            ))}
          </Box>
        )}
      </Menu>
    </>
  );
};

export default SurveyCardDropDownMenu;
