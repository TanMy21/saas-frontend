import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useCreateNewWorkspaceMutation } from "../app/slices/workspaceApiSlice";
import { toast } from "react-toastify";
import WorkspaceSurveysListCount from "./WorkspaceSurveysListCount";

const Workspaces = ({ workspaces }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState();

  const [createNewWorkspace, { isSuccess, isError, error }] =
    useCreateNewWorkspaceMutation();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const createWorkspace = async (data) => {
    const { workspaceName } = data;
    //unwrap for try catch block add if needed
    await createNewWorkspace({ workspaceName });
    console.log(workspaceName);
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
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: "top-right",
        });
      }
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (workspaces?.length > 0) {
      const firstWorkspaceId = workspaces[0].workspaceId;
      navigate(`/dash/w/${firstWorkspaceId}`);
    }
  }, [workspaces, navigate]);

  useEffect(() => {
    console.log("Workspace: ", location);
    navigate(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Stack>
        <Box sx={{ width: "90%", height: "60px" }}>
          <IconButton
            onClick={handleOpen}
            sx={{
              background: "#47658F",
              width: "32px",
              height: "32px",
              marginLeft: "92%",
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
        <Box sx={{ width: "100%", height: "200px" }}>
          <List>
            {workspaces?.map((workspace) => (
              <ListItem key={workspace?.workspaceId} disablePadding>
                <ListItemButton sx={{ padding: "0px", marginBottom: "4px" }}>
                  <NavLink
                    to={`/dash/w/${workspace?.workspaceId}`}
                    style={({ isActive, isPending, isTransitioning }) => {
                      return {
                        width: "100%",
                        height: "32px",
                        padding: "8px",
                        fontWeight: isActive ? "bold" : "",
                        textDecoration: "none",
                        color: "#262627",
                        fontFamily: "sans-serif",
                        textOverflow: "ellipsis",
                        backgroundColor: isActive ? "#E4E2E2" : "",
                      };
                    }}
                  >
                    <Box
                      component="main"
                      display={"flex"}
                      justifyContent={"space-between"}
                    >
                      <Box>
                        <ListItemText
                          sx={{ fontSize: "12px" }}
                          primary={workspace?.name}
                        />
                      </Box>
                      <WorkspaceSurveysListCount
                        workspaceId={workspace?.workspaceId}
                      />
                    </Box>
                  </NavLink>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Stack>
    </>
  );
};

export default Workspaces;
