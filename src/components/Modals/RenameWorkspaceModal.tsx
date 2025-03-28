import { useEffect } from "react";

import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useUpdateWorkspaceNameMutation } from "../../app/slices/workspaceApiSlice";
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
            height: 128,
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 3,
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
                  Rename workspace
                </Typography>
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
                    variant="text"
                    size="small"
                    sx={{
                      width: "16%",
                      height: "80%",
                      p: 1,
                      backgroundColor: "#E4E2E2",
                      color: "black",
                      fontWeight: "bold",
                      "&.MuiButton-root:hover": {
                        bgcolor: "#E4E2E2",
                      },
                      textTransform: "capitalize",
                      borderRadius: 2,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="text"
                    size="small"
                    sx={{
                      width: "28%",
                      height: "80%",
                      p: 1,
                      backgroundColor: "#752FEC",
                      color: "white",
                      fontWeight: "bold",
                      "&.MuiButton-root:hover": {
                        bgcolor: "#752FEC",
                      },
                      textTransform: "capitalize",
                      borderRadius: 2,
                    }}
                  >
                    Rename
                  </Button>
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
