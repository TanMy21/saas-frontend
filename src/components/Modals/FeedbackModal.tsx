import { useState } from "react";

import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { MessageSquarePlus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useCreateFeedbackMutation } from "../../app/slices/feedbackApiSlice";
import {
  FeedbackFormValues,
  FeedbackModalProps,
  FeedbackTypeUI,
} from "../../types/feedBackTypes";
import { FeedBackPlaceholders } from "../../utils/constants";
import FeebackPills from "../ModalComponents/FeebackPills";

const FeedbackModal = ({ open, onClose }: FeedbackModalProps) => {
  const [feedbackType, setFeedbackType] =
    useState<FeedbackTypeUI>("Feature request");
  const [file, setFile] = useState<File | null>(null);
  const currentPlaceholder = FeedBackPlaceholders[feedbackType];

  const [createFeedback, { isLoading }] = useCreateFeedbackMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FeedbackFormValues>({
    mode: "onChange",
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      const formData = new FormData();

      formData.append("type", feedbackType.toUpperCase().replace(" ", "_"));
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("pagePath", window.location.pathname);

      // validation
      if (file) {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

        if (!allowedTypes.includes(file.type)) {
          toast.error("Only JPG and PNG images allowed");
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size must be less than 5MB");
          return;
        }

        formData.append("screenshot", file);
      }

      await createFeedback(formData).unwrap();

      toast.success("Thanks for your feedback!");

      reset();
      setFile(null);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 500,
          bgcolor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
          p: 0.5,
          mx: "auto",
          mt: "10vh",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "92%",
            mx: "auto",
            justifyContent: "space-between",
            px: 1,
            pt: 1,
            pb: 1,
            // border: "2px solid red",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              // border: "2px solid green",
            }}
          >
            <Box
              sx={{
                p: 1,
                backgroundColor: "#EFF6FF",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageSquarePlus
                style={{ width: 24, height: 24, color: "#2563EB" }}
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "grey.900" }}
              >
                Share feedback
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "grey.500", mt: 0.5, ml: 0.5 }}
              >
                Help us improve your experience
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
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
            <X style={{ width: 28, height: 28 }} />
          </IconButton>
        </Box>

        {/* Type pills */}
        <FeebackPills
          feedbackType={feedbackType}
          setFeedbackType={setFeedbackType}
          FeedBackPlaceholders={FeedBackPlaceholders}
        />

        {/* Form */}
        <Box sx={{ width: "92%", mx: "auto", mb: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <TextField
              fullWidth
              placeholder={currentPlaceholder.title}
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{
                mb: 2,
                border: "1px solid #d1d6e0",
                borderRadius: 2,
                "& .MuiInputBase-root": {
                  bgcolor: "rgba(249,250,251,0.5)",
                  borderRadius: 2,
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: "#fff" },
                  "&.Mui-focused": {
                    bgcolor: "#fff",
                    boxShadow: "0 0 0 2px #2563eb22",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey.200",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey.300",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                  borderWidth: 2,
                },
                mt: 0.5,
              }}
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Minimum 5 characters",
                },
              })}
            />

            {/* Description */}
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder={currentPlaceholder.description}
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{
                mb: 2,
                border: "1px solid #d1d6e0",
                borderRadius: 2,
                "& .MuiInputBase-root": {
                  bgcolor: "rgba(249,250,251,0.5)",
                  borderRadius: 2,
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: "#fff" },
                  "&.Mui-focused": {
                    bgcolor: "#fff",
                    boxShadow: "0 0 0 2px #2563eb22",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey.200",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey.300",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                  borderWidth: 2,
                },
                mt: 0.5,
              }}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Minimum 10 characters",
                },
              })}
            />

            {/* File Upload */}
            <Button variant="outlined" component="label" sx={{ mb: 2 }}>
              {file ? file.name : "Add screenshot (optional)"}
              <input
                hidden
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (!selected) return;

                  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

                  // 🔥 Type validation
                  if (!allowedTypes.includes(selected.type)) {
                    toast.error("Only JPG and PNG images allowed");
                    e.target.value = ""; // reset input
                    return;
                  }

                  // 🔥 Size validation (5MB)
                  if (selected.size > 5 * 1024 * 1024) {
                    toast.error("File size must be less than 5MB");
                    e.target.value = ""; // reset input
                    return;
                  }

                  setFile(selected);
                }}
              />
            </Button>

            {/* Footer */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                onClick={onClose}
                sx={{
                  color: "grey.700",
                  bgcolor: "grey.100",
                  borderColor: "grey.200",
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1.5,
                  width: 120,
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
                disabled={!isValid || isLoading}
                sx={{
                  bgcolor: "#2563EB",
                  fontWeight: 500,
                  borderRadius: 2.5,
                  py: 1.5,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#1e40af",
                    transform: "scale(0.98)",
                  },
                  "&:active": { transform: "scale(0.95)" },
                  "&.Mui-disabled": {
                    bgcolor: "#93c5fd",
                    color: "#fff",
                    cursor: "not-allowed",
                  },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default FeedbackModal;
