import { useEffect } from "react";

import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useDeleteWorkspaceMutation } from "../../app/slices/workspaceApiSlice";
import { useAppTheme } from "../../theme/useAppTheme";
import {
  ErrorData,
  WorkspaceDelete,
  WorkspaceDeleteModalProps,
} from "../../utils/types";

const DeleteWorkspaceModal = ({
  open,
  onClose,
  selectedWorkspace,
}: WorkspaceDeleteModalProps) => {
  const { background, textStyles } = useAppTheme();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<WorkspaceDelete>();
  const [deleteWorkspace, { isSuccess, isLoading, isError, error }] =
    useDeleteWorkspaceMutation();

  const { workspaceId, name } = selectedWorkspace ?? {};
  const handleDeleteWorkspace = async (data: WorkspaceDelete) => {
    const { workspaceName } = data;

    if (workspaceName === name) {
      await deleteWorkspace(workspaceId);
      navigate("/dash");
    } else {
      toast.error("Workspace name does not match", { position: "top-right" });
    }
    onClose();
  };

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
          width: 400,
          minHeight: 240,
          bgcolor: background.paper,
          borderRadius: 1,
          p: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography sx={textStyles.strongH6}>
                Delete this Workspace?
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.9rem", color: "red" }}>
              You will lose all the data associated with this workspace:
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "98%",
              height: "60%",
              textWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                lineHeight: 1.4,
              }}
              mt={1}
              mb={2}
            >
              {name} will be permanently deleted{" "}
            </Typography>
          </Box>
          <Box>
            <Typography>Enter the workspace name to confirm</Typography>
          </Box>
        </Box>
        <Box>
          <form onSubmit={handleSubmit(handleDeleteWorkspace)}>
            <Box>
              <TextField
                margin="normal"
                required
                fullWidth
                size="small"
                placeholder={"Enter workspace name to delete"}
                id="workspaceName"
                autoComplete="Name of Workspace"
                autoFocus
                {...register("workspaceName")}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  height: "40px",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outlined"
                  size="small"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="dangerBtn" size="small">
                  {isLoading ? "Deleting..." : "Yes, Delete it"}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteWorkspaceModal;
