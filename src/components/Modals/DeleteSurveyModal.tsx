import { useEffect } from "react";

import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useDeleteSurveyMutation } from "../../app/slices/surveysApiSlice";
import { ErrorData, SurveyDelete, SurveyRenameProps } from "../../utils/types";
import { ConfirmationInput } from "../ModalComponents/ConfirmationInput";
import { DangerActions } from "../ModalComponents/DangerActions";
import { DangerModalHeader } from "../ModalComponents/DangerModalHeader";
import { DangerModalShell } from "../ModalComponents/DangerModalShell";
import { DangerWarningBox } from "../ModalComponents/DangerWarningBox";

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
  } = useForm<SurveyRenameProps>({
    mode: "onChange",
    defaultValues: { confirmationText: "" },
  });

  const confirmationText = watch("confirmationText") ?? "";

  const confirmationMatch =
    confirmationText === expectedText && confirmationText.length > 0;

  const [deleteSurvey, { isSuccess, isError, error, isLoading }] =
    useDeleteSurveyMutation();

  const handleDeleteSurvey = async (data: SurveyDelete) => {
    const input = data.confirmationText?.trim();
    const expected = sTitle?.trim();
    if (input === expected) {
      await deleteSurvey(sID);
    } else {
      console.log(error);
    }
    reset({ confirmationText: "" });
    onClose();
  };

  console.log("stitle", sTitle);

  useEffect(() => {
    if (open) {
      reset({ confirmationText: "" });
      setTimeout(() => setFocus("confirmationText"), 0);
    }
  }, [open, reset, setFocus]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Survey Deleted !", {
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
          }),
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isSuccess, isError, error]);

  return (
    <DangerModalShell open={open} onClose={onClose}>
      <DangerModalHeader title="Delete this survey?" onClose={onClose} />

      <Box sx={{ px: 4, py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
