import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useCreateNewWorkspaceMutation } from "../../app/slices/workspaceApiSlice";
import { ErrorData, WorkspaceData } from "../../utils/types";

const NewWorkspaceModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [createNewWorkspace, { isSuccess, isError, error }] =
    useCreateNewWorkspaceMutation();

  const { register, handleSubmit } = useForm<WorkspaceData>();

  const createWorkspace = async (data: WorkspaceData) => {
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
      handleClose();
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
    <Box
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"end"}
      sx={{
        width: "96%",
        height: "48px",
        marginTop: "8%",
      }}
    >
      <IconButton
        onClick={handleOpen}
        sx={{
          background: "#47658F",
          maxWidth: "32px",
          maxHeight: "32px",
          marginRight: "2%",
          marginTop: "8%",
          borderRadius: 1,
          color: "white",
          "&:hover": {
            backgroundColor: "#47658F",
          },
        }}
      >
        <AddOutlinedIcon fontSize="medium" />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
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
                  Create a new workspace
                </Typography>
              </Box>
              <Box>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box>
            <form onSubmit={handleSubmit(createWorkspace)}>
              <Box sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  size="small"
                  defaultValue={"Name your workspace"}
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
                      onClick={handleClose}
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
                      Create Workspace
                    </Button>
                  </Box>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default NewWorkspaceModal;
