import { useEffect } from "react";

import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useUpdateWorkspaceNameMutation } from "../../app/slices/workspaceApiSlice";
import { useAppTheme } from "../../theme/useAppTheme";
import {
  ErrorData,
  WorkspaceRename,
  WorkspaceRenameModalProps,
} from "../../utils/types";

const RenameWorkspaceModal = ({
  open,
  onClose,
  selectedWorkspace,
}: WorkspaceRenameModalProps) => {
  const { background, textStyles } = useAppTheme();
  const [updateWorkspaceName, { isSuccess, isError, error }] =
    useUpdateWorkspaceNameMutation();

  const { register, handleSubmit } = useForm<WorkspaceRename>();

  const { workspaceId, name } = selectedWorkspace ?? {};

  const renameWorkspace = async (data: WorkspaceRename) => {
    const { name } = data;
    await updateWorkspaceName({ workspaceId, name });
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
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isSuccess, isError, error]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: 128,
          width: 400,
          bgcolor: background.paper,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography sx={textStyles.strongH6}>Rename workspace</Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <form onSubmit={handleSubmit(renameWorkspace)}>
            <Box>
              <TextField
                margin="normal"
                required
                fullWidth
                size="small"
                defaultValue={name}
                id="workspaceName"
                autoComplete="Name of Workspace"
                autoFocus
                {...register("name")}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  gap: 4,
                  mt: 1,
                  // border: "2px solid red",
                }}
              >
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outlined"
                  size="medium"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="submitBtn2" size="small">
                  Rename
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default RenameWorkspaceModal;
