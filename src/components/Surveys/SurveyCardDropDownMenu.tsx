import { useEffect, useState } from "react";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Divider, IconButton, Menu, type Theme } from "@mui/material";
import {
  Archive,
  ChartColumnBig,
  ClipboardPaste,
  CopyPlus,
  Pencil,
  Share2,
  SquareArrowOutUpRight,
  Tag,
  Trash2,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { hideOverlay, showOverlay } from "../../app/slices/overlaySlice";
import {
  useDuplicateSurveyMutation,
  useCopySurveyMutation,
  useMoveSurveyMutation,
  usePublishSurveyMutation,
  useUpdateSurveyArchiveMutation,
} from "../../app/slices/surveysApiSlice";
import { useGetWorkspacesQuery } from "../../app/slices/workspaceApiSlice";
import { useAppDispatch } from "../../app/typedReduxHooks";
import useAuth from "../../hooks/useAuth";
import {
  Workspace,
  SurveyDropDownMenuProps,
  ErrorData,
} from "../../utils/types";
import { SurveyMenuItem } from "../MenuComponents/SurveyMenuItem";
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
  const { can } = useAuth();

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
  const [updateSurveyArchive, { isLoading: archiveLoading }] =
    useUpdateSurveyArchiveMutation();
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

  const handleArchiveSurvey = async () => {
    try {
      handleClose();

      await updateSurveyArchive({
        surveyID,
        archive: !survey.isArchived,
      }).unwrap();

      toast.success(survey.isArchived ? "Survey restored" : "Survey archived", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error updating archive status", {
        position: "top-right",
      });
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
          }),
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
          }),
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
          }),
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
            minWidth: 240,
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
            <SurveyMenuItem
              icon={<SquareArrowOutUpRight />}
              label="Open"
              onClick={() => handleOpenSurvey(surveyID)}
            />

            <Divider sx={{ my: 0.5, opacity: 0.6 }} />

            {can?.("UPDATE_SURVEY") && (
              <SurveyMenuItem
                icon={published ? <Share2 /> : <Upload />}
                label={published ? "Share" : "Publish"}
                onClick={
                  published ? handleShareSurvey : () => handlePublish(surveyID)
                }
                disabled={survey.isArchived}
              />
            )}

            {can?.("UPDATE_SURVEY") && (
              <SurveyMenuItem
                icon={<Tag />}
                label="Tags"
                onClick={handleOpenTagsModal}
              />
            )}

            <SurveyMenuItem
              icon={<ChartColumnBig />}
              label="Results"
              onClick={handleOpenResultsPage}
            />

            {can?.("UPDATE_SURVEY") && (
              <>
                <Divider sx={{ my: 0.5, opacity: 0.6 }} />

                <SurveyMenuItem
                  icon={<Pencil />}
                  label="Rename"
                  onClick={handleOpenModalRename}
                />

                <SurveyMenuItem
                  icon={<CopyPlus />}
                  label="Duplicate"
                  onClick={() => handleDuplicateSurvey(surveyID)}
                  disabled={survey.isArchived}
                />
              </>
            )}

            {can("CREATE_SURVEY") && (
              <SurveyMenuItem
                icon={<ClipboardPaste />}
                label="Copy To"
                onClick={() => handleNestedOpen("copy to")}
                right={<ChevronRightIcon />}
                disabled={survey.isArchived}
              />
            )}

            {can("UPDATE_SURVEY") && (
              <SurveyMenuItem
                icon={<DriveFileMoveIcon fontSize="small" />}
                label="Move To"
                onClick={() => handleNestedOpen("move to")}
                right={<ChevronRightIcon />}
                disabled={survey.isArchived}
              />
            )}

            {can?.("UPDATE_SURVEY") && (
              <Divider sx={{ my: 0.5, opacity: 0.6 }} />
            )}

            {can?.("UPDATE_SURVEY") && (
              <SurveyMenuItem
                icon={<Archive />}
                label={survey.isArchived ? "Restore Survey" : "Archive Survey"}
                onClick={handleArchiveSurvey}
                disabled={archiveLoading}
              />
            )}

            {can?.("DELETE_SURVEY") && (
              <SurveyMenuItem
                icon={<Trash2 />}
                label="Delete"
                onClick={handleOpenModalDelete}
                danger
              />
            )}
          </Box>
        )}

        {/* Nested Copy To Menu */}
        {currentMenu === "copy to" && can?.("CREATE_SURVEY") && (
          <Box>
            <SurveyMenuItem
              icon={<ChevronLeftIcon />}
              label="Copy To"
              onClick={() => setCurrentMenu("parent")}
            />

            <Divider sx={{ my: 0.5, opacity: 0.6 }} />

            {workspaces?.map((workspace: Workspace) => (
              <SurveyMenuItem
                key={workspace.workspaceId}
                label={workspace.name}
                onClick={() => handleCopyTo(workspace.workspaceId!)}
              />
            ))}
          </Box>
        )}

        {/* Nested Move To Menu */}
        {currentMenu === "move to" && can?.("UPDATE_SURVEY") && (
          <Box>
            <SurveyMenuItem
              icon={<ChevronLeftIcon />}
              label="Move To"
              onClick={() => setCurrentMenu("parent")}
            />

            <Divider sx={{ my: 0.5, opacity: 0.6 }} />

            {workspaces?.map((workspace: Workspace) => (
              <SurveyMenuItem
                key={workspace.workspaceId}
                label={workspace.name}
                onClick={() => handleMoveTo(workspace.workspaceId!)}
              />
            ))}
          </Box>
        )}
      </Menu>

      {/* Remame Modal */}
      {can("UPDATE_SURVEY") && (
        <RenameSurveyModal
          open={openRenameModal}
          onClose={() => setOpenRenameModal(false)}
          survey={survey}
        />
      )}

      {/* Delete Modal */}
      {can("DELETE_SURVEY") && (
        <DeleteSurveyModal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          sID={survey.surveyID}
          sTitle={survey.title}
        />
      )}

      {can("UPDATE_SURVEY") && (
        <SurveyTagsModal
          open={openTagsModal}
          onClose={() => setOpenTagsModal(false)}
          survey={survey}
        />
      )}

      <SnackbarAlert
        openSnackbar={openSnackbar}
        handleCloseSnackbar={handleCloseSnackbar}
      />
    </>
  );
};

export default SurveyCardDropDownMenu;
