import { useState } from "react";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkIcon from "@mui/icons-material/Link";
import ShareIcon from "@mui/icons-material/Share";
import XIcon from "@mui/icons-material/X";
import {
  Box,
  Button,
  InputAdornment,
  InputBase,
  Modal,
  TextField,
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
  const [copied, setCopied] = useState(false);
  const { surveyID } = useParams();
  const shareBaseURL = import.meta.env.VITE_SHARE_BASE_URL;
  const shareURL = `${shareBaseURL}/${surveyID}`;

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(shareURL);
      setOpenSnackbar(true);
      setCopied(true);
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
            display: "flex",
            flexDirection: "column",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 212,
            bgcolor: "background.paper",
            borderRadius: "8px",
            // border: "2px solid red",
          }}
        >
          {/* Modal title */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              padding: "2%",
              width: "96%",
              alignItems: "center",
              gap: 2,
              // border: "2px solid green",
            }}
          >
            <ShareIcon />
            <Typography
              id="modal-modal-title"
              fontSize={24}
              sx={{ color: "#37415C" }}
            >
              Share your survey
            </Typography>
          </Box>
          {/* shareURL */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "1%",
              marginTop: "1%",
              marginLeft: "auto",
              marginRight: "auto",
              width: "92%",
              height: "98%",
              // border: "2px solid blue",
            }}
          >
            {/* share survey link */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "1%",
                width: "98%",
                height: "80px",
                // border: "2px solid orange",
              }}
            >
              <Box>
                <Typography
                  fontSize={16}
                  fontWeight={"bold"}
                  mb={1}
                  color="#37415C"
                >
                  Survey Link
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                  width: "98%",
                  height: "48px",
                  gap: 2,
                  // border: "2px solid green",
                }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="share-link"
                  InputLabelProps={{ style: { color: "gray" } }}
                  value={shareURL}
                  variant="filled"
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#F8F9FF",
                    "& .MuiFilledInput-root": {
                      height: "40px",
                      borderRadius: "12px",
                      backgroundColor: "#F8F9FF",
                      borderBottom: "none !important",
                      display: "flex",
                      alignItems: "center",
                      paddingTop: "0px",
                      paddingBottom: "0px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      "& input": {
                        padding: 0,
                        paddingLeft: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                      "&:before, &:after": {
                        display: "none",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ marginBottom: "16px" }}
                      >
                        <LinkIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleCopyClick}
                  endIcon={<ContentCopyIcon />}
                  sx={{
                    marginBottom: "2%",
                    borderRadius: 2,
                    px: 3,
                    py: 0.8,
                    fontWeight: "bold",
                    ...(copied
                      ? {
                          backgroundColor: "#F9FAFB",
                          borderColor: "#E5E7EB",
                          color: "#374151",
                        }
                      : {
                          backgroundColor: "#F9FAFB",
                          borderColor: "#E5E7EB",
                          color: "#374151",
                          "&:hover": { backgroundColor: "#F9FAFB" },
                        }),
                    textTransform: "none",
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </Box>
            </Box>

            {/* Share Options */}
            {/* <Box sx={{ border: "2px solid orange" }}>
              <Typography
                variant="body2"
                fontWeight={500}
                mb={1}
                color="text.secondary"
              >
                Share via
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1.5,
                }}
              >
                {[
                  {
                    label: "Email",
                    icon: <EmailIcon />,
                  },
                  {
                    label: "X",
                    icon: <XIcon />,
                  },
                  {
                    label: "Facebook",
                    icon: <FacebookIcon />,
                  },
                ].map(({ label, icon }) => (
                  <Button
                    key={label}
                    variant="outlined"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      py: 2,
                      borderRadius: 2,
                      borderColor: "#e5e7eb",
                      color: "#4b5563",
                      "&:hover": { backgroundColor: "#f9fafb" },
                      textTransform: "none",
                    }}
                  >
                    {icon}
                    <Typography variant="caption">{label}</Typography>
                  </Button>
                ))}
              </Box>
            </Box> */}

            {/* QR Code */}
            {/* <Box sx={{ border: "2px solid purple" }}>
              <Typography
                variant="body2"
                fontWeight={500}
                mb={1}
                color="text.secondary"
              >
                QR Code
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  backgroundColor: "#f9fafb",
                }}
              >
                <img alt="QR Code" width={128} height={128} />
              </Box>
            </Box> */}
          </Box>
          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
              borderTop: "1px solid #f3f4f6",
              pb: 1,
              // border: "2px solid red",
            }}
          >
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant="outlined"
              size="small"
              sx={{
                width: "16%",
                height: "80%",
                p: 1,
                mr: 3,
                mt: 1,
                color: "#374151",
                borderColor: "#E5E7EB",
                fontWeight: "bold",
                "&.MuiButton-root:hover": {
                  bgcolor: "transparent",
                },
                textTransform: "capitalize",
                borderRadius: 2,
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ShareSurveyModal;
