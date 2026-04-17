import { useState } from "react";

import { Box, Button, CircularProgress } from "@mui/material";
import { MessageSquarePlus } from "lucide-react";
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
import FeedbackScreenshotUpload from "../ModalComponents/FeedbackScreenshotUpload";
import { FormField } from "../ModalComponents/FormFields";

import { BaseModal } from "./BaseModal";

const FeedbackModal = ({ open, onClose }: FeedbackModalProps) => {
  const [feedbackType, setFeedbackType] =
    useState<FeedbackTypeUI>("Feature request");
  const [file, setFile] = useState<File | null>(null);
  const currentPlaceholder = FeedBackPlaceholders[feedbackType];

  const [createFeedback, { isLoading }] = useCreateFeedbackMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, touchedFields },
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
    <BaseModal
      open={open}
      onClose={onClose}
      title="Share feedback"
      subtitle="Help us improve your experience"
      icon={
        <MessageSquarePlus
          style={{ width: 28, height: 28, color: "#2563EB" }}
        />
      }
    >
      {/* Type pills */}
      <FeebackPills
        feedbackType={feedbackType}
        setFeedbackType={setFeedbackType}
        FeedBackPlaceholders={FeedBackPlaceholders}
      />

      {/* Form */}
      <Box sx={{ mt: 1.5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <FormField
            name="title"
            control={control}
            errors={errors}
            touchedFields={touchedFields}
            placeholder={currentPlaceholder.title}
            rules={{
              required: "Title is required",
              minLength: { value: 5, message: "Minimum 5 characters" },
            }}
          />

          {/* Description */}
          <FormField
            name="description"
            control={control}
            errors={errors}
            touchedFields={touchedFields}
            placeholder={currentPlaceholder.description}
            multiline
            rows={4}
            rules={{
              required: "Description is required",
              minLength: { value: 10, message: "Minimum 10 characters" },
            }}
          />

          {/* Screenshot  */}
          <FeedbackScreenshotUpload file={file} setFile={setFile} />

          {/* Footer */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
          >
            <Button onClick={onClose} variant="modalCancelBtn">
              Cancel
            </Button>

            <Button
              type="submit"
              variant="modalSubmitBtn"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </BaseModal>
  );
};

export default FeedbackModal;
