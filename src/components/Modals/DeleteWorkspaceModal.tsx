import { useEffect } from "react";

import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useDeleteWorkspaceMutation } from "../../app/slices/workspaceApiSlice";
// import { useAppTheme } from "../../theme/useAppTheme";
import {
  ErrorData,
  WorkspaceDelete,
  WorkspaceDeleteModalProps,
} from "../../utils/types";
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

  const [deleteWorkspace, { isSuccess, isLoading, isError, error }] =
    useDeleteWorkspaceMutation();

  const handleDeleteWorkspace = async (data: WorkspaceDelete) => {
    const { confirmationText } = data;
    if (confirmationText === name) {
      await deleteWorkspace(workspaceId);
      navigate("/dash");
    } else {
      toast.error("Workspace name does not match", { position: "top-right" });
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

  useEffect(() => {
    if (isSuccess) {
      toast.success("Workspace Deleted !", {
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
