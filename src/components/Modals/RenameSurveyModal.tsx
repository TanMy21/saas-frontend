import { useEffect } from "react";

import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
            height: 128,
            bgcolor: "background.paper",
            borderRadius: 3,
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
            </Box>
          </Box>
          <Box>
            <form onSubmit={handleSubmit(renameSurvey)}>
              <Box>
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
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    gap: 4,
                    mt: 1,
                    // border: "2px solid red",
                  }}
                >
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="outlined"
                    size="medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="submitBtn2"
                    size="small"
                    sx={{
                      width: "28%",
                    }}
                  >
                    Rename
                  </Button>
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
