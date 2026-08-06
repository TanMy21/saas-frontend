import { useEffect } from "react";

import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useDeleteWorkspaceMutation } from "../../app/slices/workspaceApiSlice";
// import { useAppTheme } from "../../theme/useAppTheme";
import { showToast } from "../../utils/showToast";
import { WorkspaceDelete, WorkspaceDeleteModalProps } from "../../utils/types";
import { ConfirmationInput } from "../ModalComponents/ConfirmationInput";
import { DangerActions } from "../ModalComponents/DangerActions";
import { DangerModalHeader } from "../ModalComponents/DangerModalHeader";
import { DangerModalShell } from "../ModalComponents/DangerModalShell";
import { DangerWarningBox } from "../ModalComponents/DangerWarningBox";

const DeleteWorkspaceModal = ({
  open,
  onClose,
  selectedWorkspace,
}: WorkspaceDeleteModalProps) => {
  // const { background, textStyles } = useAppTheme();
  const navigate = useNavigate();
  const { workspaceId, name } = selectedWorkspace ?? {};

  const expectedText = name ?? "";

  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    watch,
    formState: { errors, touchedFields },
  } = useForm<WorkspaceDelete>({
    mode: "onChange",
    defaultValues: { confirmationText: "" },
  });

  const confirmationText = watch("confirmationText") ?? "";

  const confirmationMatch =
    confirmationText === expectedText && confirmationText.length > 0;

  const [deleteWorkspace, { isLoading }] = useDeleteWorkspaceMutation();

  const handleDeleteWorkspace = async (data: WorkspaceDelete) => {
    const { confirmationText } = data;

    if (confirmationText !== name) {
      showToast.error("Workspace name does not match.");
      return;
    }

    try {
      await deleteWorkspace(workspaceId).unwrap();
      showToast.success("Workspace deleted!", { duration: 3000 });
      reset({ confirmationText: "" });
      onClose();
      navigate("/dash");
    } catch (deleteError: unknown) {
      const status =
        typeof deleteError === "object" &&
        deleteError !== null &&
        "status" in deleteError
          ? deleteError.status
          : undefined;

      if (status === 409) {
        showToast.error("The default or only workspace cannot be deleted.");
        return;
      }

      showToast.apiError(deleteError, {
        fallbackMessage: "Could not delete workspace.",
      });
    }
  };

  useEffect(() => {
    if (open) {
      reset({ confirmationText: "" });
      setTimeout(() => setFocus("confirmationText"), 0);
    }
  }, [open, reset, setFocus]);

  return (
    <DangerModalShell open={open} onClose={onClose}>
      <DangerModalHeader title="Delete this Workspace?" onClose={onClose} />

      <Box sx={{ px: 4, py: 4 }}>
        <DangerWarningBox text="You will lose all the data..." />

        <Typography sx={{ mt: 2, ml: 1, mb: 1 }}>
          <Box component="span" sx={{ color: "#dc2626" }}>
            {expectedText}
          </Box>{" "}
          will be permanently deleted
        </Typography>

        <form onSubmit={handleSubmit(handleDeleteWorkspace)}>
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
    </DangerModalShell>
  );
};

export default DeleteWorkspaceModal;
