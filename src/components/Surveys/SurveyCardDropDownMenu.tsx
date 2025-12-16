import { useEffect, useState } from "react";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  type Theme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { hideOverlay, showOverlay } from "../../app/slices/overlaySlice";
import {
  useDuplicateSurveyMutation,
  useCopySurveyMutation,
  useMoveSurveyMutation,
  usePublishSurveyMutation,
} from "../../app/slices/surveysApiSlice";
import { useGetWorkspacesQuery } from "../../app/slices/workspaceApiSlice";
import { useAppDispatch } from "../../app/typedReduxHooks";
import {
  Workspace,
  SurveyDropDownMenuProps,
  ErrorData,
} from "../../utils/types";
import DeleteSurveyModal from "../Modals/DeleteSurveyModal";
import RenameSurveyModal from "../Modals/RenameSurveyModal";
import SurveyTagsModal from "../Modals/SurveyTagsModal";
import SnackbarAlert from "../SnackbarAlert";

const SurveyCardDropDownMenu = ({
  survey,
  workspaceId,
  workspaceName,
}: SurveyDropDownMenuProps) => {
  const { shareID, surveyID } = survey;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const shareBaseURL = import.meta.env.VITE_SHARE_BASE_URL;
  const shareURL = `${shareBaseURL}/${shareID}`;

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isPublished, setIsPublished] = useState<boolean>(survey?.published!);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [currentMenu, setCurrentMenu] = useState<string | null>("parent");
  // const [tabValue, setTabValue] = useState<string | null>("create");
  const [openTagsModal, setOpenTagsModal] = useState(false);
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const published = isPublished;
  const open = Boolean(menuAnchor);

  const { data: workspaces } = useGetWorkspacesQuery("workspacesList", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [
    duplicateSurvey,
    {
      isSuccess: surveyDuplicated,
      isError: isErrorDuplicateSurvey,
      error: duplicateSurveyError,
    },
  ] = useDuplicateSurveyMutation();
  const [publishSurvey] = usePublishSurveyMutation();
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

  const handlePublish = async (surveyID: string) => {
    try {
      await publishSurvey({ surveyID, published: !published }).unwrap();
      setIsPublished((p) => !p);
      handleClose();
    } catch (e) {
      console.error(error);
      toast.error("Error Publishing survey", {
        position: "top-right",
      });
    }
  };

  const handleOpenResultsPage = () => {
    navigate(`/s/results/${surveyID}`, { state: { headerProps } });
  };

  const handleClose = () => {
    setMenuAnchor(null);
    setCurrentMenu("parent");
  };

  const handleOpenTagsModal = () => {
    setOpenTagsModal(true);
    handleClose();
  };

  const handleOpenModalRename = () => {
    setOpenRenameModal(true);
    handleClose();
  };

  const handleOpenModalDelete = () => {
    setOpenDeleteModal(true);
    handleClose();
  };

  const handleNestedOpen = (menuName: string) => {
    setCurrentMenu(menuName);
  };

  const handleCopyTo = async (wID: string) => {
    handleClose();
    try {
      dispatch(showOverlay("Copying survey…"));
      await copySurvey({ surveyID, workspaceId: wID });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideOverlay());
    }
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
    handleClose();
    try {
      dispatch(showOverlay("Duplicating survey…"));
      await duplicateSurvey(surveyID);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideOverlay());
    }
  };

  useEffect(() => {
    setIsPublished(survey?.published!);
  }, [survey.published]);

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

    if (surveyDuplicated) {
      toast.success("Survey duplicated Successfully!", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "colored",
      });
    }

    if (isError) {
      const errorData = error as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach(() =>
          toast.error("Error Copying survey", {
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
        moveErrorData.data.error.forEach(() =>
          toast.error("Error Moving Survey", {
            position: "top-right",
          })
        );
      } else {
        toast.error(moveErrorData.data.message, {
          position: "top-right",
        });
      }
    }

    if (isErrorDuplicateSurvey) {
      const duplicateErrorData = moveError as ErrorData;
      if (Array.isArray(duplicateErrorData.data.error)) {
        duplicateErrorData.data.error.forEach(() =>
          toast.error("Error Duplicating Survey", {
            position: "top-right",
          })
        );
      }
    }
  }, [
    isSuccess,
    moveSuccess,
    moveIsError,
    isError,
    error,
    moveError,
    isErrorDuplicateSurvey,
    duplicateSurveyError,
    surveyDuplicated,
  ]);

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          mb: { lg: "12px", xl: "0px" },
          borderRadius: 2,
          p: 0.75,
          transition: "all .2s ease",
          "&:hover": {
            backgroundColor: (t: Theme) =>
              t.palette.mode === "dark"
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.06)",
            transform: "translateY(-1px)",
          },
          "&:active": { transform: "translateY(0)" },
        }}
      >
        <MoreHorizIcon />
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={menuAnchor}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 0,
          sx: (t: Theme) => ({
            mt: 1,
            minWidth: 220,
            borderRadius: 2,
            boxShadow:
              t.palette.mode === "dark"
                ? "0 10px 24px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.06) inset"
                : "0 10px 24px rgba(0,0,0,.08), 0 1px 0 rgba(255,255,255,.6) inset",
            backdropFilter: "blur(6px)",
            overflow: "hidden",
          }),
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          dense: true,
          sx: { py: 0.75 },
        }}
        sx={{
          width: "100%",
        }}
      >
        {/* Parent Menu */}
        {currentMenu === "parent" && (
          <Box>
            <MenuItem
              onClick={() => handleOpenSurvey(surveyID)}
              sx={{
                gap: 1.25,
                px: 1.5,
                py: 1,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                transition: "all 0.2s ease",
                color: " #374151",
                "&:hover": {
                  backgroundColor: (t: Theme) =>
                    t.palette.mode === "dark"
                      ? "rgba(144,202,249,.12)"
                      : "rgba(25,118,210,.06)",
                },
              }}
            >
              Open
            </MenuItem>
            <Divider sx={{ my: 0.5, opacity: 0.7 }} />
            {published ? (
              <MenuItem
                onClick={handleShareSurvey}
                sx={{
                  gap: 1.25,
                  px: 1.5,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  color: " #374151",
                }}
              >
                Share
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => handlePublish(surveyID)}
                sx={{
                  gap: 1.25,
                  px: 1.5,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  color: " #374151",
                }}
              >
                Publish
              </MenuItem>
            )}
            <MenuItem
              onClick={handleOpenTagsModal}
              sx={{
                gap: 1.25,
                px: 1.5,
                py: 1,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                transition: "all 0.2s ease",
                color: " #374151",
              }}
            >
              Tags
            </MenuItem>
            <MenuItem
              onClick={handleOpenResultsPage}
              sx={{
                gap: 1.25,
                px: 1.5,
                py: 1,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                transition: "all 0.2s ease",
                color: " #374151",
              }}
            >
              Results
            </MenuItem>
            <Divider
              sx={{
                my: 0.5,
                opacity: 0.7,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                transition: "all 0.2s ease",
                color: " #374151",
              }}
            />
            <MenuItem
              onClick={handleOpenModalRename}
              sx={{
                gap: 1.25,
                px: 1.5,
                py: 1,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                transition: "all 0.2s ease",
                color: " #374151",
              }}
            >
              Rename
            </MenuItem>
            <MenuItem
              onClick={() => handleDuplicateSurvey(surveyID)}
              sx={{
                gap: 1.25,
                px: 1.5,
                py: 1,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                transition: "all 0.2s ease",
                color: " #374151",
              }}
            >
              Duplicate
            </MenuItem>
            <Divider
              sx={{
                my: 0.5,
                opacity: 0.7,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                transition: "all 0.2s ease",
                color: " #374151",
              }}
            />
            <MenuItem
              onClick={() => handleNestedOpen("copy to")}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                transition: "all 0.2s ease",
                color: " #374151",
                justifyContent: "space-between",
                gap: 6,
                px: 1.5,
                py: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  color: " #374151",
                  gap: 1.25,
                }}
              >
                Copy To
              </Box>
              <ChevronRightIcon />
            </MenuItem>
            <MenuItem
              onClick={() => handleNestedOpen("move to")}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                transition: "all 0.2s ease",
                color: " #374151",
                justifyContent: "space-between",
                px: 1.5,
                py: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                }}
              >
                Move To
              </Box>
              <ChevronRightIcon />
            </MenuItem>
            <Divider sx={{ my: 0.5, opacity: 0.7 }} />
            <MenuItem
              onClick={handleOpenModalDelete}
              sx={{
                gap: 1.25,
                px: 1.5,
                py: 1,
                fontWeight: 600,
                color: (t: Theme) =>
                  t.palette.mode === "dark"
                    ? t.palette.error.light
                    : t.palette.error.main, // ✨
                "&:hover": {
                  backgroundColor: (t: Theme) =>
                    t.palette.mode === "dark"
                      ? "rgba(244,67,54,.12)"
                      : "rgba(244,67,54,.06)", // ✨
                },
              }}
            >
              <DeleteIcon sx={{ color: "#D32F2F" }} /> Delete
            </MenuItem>
          </Box>
        )}

        {/* Nested Copy To Menu */}
        {currentMenu === "copy to" && (
          <Box>
            <MenuItem
              onClick={() => setCurrentMenu("parent")}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: 220, // ✨: match parent width
                gap: 2,
                fontWeight: 600, // ✨: header emphasis
                px: 1.5,
                py: 1,
              }}
            >
              <ChevronLeftIcon />
              Copy To
            </MenuItem>
            <Divider sx={{ my: 0.5, opacity: 0.7 }} /> {/* ✨ */}
            {workspaces?.map((workspace: Workspace) => (
              <MenuItem
                key={workspace.workspaceId}
                onClick={() => handleCopyTo(workspace.workspaceId!)}
                sx={{ px: 1.5, py: 1 }}
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
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: 220, // ✨
                gap: 2,
                fontWeight: 600, // ✨
                px: 1.5,
                py: 1,
              }}
            >
              <ChevronLeftIcon />
              Move To
            </MenuItem>
            <Divider sx={{ my: 0.5, opacity: 0.7 }} /> {/* ✨ */}
            {workspaces?.map((workspace: Workspace) => (
              <MenuItem
                key={workspace.workspaceId}
                onClick={() => handleMoveTo(workspace.workspaceId!)}
                sx={{ px: 1.5, py: 1 }}
              >
                {workspace.name}
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>

      {/* Remame Modal */}
      <RenameSurveyModal
        open={openRenameModal}
        onClose={() => setOpenRenameModal(false)}
        survey={survey}
      />
      {/* Delete Modal */}
      <DeleteSurveyModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        sID={survey.surveyID}
        sTitle={survey.title}
      />
      <SurveyTagsModal
        open={openTagsModal}
        onClose={() => setOpenTagsModal(false)}
        survey={survey}
      />

      <SnackbarAlert
        openSnackbar={openSnackbar}
        handleCloseSnackbar={handleCloseSnackbar}
      />
    </>
  );
};

export default SurveyCardDropDownMenu;
