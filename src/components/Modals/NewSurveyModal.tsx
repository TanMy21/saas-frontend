import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import { ErrorData, NewSurveyModalProps } from "../../utils/types";
import { useCreateSurveyMutation } from "../../app/slices/surveysApiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const NewSurveyModal = ({
  open,
  setOpen,
  workspaceId,
  workspaceName,
}: NewSurveyModalProps) => {
  const navigate = useNavigate();

  const handleClose = () => setOpen(false);
  const openModal = true;

  const [createSurvey, { isError, error }] = useCreateSurveyMutation();

  const handleCreateFromScratch = async () => {
    try {
      const surveyCreated = await createSurvey({
        workspaceId,
      }).unwrap();

      if (surveyCreated) {
        navigate(`/survey/${surveyCreated.surveyID}/create`, {
          state: { workspaceId, workspaceName, openModal },
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
          width: 800,
          height: 500,
          bgcolor: "#FAFAFA",
          borderRadius: 1,
          p: 4,
        }}
      >
        <Box display={"flex"} flexDirection={"column"}>
          <Box
            display={"flex"}
            justifyContent={"end"}
            sx={{ width: "100%", height: 30 }}
          >
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"center"}
            sx={{
              width: "100%",
              height: 50,
              marginTop: "12%",
            }}
          >
            <Typography id="modal-modal-title" variant="h5" component="h2">
              Create a new survey
            </Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"center"}
            sx={{
              width: "100%",
              height: 320,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                width: 200,
                height: 200,
                border: "2px solid transparent",
                transition: "border-color 0.3s",
                "&:hover": {
                  borderColor: "#678CD4",
                },
              }}
            >
              <Button
                onClick={handleCreateFromScratch}
                sx={{
                  width: "100%",
                  height: "100%",
                  "&:hover": {
                    backgroundColor: "inherit",
                  },
                  textTransform: "capitalize",
                }}
              >
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    mt={2}
                    sx={{
                      width: 100,
                      height: 100,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#678CD4",
                        color: "#2A5281",
                        width: 70,
                        height: 70,
                        marginTop: "8px",
                      }}
                      variant="rounded"
                    >
                      <AddIcon fontSize="large" />
                    </Avatar>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    sx={{
                      width: 200,
                      height: 70,
                    }}
                  >
                    <Typography
                      fontWeight={"bold"}
                      variant="h6"
                      color={"black"}
                    >
                      Start from scratch
                    </Typography>
                  </Box>
                </Box>
              </Button>
            </Paper>
            <Paper
              sx={{
                width: 200,
                height: 200,
                marginLeft: "4%",
                border: "2px solid transparent",
                transition: "border-color 0.3s",
                "&:hover": {
                  borderColor: "#FFE0C0",
                },
              }}
            >
              <Button
                sx={{
                  width: "100%",
                  height: "100%",
                  "&:hover": {
                    backgroundColor: "inherit",
                  },
                  textTransform: "capitalize",
                }}
              >
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    mt={2}
                    sx={{
                      width: 100,
                      height: 100,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#FFE0C0",
                        color: "#5C442A",
                        width: 70,
                        height: 70,
                        marginTop: "8px",
                      }}
                      variant="rounded"
                    >
                      <UploadIcon fontSize="large" />
                    </Avatar>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    sx={{
                      width: 200,
                      height: 70,
                    }}
                  >
                    <Typography
                      fontWeight={"bold"}
                      variant="h6"
                      color={"black"}
                    >
                      Upload Questions
                    </Typography>
                  </Box>
                </Box>
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewSurveyModal;
