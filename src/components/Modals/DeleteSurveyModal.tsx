import { useEffect } from "react";

import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import { useDeleteSurveyMutation } from "../../app/slices/surveysApiSlice";
import { useToast } from "../../hooks/useToast";
import { SurveyRenameProps } from "../../utils/types";
import { ConfirmationInput } from "../ModalComponents/ConfirmationInput";
import { DangerActions } from "../ModalComponents/DangerActions";
import { DangerModalHeader } from "../ModalComponents/DangerModalHeader";
import { DangerModalShell } from "../ModalComponents/DangerModalShell";
import { DangerWarningBox } from "../ModalComponents/DangerWarningBox";
import { notifyAssistantSurveyDeleted } from "../Surveys/SurveyBuilderAssistant/surveyBuilderAssistantStorage";

type DeleteSurveyFormValues = {
  confirmationText: string;
};

const DeleteSurveyModal = ({
  open,
  onClose,
  sID,
  sTitle,
}: SurveyRenameProps) => {
  const expectedText = sTitle ?? "";

  const {
    control,
    reset,
    setFocus,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<DeleteSurveyFormValues>({
    mode: "onChange",
    defaultValues: { confirmationText: "" },
  });

  const confirmationText = watch("confirmationText") ?? "";

  const confirmationMatch =
    confirmationText === expectedText && confirmationText.length > 0;

  const [deleteSurvey, { isSuccess, isError, error, isLoading }] =
    useDeleteSurveyMutation();

  const handleDeleteSurvey = async ({
    confirmationText,
  }: DeleteSurveyFormValues) => {
    const input = confirmationText.trim();
    const expected = sTitle?.trim();

    if (input === expected && sID) {
      try {
        await deleteSurvey(sID).unwrap();
        notifyAssistantSurveyDeleted(sID);
      } catch {
        // The mutation state handles the existing error toast.
      }
    } else {
      console.error(error);
    }

    reset({ confirmationText: "" });
    onClose();
  };

  useEffect(() => {
    if (open) {
      reset({ confirmationText: "" });
      setTimeout(() => setFocus("confirmationText"), 0);
    }
  }, [open, reset, setFocus]);

  useToast({
    isSuccess,
    isError,
    error,
    successMessage: "Survey deleted!",
    errorFallbackMessage: "Could not delete survey. Please try again.",
    successToastOptions: {
      duration: 3000,
    },
  });

  return (
    <DangerModalShell open={open} onClose={onClose}>
      <DangerModalHeader title="Delete this survey?" onClose={onClose} />

      <Box component="div" sx={{ px: 4, py: 4 }}>
        <Box component="div" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <DangerWarningBox text="You will lose all the data associated with this survey." />

          <Typography sx={{ fontWeight: 600 }}>
            <Box component="span" sx={{ color: "#dc2626" }}>
              {expectedText}
            </Box>{" "}
            will be permanently deleted
          </Typography>

          <form onSubmit={handleSubmit(handleDeleteSurvey)}>
            <ConfirmationInput
              expectedText={expectedText}
              confirmationText={confirmationText}
              confirmationMatch={confirmationMatch}
              control={control}
              errors={errors}
              touchedFields={touchedFields}
            />

            <DangerActions
              onClose={onClose}
              disabled={!confirmationMatch || isLoading}
              confirmationMatch={confirmationMatch}
              isLoading={isLoading}
              loadingText="Deleting..."
            />
          </form>
        </Box>
      </Box>
    </DangerModalShell>
  );
};

export default DeleteSurveyModal;
