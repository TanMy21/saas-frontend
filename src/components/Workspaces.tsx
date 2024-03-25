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

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";

const Workspaces = ({ workspaces }) => {
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
    console.log(workspaceName);
  };

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
              marginLeft: "80%",
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
                          Create Workspace
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </form>
              </Box>
              <Box></Box>
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
                          sx={{ fontSize: ".4rem" }}
                          primary={workspace?.name}
                        />
                      </Box>
                      <Box>
                        <ListItemText primary={"0"} />
                      </Box>
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
