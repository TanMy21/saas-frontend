import { useEffect } from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import { useDeleteWorkspaceMutation } from "../../app/slices/workspaceApiSlice";
import { ErrorData, WorkspaceDeleteModalProps } from "../../utils/types";
import { useNavigate } from "react-router-dom";

const DeleteWorkspaceModal = ({
  open,
  onClose,
  wsID,
  wsName,
}: WorkspaceDeleteModalProps) => {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<WorkspaceDeleteModalProps>();
  const [deleteWorkspace, { isSuccess, isLoading, isError, error }] =
    useDeleteWorkspaceMutation();

  const handleDeleteWorkspace = async (data: WorkspaceDeleteModalProps) => {
    const { workspaceName } = data;

    if (workspaceName === wsName) {
      await deleteWorkspace(wsID);
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
                Delete this Workspace?
              </Typography>
            </Box>
            <Box>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={onClose}
                sx={{ marginTop: -2 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.9rem" }}>
              You will lose all the data associated with this workspace:
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }} mt={1} mb={1}>
              {wsName} will be permanently deleted.
            </Typography>
          </Box>
          <Box>
            <Typography>Enter the workspace name to confirm.</Typography>
          </Box>
        </Box>
        <Box>
          <form onSubmit={handleSubmit(handleDeleteWorkspace)}>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                size="small"
                defaultValue={"Workspace name"}
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
                      backgroundColor: "#B31212",
                      color: "white",
                      "&.MuiButton-root:hover": {
                        bgcolor: "#B31212",
                      },
                      textTransform: "capitalize",
                    }}
                    color="error"
                  >
                    {isLoading ? "Deleting..." : "Yes, Delete it"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteWorkspaceModal;
