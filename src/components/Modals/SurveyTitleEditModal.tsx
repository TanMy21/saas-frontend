import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useGetSurveyByIdQuery,
  useUpdateSurveyTitleandDescriptionMutation,
} from "../../app/slices/surveysApiSlice";
// import { useAppTheme } from "../../theme/useAppTheme";
import { titleDescriptionUpdateSchema } from "../../utils/schema";
import {
  ErrorData,
  SurveyTitleAndDescription,
  SurveyTitleEditModalProps,
} from "../../utils/types";

const SurveyTitleEditModal = ({
  openEdit,
  setOpenEdit,
}: SurveyTitleEditModalProps) => {
  // const { textStyles } = useAppTheme();
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
      const { title, description } = data;
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
      aria-labelledby="edit-survey-modal-title"
      aria-describedby="edit-survey-modal-description"
      closeAfterTransition
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#fff",
          borderRadius:2,
          boxShadow: 8,
          width: "100%",
          maxWidth: 500,
          outline: "none",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
            borderBottom: "1px solid #f3f4f6",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1, bgcolor: "#EFF6FF", borderRadius: 2 }}>
              <FileText size={20} color="#2563EB" />
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: 20, fontWeight: 600, color: "#111827" }}
              >
                Edit Survey
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#6B7280" }}>
                Update your survey details
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              p: 1,
              color: "grey.400",
              transition: "all 0.2s",
              "&:hover": {
                color: "grey.600",
                bgcolor: "grey.100",
              },
              borderRadius: 2,
            }}
          >
            <CloseIcon style={{ width: 28, height: 28 }} />
          </IconButton>
        </Box>

        {/* Content */}
        <form onSubmit={handleSubmit(submitUpdateData)}>
          <Box sx={{ p: 3, pb: 2 }}>
            {/* Title */}
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{ fontSize: 14, fontWeight: 700, mb: 1, color: "#374151" }}
              >
                Survey Title
              </Typography>
              <TextField
                id="title"
                {...register("title")}
                variant="outlined"
                placeholder="Enter survey title..."
                error={!!errors.title}
                helperText={errors.title?.message}
                fullWidth
                sx={{
                  bgcolor: "#F9FAFB",
                  borderRadius: 2,
                  height: "48px",
                  "& .MuiInputBase-root": {
                    borderRadius: 2,
                    fontSize: 16,
                    px: 2,
                    py: 1,
                  },
                }}
                InputProps={{
                  sx: {
                    minHeight: 48,
                  },
                }}
              />
            </Box>
            {/* Description */}
            <Box sx={{ mb: 1 }}>
              <Typography
                sx={{ fontSize: 14, fontWeight: 700, mb: 1, color: "#374151" }}
              >
                Description
              </Typography>
              <TextField
                id="description"
                {...register("description")}
                variant="outlined"
                multiline
                minRows={4}
                maxRows={5}
                placeholder="Describe your survey purpose and goals..."
                error={!!errors.description}
                helperText={errors.description?.message}
                fullWidth
                sx={{
                  bgcolor: "#F9FAFB",
                  borderRadius: 2,
                  "& .MuiInputBase-root": {
                    borderRadius: 2,
                    fontSize: 15,
                    px: 2,
                    py: 1,
                  },
                }}
                InputProps={{
                  sx: {
                    minHeight: 90,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Footer */}
          <Divider />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 2,
              p: 1.5,
              pt: 2,
              bgcolor: "#F9FAFB",
              borderRadius: "0 0 16px 16px",
            }}
          >
            <Button
              type="button"
              onClick={handleClose}
              variant="outlined"
              sx={{
                color: "grey.700",
                bgcolor: "grey.100",
                borderColor: "grey.200",
                fontWeight: 600,
                borderRadius: 2,
                py: 1.5,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "grey.200",
                  transform: "scale(0.98)",
                  border: "none",
                },
                "&:active": { transform: "scale(0.95)" },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#2563EB",
                borderRadius: 2,
                px: 4,
                py: 1.25,
                color: "#fff",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: "#1d4ed8" },
                minWidth: 120,
              }}
              disabled={isLoading}
              startIcon={
                isLoading && <CircularProgress size={18} color="inherit" />
              }
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default SurveyTitleEditModal;
