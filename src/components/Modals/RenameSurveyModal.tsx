import { useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRetitleSurveyMutation } from "../../app/slices/surveysApiSlice";
import { ErrorData, SurveyRenameProps } from "../../utils/types";

const RenameSurveyModal = ({ open, onClose, survey }: SurveyRenameProps) => {
  const [retitleSurvey, { isSuccess, isError, error }] =
    useRetitleSurveyMutation();

  const { register, handleSubmit } = useForm<SurveyRenameProps>();

  const renameSurvey = async (data: SurveyRenameProps) => {
    const { surveyTitle } = data;
    const { surveyID } = survey!;
    try {
      await retitleSurvey({ surveyID, title: surveyTitle });
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Survey Renamed Successfully !", {
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
  }, [isSuccess, isError, error]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 1,
            p: 4,
          }}
        >
          <Box>
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Box>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Rename Survey
                </Typography>
              </Box>
              <Box>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={onClose}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box>
            <form onSubmit={handleSubmit(renameSurvey)}>
              <Box sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  size="small"
                  defaultValue={survey?.title}
                  id="surveyTitle"
                  autoComplete="Name of Survey"
                  autoFocus
                  {...register("surveyTitle")}
                />
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"flex-end"}
                >
                  <Box mr={2}>
                    <Button
                      type="button"
                      onClick={onClose}
                      variant="text"
                      size="small"
                      sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: "#E4E2E2",
                        color: "black",
                        "&.MuiButton-root:hover": {
                          bgcolor: "#E4E2E2",
                        },
                        textTransform: "capitalize",
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      type="submit"
                      variant="text"
                      size="small"
                      sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: "#E4E2E2",
                        color: "black",
                        "&.MuiButton-root:hover": {
                          bgcolor: "#E4E2E2",
                        },
                        textTransform: "capitalize",
                      }}
                    >
                      Rename
                    </Button>
                  </Box>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default RenameSurveyModal;
