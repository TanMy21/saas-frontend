import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

import { ShareSurveyProps } from "../../utils/types";

const ShareSurveyModal = ({
  open,
  setOpen,
  setShareBtnSelected,
  setOpenSnackbar,
}: ShareSurveyProps) => {
  const { surveyID } = useParams();
  const shareBaseURL = import.meta.env.VITE_SHARE_BASE_URL;
  const shareURL = `${shareBaseURL}/${surveyID}`;

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(shareURL);
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Unable to copy to clipboard.", err);
    }
  };

  const handleClose = () => {
    setShareBtnSelected(false);
    setOpen(false);
  };
  return (
    <>
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
            borderRadius: "8px",
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
                  Share your survey
                </Typography>
              </Box>
              <Box sx={{ marginTop: "-6%" }}>
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                padding: "2%",
                marginTop: "4%",
                marginLeft: "auto",
                marginRight: "auto",
                width: "100%",
                height: "80px",
              }}
            >
              <Paper
                component="form"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: 500,
                  height: "40px",
                  borderRadius: "4px",
                }}
              >
                <InputBase
                  sx={{ ml: 2, flex: 1 }}
                  placeholder="Link"
                  value={shareURL}
                />

                <Button
                  variant="contained"
                  onClick={handleCopyClick}
                  endIcon={<ContentCopyIcon />}
                  sx={{
                    height: "100%",
                    fontWeight: "bold",
                    marginLeft: "4%",
                    backgroundColor: "#262627",
                    textTransform: "capitalize",
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                    borderTopRightRadius: "4px",
                    borderBottomRightRadius: "4px",
                    "&:hover": {
                      backgroundColor: "#262627",
                    },
                  }}
                >
                  Copy Link
                </Button>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ShareSurveyModal;
