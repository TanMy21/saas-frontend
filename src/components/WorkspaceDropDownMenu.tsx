import {
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import {
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceNameMutation,
} from "../app/slices/workspaceApiSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const WorkspaceDropDown = ({ wsName }) => {
  let { workspaceId } = useParams();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const [updateWorkspaceName] = useUpdateWorkspaceNameMutation();
  const [deleteWorkspace] = useDeleteWorkspaceMutation();

  const open = Boolean(menuAnchor);

  const [openRenameModel, setOpenRenameModel] = useState(false);
  const handleOpenModalRename = () => setOpenRenameModel(true);
  const handleCloseModalRename = () => setOpenRenameModel(false);

  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const handleOpenModalDelete = () => setOpenDeleteModel(true);
  const handleCloseModalDelete = () => setOpenDeleteModel(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleClose = (option: string) => {
    setMenuAnchor(null);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const renameWorkspace = async (data) => {
    const { workspaceName } = data;
    updateWorkspaceName({ workspaceId, name: workspaceName });
    handleCloseModalRename();
  };

  const handleDeleteWorkspace = async (data) => {
    const { workspaceName } = data;
    if (workspaceName === wsName) {
      deleteWorkspace(workspaceId);
    } else {
      toast.error("Workspace name does not match", { position: "top-right" });
    }
    handleCloseModalDelete();
  };

  return (
    <>
      <Box>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={menuAnchor}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleOpenModalRename}>Rename</MenuItem>
          <Divider />
          <MenuItem sx={{ color: "red" }} onClick={handleOpenModalDelete}>
            Delete
          </MenuItem>
        </Menu>
        {/* /* Modal **/}
        <Modal
          open={openRenameModel}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute" as "absolute",
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
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Rename Workspace
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleCloseModalRename}
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
                    defaultValue={wsName}
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
                        onClick={handleCloseModalRename}
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
        {/* Delete Modal */}
        <Modal
          open={openDeleteModel}
          onClose={handleCloseModalDelete}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute" as "absolute",
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
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Delete this Workspace?
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleCloseModalDelete}
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
                        onClick={handleCloseModalDelete}
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
                        }}
                        color="error"
                      >
                        Yes, Delete it
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};
export default WorkspaceDropDown;
