import { useEffect, useState } from "react";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useDuplicateSurveyMutation,
  useCopySurveyMutation,
  useMoveSurveyMutation,
} from "../../app/slices/surveysApiSlice";
import { useGetWorkspacesQuery } from "../../app/slices/workspaceApiSlice";
import {
  Workspace,
  SurveyDropDownMenuProps,
  ErrorData,
} from "../../utils/types";
import DeleteSurveyModal from "../Modals/DeleteSurveyModal";
import RenameSurveyModal from "../Modals/RenameSurveyModal";
import SnackbarAlert from "../SnackbarAlert";

const SurveyCardDropDownMenu = ({
  survey,
  workspaceId,
  workspaceName,
}: SurveyDropDownMenuProps) => {
  const { surveyID } = survey;

  const navigate = useNavigate();

  const shareBaseURL = import.meta.env.VITE_SHARE_BASE_URL;
  const shareURL = `${shareBaseURL}/${surveyID}`;

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [currentMenu, setCurrentMenu] = useState<string | null>("parent");
  // const [tabValue, setTabValue] = useState<string | null>("create");
  const [openRenameModel, setOpenRenameModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);

  const open = Boolean(menuAnchor);

  const { data: workspaces } = useGetWorkspacesQuery("workspacesList", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [duplicateSurvey] = useDuplicateSurveyMutation();
  const [copySurvey, { isSuccess, isError, error }] = useCopySurveyMutation();
  const [
    moveSurvey,
    { isSuccess: moveSuccess, isError: moveIsError, error: moveError },
  ] = useMoveSurveyMutation();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const headerProps = {
    // tabValue,
    survey,
    workspaceId,
    workspaceName,
  };

  const handleOpenSurvey = (surveyID: string) => {
    navigate(`/survey/${surveyID}`, {
      state: { workspaceId, workspaceName },
    });
  };

  const handleShareSurvey = async () => {
    try {
      await navigator.clipboard.writeText(shareURL);
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Unable to copy to clipboard.", err);
    }
  };

  const handleOpenResultsPage = () => {
    navigate(`/s/results/${surveyID}`, { state: { headerProps } });
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

  useEffect(() => {
    if (isSuccess) {
      toast.success("Copy Successfull!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "colored",
      });
    }

    if (moveSuccess) {
      toast.success("Survey moved Successfully!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "colored",
      });
    }

    if (isError) {
      const errorData = error as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }

    if (moveIsError) {
      const moveErrorData = moveError as ErrorData;
      if (Array.isArray(moveErrorData.data.error)) {
        moveErrorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(moveErrorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isSuccess, moveSuccess, moveIsError, isError, error, moveError]);

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
        sx={{
          width: "100%",
        }}
      >
        {/* Parent Menu */}
        {currentMenu === "parent" && (
          <Box>
            <MenuItem onClick={() => handleOpenSurvey(surveyID)}>Open</MenuItem>
            <Divider />
            <MenuItem onClick={handleShareSurvey}>Share</MenuItem>
            <SnackbarAlert
              openSnackbar={openSnackbar}
              handleCloseSnackbar={handleCloseSnackbar}
            />
            <MenuItem onClick={handleOpenResultsPage}>Results</MenuItem>
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
