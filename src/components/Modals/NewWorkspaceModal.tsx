import { useEffect } from "react";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { SquarePlus } from "lucide-react";
import { useForm } from "react-hook-form";

import { useCreateNewWorkspaceMutation } from "../../app/slices/workspaceApiSlice";
// import { useAppTheme } from "../../theme/useAppTheme";
import { useToast } from "../../hooks/useToast";
import {
  NewWorkspaceModalProps,
  WorkspaceDropDownMenu,
} from "../../utils/types";
import { FormField } from "../ModalComponents/FormFields";

import { BaseModal } from "./BaseModal";

const NewWorkspaceModal = ({ open, onClose }: NewWorkspaceModalProps) => {
  // const { background, textStyles } = useAppTheme();
  const [createNewWorkspace, { isLoading, isSuccess, isError, error }] =
    useCreateNewWorkspaceMutation();

  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, touchedFields },
  } = useForm<WorkspaceDropDownMenu>({ defaultValues: { workspaceName: "" } });

  const createWorkspace = async (data: WorkspaceDropDownMenu) => {
    const { workspaceName } = data;
    try {
      await createNewWorkspace({ workspaceName });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (open) {
      reset({ workspaceName: "" });
      setTimeout(() => setFocus("workspaceName"), 0);
    }
  }, [open, reset, setFocus]);

  useToast({
    isSuccess,
    isError,
    error,
    successMessage: "Workspace created!",
    errorFallbackMessage: "Could not create workspace. Please try again.",
    successToastOptions: {
      duration: 3000,
    },
    onSuccess: () => {
      reset({ workspaceName: "" });
      onClose();
    },
  });

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Create new workspace"
      subtitle="Choose a name for your workspace"
      icon={<SquarePlus style={{ width: 28, height: 28, color: "#2563EB" }} />}
    >
      <Box component="form" onSubmit={handleSubmit(createWorkspace)}>
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
          name="workspaceName"
          control={control}
          errors={errors}
          touchedFields={touchedFields}
          placeholder="Enter workspace name..."
          autoFocus
          rules={{
            required: "Workspace name is required",
            maxLength: {
              value: 50,
              message: "Max 50 characters",
            },
          }}
          inputProps={{
            maxLength: 50,
          }}
        />

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button type="submit" variant="modalSubmitBtn" disabled={isLoading}>
            {isLoading ? (
              <>
                <CircularProgress size={18} sx={{ color: "#fff", mr: 1 }} />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </Box>
      </Box>
    </BaseModal>
  );
};

export default NewWorkspaceModal;
