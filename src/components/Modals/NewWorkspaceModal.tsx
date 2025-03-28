import { useEffect } from "react";

import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useCreateNewWorkspaceMutation } from "../../app/slices/workspaceApiSlice";
import {
  ErrorData,
  NewWorkspaceModalProps,
  WorkspaceDropDownMenu,
} from "../../utils/types";

const NewWorkspaceModal = ({ open, setOpen }: NewWorkspaceModalProps) => {
  const [createNewWorkspace, { isSuccess, isError, error }] =
    useCreateNewWorkspaceMutation();

  const { register, handleSubmit } = useForm<WorkspaceDropDownMenu>();

  const createWorkspace = async (data: WorkspaceDropDownMenu) => {
    const { workspaceName } = data;
    try {
      await createNewWorkspace({ workspaceName });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Workspace Created !", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "colored",
      });
      setOpen(false);
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
        disableEnforceFocus
        disableAutoFocus
        keepMounted
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
            height: 128,
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
                  Create a new workspace
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <form onSubmit={handleSubmit(createWorkspace)}>
              <Box>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  size="small"
                  placeholder="Name your workspace"
                  autoFocus
                  {...register("workspaceName")}
                  inputProps={{ autoComplete: "off" }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    gap: 4,
                    mt: 1,
                  }}
                >
                  <Button
                    type="button"
                    onClick={() => setOpen(false)}
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
                      width: "48%",
                      height: "80%",
                      p: 1,
                      backgroundColor: "#752FEC",
                      color: "white",
                      fontWeight: "bold",
                      "&.MuiButton-root:hover": {
                        bgcolor: "#752FEC",
                      },
                      textTransform: "unset",
                      borderRadius: 2,
                    }}
                  >
                    Create workspace
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
export default NewWorkspaceModal;
