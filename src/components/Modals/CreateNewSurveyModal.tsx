import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ErrorData, SurveyNameProps } from "../../utils/types";
import { useEffect, useState } from "react";
import { useCreateSurveyMutation } from "../../app/slices/surveysApiSlice";

const CreateNewSurveyModal = ({
  isOpen,
  workspaceId,
  setSurveyTitle,
}: SurveyNameProps) => {
  const { register, handleSubmit } = useForm<SurveyNameProps>();
  const [open, setOpen] = useState(isOpen);

  const [createSurvey, { isSuccess, isError, error }] =
    useCreateSurveyMutation();

  const onClose = () => {
    setOpen(false);
  };

  const handleNameSurvey = async (data: SurveyNameProps) => {
    const { surveyName, surveyDescription } = data;
    try {
      const surveyCreated = await createSurvey({
        title: surveyName,
        description: surveyDescription,
        workspaceId,
      }).unwrap();

      if (surveyCreated) {
        setSurveyTitle(surveyCreated.title);
      }

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Survey Created!", {
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
                Create your new survey
              </Typography>
            </Box>
            <Box>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={onClose}
                sx={{ marginTop: -2 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box>
          <form onSubmit={handleSubmit(handleNameSurvey)}>
            <Box sx={{ mt: 1 }}>
              <Box>
                <Typography>Name your survey: </Typography>
              </Box>
              <Box>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  size="small"
                  defaultValue={"New Survey name"}
                  id="surveyName"
                  autoComplete="Name of Survey"
                  autoFocus
                  {...register("surveyName")}
                />
              </Box>
            </Box>
            <Box>
              <Typography>Small description for your survey: </Typography>
            </Box>
            <Box>
              <TextField
                margin="normal"
                required
                fullWidth
                size="small"
                defaultValue={"Description of Survey"}
                id="surveyDescription"
                autoComplete="Description of survey"
                autoFocus
                {...register("surveyDescription")}
              />
            </Box>
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
                    backgroundColor: "#262627",
                    color: "white",
                    "&.MuiButton-root:hover": {
                      bgcolor: "#262627",
                    },
                    textTransform: "capitalize",
                  }}
                  color="error"
                >
                  Continue
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateNewSurveyModal;
