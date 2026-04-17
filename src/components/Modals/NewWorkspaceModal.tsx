import { useEffect } from "react";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { SquarePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useCreateNewWorkspaceMutation } from "../../app/slices/workspaceApiSlice";
// import { useAppTheme } from "../../theme/useAppTheme";
import {
  ErrorData,
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

  useEffect(() => {
    if (isSuccess) {
      toast.success("Workspace Created !", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "colored",
      });
      reset({ workspaceName: "" });
      onClose();
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
  }, [isSuccess, isError, error, reset]);

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
