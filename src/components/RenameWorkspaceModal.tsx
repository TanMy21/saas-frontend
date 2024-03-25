import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";

const RenameWorkspaceModal = ({ visible }) => {
  console.log("Rename Modal: ", visible);
  const [open, setOpen] = useState(visible);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setOpen(visible);
  }, [visible]);

  console.log("Rename Modal: ", open);

  const internalHandleClose = () => {
    handleClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={internalHandleClose}
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
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Rename workspace
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
            <form>
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
                      Rename
                    </Button>
                  </Box>
                </Box>
              </Box>
            </form>
          </Box>
          <Box></Box>
        </Box>
      </Modal>
    </>
  );
};
export default RenameWorkspaceModal;
