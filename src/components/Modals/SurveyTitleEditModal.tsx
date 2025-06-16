import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useGetSurveyByIdQuery,
  useUpdateSurveyTitleandDescriptionMutation,
} from "../../app/slices/surveysApiSlice";
import { useElectricTheme } from "../../theme/useElectricTheme";
import { titleDescriptionUpdateSchema } from "../../utils/schema";
import {
  ErrorData,
  SurveyTitleAndDescription,
  SurveyTitleEditModalProps,
} from "../../utils/types";
import FormErrors from "../FormErrors";

const SurveyTitleEditModal = ({
  openEdit,
  setOpenEdit,
}: SurveyTitleEditModalProps) => {
  const { textStyles } = useElectricTheme();
  const { surveyID } = useParams();
  const { data: survey } = useGetSurveyByIdQuery(surveyID, {
    skip: !surveyID,
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [
    updateSurveyTitleandDescription,
    { isLoading, isSuccess, isError, error },
  ] = useUpdateSurveyTitleandDescriptionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SurveyTitleAndDescription>({
    resolver: zodResolver(titleDescriptionUpdateSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleClose = () => {
    reset({
      title: survey.title ?? "",
      description: survey.description ?? "",
    });
    setOpenEdit(false);
  };

  const submitUpdateData = async (data: SurveyTitleAndDescription) => {
    try {
      console.log("Submittedd");
      const { title, description } = data;
      console.log(data);
      await updateSurveyTitleandDescription({ surveyID, title, description });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Settings Updated!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "colored",
      });
      handleClose();
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

  useEffect(() => {
    if (survey) {
      reset({
        title: survey.title ?? "",
        description: survey.description ?? "",
      });
    }
  }, [survey, reset]);

  return (
    <Modal
      open={openEdit}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minHeight: 280,
          width: 500,
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: 24,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "16%",
            margin: "auto",
            borderBottom: "2px solid #E0E0E0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "98%",
              height: "98%",
              margin: "auto",
              justifyContent: "space-between",
              alignItems: "center",
              pl: 2,
              pr: 1,
            }}
          >
            <Typography sx={textStyles.modalTitle}>
              Update title and description{" "}
            </Typography>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "96%",
            height: "84%",
            margin: "auto",
            gap: 1,
            // border: "2px solid red",
          }}
        >
          <form
            onSubmit={handleSubmit(submitUpdateData)}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                gap: 1,
                // border: "1px solid blue",
              }}
            >
              {/* --------------------- Title -------------------- */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "auto",
                  gap: 2,
                  width: "98%",
                  height: "36%",
                  // border: "2px solid orange",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontStyle: "bold",
                    color: "#272F3F",
                  }}
                >
                  Title
                </Typography>
                <TextField
                  id="title"
                  {...register("title")}
                  sx={{
                    marginTop: "-2%",
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
                {errors.title && <FormErrors errors={errors.title.message} />}
              </Box>
              {/* --------------------- Description ----------------------- */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "auto",
                  gap: 2,
                  width: "98%",
                  height: "36%",
                  // border: "2px solid orange",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontStyle: "bold",
                    color: "#37416D",
                  }}
                >
                  Description
                </Typography>
                <TextField
                  id="description"
                  autoFocus
                  {...register("description")}
                  sx={{
                    marginTop: "-2%",
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
                {errors.description && (
                  <FormErrors errors={errors.description.message} />
                )}
              </Box>
              {/* Buttons */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "auto",
                  gap: 2,
                  width: "98%",
                  height: "12%",
                  // border: "2px solid orange",
                  p: 0.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    margin: "auto",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "12px",
                    width: "98%",
                    height: "92%",
                  }}
                >
                  <Button onClick={handleClose} fullWidth variant="cancelBtn">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    variant="submitBtn2"
                    sx={{ width: "100px" }}
                  >
                    {isLoading ? "Saving..." : "Save"}
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

export default SurveyTitleEditModal;
