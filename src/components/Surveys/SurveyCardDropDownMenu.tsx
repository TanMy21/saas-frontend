import { useState } from "react";
import { Box, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useGetWorkspacesQuery } from "../../app/slices/workspaceApiSlice";
import {
  useDuplicateSurveyMutation,
  useCopySurveyMutation,
  useMoveSurveyMutation,
} from "../../app/slices/surveysApiSlice";
import { Workspace, SurveyDropDownMenuProps } from "../../utils/types";
import RenameSurveyModal from "../Modals/RenameSurveyModal";
import DeleteSurveyModal from "../Modals/DeleteSurveyModal";

const SurveyCardDropDownMenu = ({ survey }: SurveyDropDownMenuProps) => {
  const { surveyID } = survey;

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [currentMenu, setCurrentMenu] = useState<string | null>("parent");

  const [openRenameModel, setOpenRenameModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);

  const open = Boolean(menuAnchor);

  const { data: workspaces } = useGetWorkspacesQuery("workspacesList", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [duplicateSurvey] = useDuplicateSurveyMutation();
  const [copySurvey] = useCopySurveyMutation();
  const [moveSurvey] = useMoveSurveyMutation();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
    setCurrentMenu("parent");
  };

  const handleOpenModalRename = () => {
    setOpenRenameModel(true);
    handleClose();
  };

  const handleOpenModalDelete = () => {
    setOpenDeleteModel(true);
    handleClose();
  };

  const handleNestedOpen = (menuName: string) => {
    setCurrentMenu(menuName);
  };

  const handleCopyTo = async (wID: string) => {
    try {
      await copySurvey({ surveyID, workspaceId: wID });
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  const handleMoveTo = async (wID: string) => {
    try {
      await moveSurvey({ surveyID, workspaceId: wID });
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  const handleDuplicateSurvey = async (surveyID: string) => {
    try {
      await duplicateSurvey(surveyID);
    } catch (error) {
      console.log(error);
    }
    handleClose();
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
            <MenuItem onClick={handleOpenModalRename}>Rename</MenuItem>
            <MenuItem onClick={() => handleDuplicateSurvey(surveyID)}>
              Duplicate
            </MenuItem>
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
            <MenuItem onClick={handleOpenModalDelete} sx={{ color: "red" }}>
              Delete
            </MenuItem>
          </Box>
        )}
        {/* Nested Copy To Menu */}
        {currentMenu === "copy to" && (
          <Box>
            <MenuItem
              onClick={() => setCurrentMenu("parent")}
              sx={{ width: 200 }}
            >
              <Box display={"flex"} p={0}>
                <Box mr={1}>
                  <ChevronLeftIcon />
                </Box>
                <Box>Copy To</Box>
              </Box>
            </MenuItem>
            <Divider />
            {workspaces?.map((workspace: Workspace) => (
              <MenuItem
                key={workspace.workspaceId}
                onClick={() => handleCopyTo(workspace.workspaceId!)}
              >
                {workspace.name}
              </MenuItem>
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
              <Box display={"flex"} p={0}>
                <Box mr={1}>
                  <ChevronLeftIcon />
                </Box>
                <Box>Move To</Box>
              </Box>
            </MenuItem>
            <Divider />
            {workspaces?.map((workspace: Workspace) => (
              <MenuItem
                key={workspace.workspaceId}
                onClick={() => handleMoveTo(workspace.workspaceId!)}
              >
                {workspace.name}
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>
      {/* Remame Modal */}
      <RenameSurveyModal
        open={openRenameModel}
        onClose={() => setOpenRenameModel(false)}
        survey={survey}
      />
      {/* Delete Modal */}
      <DeleteSurveyModal
        open={openDeleteModel}
        onClose={() => setOpenDeleteModel(false)}
        sID={survey.surveyID}
        sTitle={survey.title}
      />
    </>
  );
};

export default SurveyCardDropDownMenu;
