import { useEffect } from "react";

import EditIcon from "@mui/icons-material/Edit";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Modal,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCreateSurveyMutation } from "../../app/slices/surveysApiSlice";
import { ErrorData, NewSurveyModalProps } from "../../utils/types";

const NewSurveyModal = ({
  open,
  setOpen,
  workspaceId,
  workspaceName,
}: NewSurveyModalProps) => {
  const navigate = useNavigate();

  const handleClose = () => setOpen(false);
  const openModal = true;
  const openModalImport = true;

  const [createSurvey, { isError, error }] = useCreateSurveyMutation();

  const handleCreateFromScratch = async () => {
    try {
      const surveyCreated = await createSurvey({
        workspaceId,
      }).unwrap();

      if (surveyCreated) {
        navigate(`/survey/${surveyCreated.surveyID}`, {
          state: { workspaceId, workspaceName, openModal },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImportQuestions = async () => {
    try {
      const surveyCreated = await createSurvey({
        workspaceId,
      }).unwrap();

      if (surveyCreated) {
        navigate(`/survey/${surveyCreated.surveyID}`, {
          state: { workspaceId, workspaceName, openModalImport },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
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
  }, [isError, error]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
          height: 280,
          bgcolor: "#FAFAFA",
          borderRadius: 3,
          p: 4,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "98%",
              height: "20%",
            }}
          >
            <Typography variant="h5" component="h2">
              Create a new survey
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "#6F7683" }}>
              Choose how you'd like to start your survey
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              width: "98%",
              height: "64px",
              border: "2px solid #E5E7EB",
              borderRadius: 3,
            }}
          >
            <ButtonBase
              onClick={handleCreateFromScratch}
              sx={{
                width: "100%",
                height: "100%",
                transition: "box-shadow 0.3s",
                "&:hover": {
                  boxShadow: 3,
                  backgroundColor: "inherit",
                  borderRadius: 3,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "16%",
                  height: "100%",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#EDE9FE",
                    color: "#7B39ED",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                  }}
                  variant="rounded"
                >
                  <EditIcon fontSize="medium" />
                </Avatar>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1,
                  padding: 1,
                  width: "80%",
                  height: "98%",
                }}
              >
                <Typography variant="h6" component="h2">
                  Create from scratch
                </Typography>
                <Typography sx={{ fontSize: "16px", color: "#6F7683" }}>
                  Start with a blank survey with your own questions
                </Typography>
              </Box>
            </ButtonBase>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              marginTop: 1,
              width: "98%",
              height: "64px",
              border: "2px solid #E5E7EB",
              borderRadius: 3,
            }}
          >
            <ButtonBase
              onClick={handleImportQuestions}
              sx={{
                width: "100%",
                height: "100%",
                transition: "box-shadow 0.3s",
                "&:hover": {
                  boxShadow: 3,
                  backgroundColor: "inherit", 
                  borderRadius: 3,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "16%",
                  height: "100%",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#EDE9FE",
                    color: "#7B39ED",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                  }}
                  variant="rounded"
                >
                  <UploadIcon fontSize="medium" />
                </Avatar>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1,
                  padding: 1,
                  width: "80%",
                  height: "98%",
                }}
              >
                <Typography variant="h6" component="h2">
                  Upload questions
                </Typography>
                <Typography sx={{ fontSize: "16px", color: "#6F7683" }}>
                  Start with uploading questions
                </Typography>
              </Box>
            </ButtonBase>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              width: "98%",
              height: "20%",
            }}
          >
            <Button
              type="button"
              onClick={handleClose}
              variant="text"
              size="small"
              sx={{
                width: "16%",
                height: "80%",
                p: 1,
                backgroundColor: "#E4E2E2",
                color: "black",
                fontWeight: "bold",
                "&.MuiButton-root:hover": {
                  bgcolor: "#E4E2E2",
                },
                textTransform: "capitalize",
                borderRadius: 2,
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewSurveyModal;
