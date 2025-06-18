import { useEffect } from "react";

import EditIcon from "@mui/icons-material/Edit";
import UploadIcon from "@mui/icons-material/Upload";
import { Box, Button, Modal, Typography } from "@mui/material";
import { RiAiGenerate } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCreateSurveyMutation } from "../../app/slices/surveysApiSlice";
import { useAppTheme } from "../../theme/useAppTheme";
import { ErrorData, NewSurveyModalProps } from "../../utils/types";
import NewSurveyActionCard from "../ModalComponents/NewSurveyActionCard";

const NewSurveyModal = ({
  open,
  setOpen,
  workspaceId,
  workspaceName,
}: NewSurveyModalProps) => {
  const { background } = useAppTheme();
  const navigate = useNavigate();

  const handleClose = () => setOpen(false);
  const openModal = true;
  const openModalImport = true;
  const openModalGenerate = true;

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

  const handleGenerateQuestions = async () => {
    try {
      const surveyCreated = await createSurvey({
        workspaceId,
      }).unwrap();

      if (surveyCreated) {
        navigate(`/survey/${surveyCreated.surveyID}`, {
          state: { workspaceId, workspaceName, openModalGenerate },
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
          height: 360,
          backgroundColor: background.paper,
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
            <Typography sx={{ fontSize: "16px", color: "#6F7683", ml: "2%" }}>
              Choose how you'd like to start your survey
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "96%",
              height: "68%",
              margin: "0 auto",
              gap: 2,
            }}
          >
            <NewSurveyActionCard
              icon={<EditIcon fontSize="medium" />}
              onClickHandler={handleCreateFromScratch}
              actionTitle={"Create from scratch"}
              actionSubTitle={
                "Start with a blank survey with your own questions"
              }
            />
            <NewSurveyActionCard
              icon={<UploadIcon fontSize="medium" />}
              onClickHandler={handleImportQuestions}
              actionTitle={"Upload questions"}
              actionSubTitle={"Start with uploading your own questions"}
            />
            <NewSurveyActionCard
              icon={<RiAiGenerate size={28} />}
              onClickHandler={handleGenerateQuestions}
              actionTitle={"Generate questions"}
              actionSubTitle={"Start with generating questions"}
            />
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
              variant="outlined"
              size="small"
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
