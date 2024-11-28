import { useEffect } from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useUpdateWorkspaceNameMutation } from "../../app/slices/workspaceApiSlice";
import { ErrorData, WorkspaceRenameModalProps } from "../../utils/types";

const RenameWorkspaceModal = ({
  open,
  onClose,
  workspaceId,
  workspaceName,
}: WorkspaceRenameModalProps) => {
  const [updateWorkspaceName, { isSuccess, isError, error }] =
    useUpdateWorkspaceNameMutation();

  const { register, handleSubmit } = useForm<WorkspaceRenameModalProps>();

  const renameWorkspace = async (data: WorkspaceRenameModalProps) => {
    const { workspaceName } = data;
    await updateWorkspaceName({ workspaceId, name: workspaceName });
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
    <>
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
            bgcolor: "background.paper",
            borderRadius: 1,
            p: 4,
          }}
        >
          <Box>
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Box>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Rename Workspace
                </Typography>
              </Box>
              <Box>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={onClose}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box>
            <form onSubmit={handleSubmit(renameWorkspace)}>
              <Box sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  size="small"
                  defaultValue={workspaceName}
                  id="workspaceName"
                  autoComplete="Name of Workspace"
                  autoFocus
                  {...register("workspaceName")}
                />
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"flex-end"}
                >
                  <Box mr={2}>
                    <Button
                      type="button"
                      onClick={onClose}
                      variant="text"
                      size="small"
                      sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: "#E4E2E2",
                        color: "black",
                        "&.MuiButton-root:hover": {
                          bgcolor: "#E4E2E2",
                        },
                        textTransform: "capitalize",
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      type="submit"
                      variant="text"
                      size="small"
                      sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: "#E4E2E2",
                        color: "black",
                        "&.MuiButton-root:hover": {
                          bgcolor: "#E4E2E2",
                        },
                        textTransform: "capitalize",
                      }}
                    >
                      Rename
                    </Button>
                  </Box>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default RenameWorkspaceModal;
