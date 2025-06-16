import { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useUpdateSurveyTitleandDescriptionMutation } from "../../app/slices/surveysApiSlice";
import { ErrorData, SurveyNameProps } from "../../utils/types";

const CreateNewSurveyModal = ({
  isOpen,
  surveyID,
  setSurveyTitle,
}: SurveyNameProps) => {
  const { register, handleSubmit } = useForm<SurveyNameProps>();
  const [open, setOpen] = useState(isOpen);

  const [updateSurveyTitleandDescription, { isSuccess, isError, error }] =
    useUpdateSurveyTitleandDescriptionMutation();

  const onClose = () => {
    setOpen(false);
  };

  const handleNameSurvey = async (data: SurveyNameProps) => {
    const { surveyName, surveyDescription } = data;
    try {
      const surveyCreated = await updateSurveyTitleandDescription({
        surveyID,
        title: surveyName,
        description: surveyDescription,
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
          borderRadius: "16px",
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            margin: "0 auto",
            justifyContent: "space-between",
            width: "98%",
            height: "8%",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create your new survey
          </Typography>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>
          <form onSubmit={handleSubmit(handleNameSurvey)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                margin: "0 auto",
                gap: 0.5,
                width: "100%",
                height: "80%",
                mt: 1,
                // border: "2px solid blue",
              }}
            >
              {/* name your survey */}
              <Typography
                sx={{
                  fontSize: "16px",
                  fontStyle: "bold",
                  color: "#272F3F",
                }}
              >
                Name your survey:
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                size="small"
                defaultValue={"New Survey name"}
                id="surveyName"
                autoFocus
                {...register("surveyName")}
                sx={{
                  marginTop: "0%",
                  width: "100%",
                  "& .MuiInputBase-root": {
                    height: "48px",
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                    px: 0.5,
                    py: 0.5,
                    "&:hover": { borderColor: "#a3a3a3" },
                    "&.Mui-focused": {
                      borderColor: "transparent",
                    },
                  },
                }}
              />
              {/* description of survey */}
              <Typography
                sx={{
                  fontSize: "16px",
                  fontStyle: "bold",
                  color: "#272F3F",
                }}
              >
                Small description for your survey:
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                size="small"
                defaultValue={"Description of Survey"}
                id="surveyDescription"
                autoFocus
                {...register("surveyDescription")}
                sx={{
                  marginTop: "0%",
                  width: "100%",
                  "& .MuiInputBase-root": {
                    height: "48px",
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                    px: 0.5,
                    py: 0.5,
                    "&:hover": { borderColor: "#a3a3a3" },
                    "&.Mui-focused": {
                      borderColor: "transparent",
                    },
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end ",
                  width: "100%",
                  height: "10%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: 2,
                    width: "60%",
                    height: "98%",
                  }}
                >
                  <Button type="button" onClick={onClose} variant="cancelBtn">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="submitBtn2"
                    size="small"
                    sx={{ width: "100px" }}
                  >
                    Continue
                  </Button>
                </Box>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateNewSurveyModal;
