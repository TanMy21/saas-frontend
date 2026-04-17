import { useEffect } from "react";

import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useUpdateWorkspaceNameMutation } from "../../app/slices/workspaceApiSlice";
// import { useAppTheme } from "../../theme/useAppTheme";
import {
  ErrorData,
  WorkspaceRename,
  WorkspaceRenameModalProps,
} from "../../utils/types";
import { FormField } from "../ModalComponents/FormFields";

import { BaseModal } from "./BaseModal";

const RenameWorkspaceModal = ({
  open,
  onClose,
  selectedWorkspace,
  setSelectedWorkspace,
}: WorkspaceRenameModalProps) => {
  // const { background, textStyles } = useAppTheme();
  const [updateWorkspaceName, { isLoading, isSuccess, isError, error }] =
    useUpdateWorkspaceNameMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<WorkspaceRename>();

  const { workspaceId } = selectedWorkspace ?? {};

  const renameWorkspace = async (data: WorkspaceRename) => {
    const { name } = data;
    const updated = await updateWorkspaceName({ workspaceId, name }).unwrap();

    if (selectedWorkspace?.workspaceId === updated.workspaceId) {
      setSelectedWorkspace((prev) =>
        prev ? { ...prev, name: updated.name } : prev,
      );
    }

    onClose();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Workspace Renamed Successfully !", {
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
    <BaseModal
      open={open}
      onClose={onClose}
      title="Rename workspace"
      subtitle="Choose a new name for your workspace"
      icon={<EditIcon style={{ width: 28, height: 28, color: "#2563EB" }} />}
    >
      <Box component="form" onSubmit={handleSubmit(renameWorkspace)}>
        {/* Label */}
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 700,
            color: "grey.700",
            mb: 1,
            ml: 1,
          }}
        >
          Workspace name
        </Typography>

        <FormField
          name="name"
          control={control}
          errors={errors}
          touchedFields={touchedFields}
          placeholder="Enter workspace name..."
          rules={{
            required: "Workspace name is required",
            maxLength: {
              value: 50,
              message: "Max 50 characters",
            },
          }}
          inputProps={{
            maxLength: 50,
            autoFocus: true,
          }}
        />

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button type="submit" disabled={isLoading} variant="modalSubmitBtn">
            {isLoading ? (
              <>
                <CircularProgress size={18} sx={{ color: "#fff", mr: 1 }} />
                Renaming...
              </>
            ) : (
              "Rename"
            )}
          </Button>
        </Box>
      </Box>
    </BaseModal>
  );
};

export default RenameWorkspaceModal;
