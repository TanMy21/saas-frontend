import { useEffect, useRef, useState } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
// import EmailIcon from "@mui/icons-material/Email";
// import FacebookIcon from "@mui/icons-material/Facebook";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ShareIcon from "@mui/icons-material/Share";
// import XIcon from "@mui/icons-material/X";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  // InputBase,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import QRCode from "react-qr-code";

import { ShareSurveyProps } from "../../utils/types";

const ShareSurveyModal = ({
  open,
  setOpen,
  setShareBtnSelected,
  setOpenSnackbar,
  shareID,
}: ShareSurveyProps) => {
  // const { background, textStyles } = useAppTheme();
  const [_copied, setCopied] = useState(false);

  const [copyLinkStatus, _setCopyLinkStatus] = useState<"idle" | "copied">(
    "idle"
  );
  const [copyQrStatus, setCopyQrStatus] = useState<
    "idle" | "copying" | "copied"
  >("idle");
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "downloading" | "downloaded"
  >("idle");
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const shareBaseURL = import.meta.env.VITE_SHARE_BASE_URL;
  const shareURL = `${shareBaseURL}/${shareID}`;

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
    setCopied(false);
    setOpen(false);
  };

  const handleCopyQR = () => {
    setCopyQrStatus("copying");
    try {
      const svgNode = qrContainerRef.current?.querySelector("svg");
      if (!svgNode) throw new Error("QR SVG not found");

      // Convert SVG to PNG
      const svgData = new XMLSerializer().serializeToString(svgNode);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      const img = new window.Image();
      img.onload = () => {
        // Draw image
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, 200, 200);
        canvas.toBlob(async (blob) => {
          if (!blob) return setCopyQrStatus("idle");
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopyQrStatus("copied");
          setTimeout(() => setCopyQrStatus("idle"), 2000);
        });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => setCopyQrStatus("idle");
      img.src = url;
    } catch {
      setCopyQrStatus("idle");
    }
  };

  const handleDownloadQR = () => {
    setDownloadStatus("downloading");
    const svgNode = qrContainerRef.current?.querySelector("svg");
    if (!svgNode) return setDownloadStatus("idle");

    const svgData = new XMLSerializer().serializeToString(svgNode);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, 200, 200);
      const link = document.createElement("a");
      link.download = `${shareID}-qr-code.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      URL.revokeObjectURL(url);
      setDownloadStatus("downloaded");
      setTimeout(() => setDownloadStatus("idle"), 2000);
    };
    img.onerror = () => setDownloadStatus("idle");
    img.src = url;
  };

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  return (
    <Modal open={Boolean(open)} onClose={handleClose}>
      <Box
        tabIndex={-1}
        sx={{
          outline: "none",
          maxWidth: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          mx: "auto",
          mt: { xs: 6, sm: 12 },
          minHeight: 0,
          position: "relative",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: 1,
            borderColor: "divider",
            px: 3,
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#EFF6FF",
                borderRadius: 2,
                p: 1,
                mr: 2,
              }}
            >
              <ShareIcon sx={{ fontSize: 22, color: "#2563EB" }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Share your survey
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: "#9CA3AF" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Content */}
        <Box
          sx={{ p: 3, pt: 2, gap: 3, display: "flex", flexDirection: "column" }}
        >
          {/* Share Link Section */}
          <Box>
            <Typography
              variant="body2"
              color="#374151"
              sx={{ mb: 1, fontWeight: "bold" }}
            >
              Share Link
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                value={shareURL}
                size="small"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleCopyClick}
                        sx={{
                          color:
                            copyLinkStatus === "copied"
                              ? "success.main"
                              : "grey.600",
                        }}
                      >
                        {copyLinkStatus === "copied" ? (
                          <CheckCircleIcon fontSize="small" />
                        ) : (
                          <ContentCopyIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  },
                  pr: 0,
                }}
              />
            </Box>
          </Box>
          {/* QR Code */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <QrCodeIcon sx={{ fontSize: 22, color: "#4B5563" }} />
              <Typography
                variant="body2"
                color="#394252"
                sx={{ fontWeight: "600" }}
              >
                QR Code
              </Typography>
            </Box>
            {/* QR Code Image */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <Box
                ref={qrContainerRef}
                sx={{
                  p: 2,
                  bgcolor: "background.paper",
                  border: 2,
                  borderColor: "#F3F4F6",
                  borderRadius: 3,
                  boxShadow: 1,
                  minWidth: 192,
                  minHeight: 192,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {shareURL ? (
                  <QRCode
                    value={shareURL}
                    size={192}
                    bgColor="#fff"
                    fgColor="#222"
                  />
                ) : (
                  <Box
                    sx={{
                      width: 192,
                      height: 192,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress color="primary" />
                  </Box>
                )}
              </Box>
            </Box>
            {/* Actions */}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                onClick={handleCopyQR}
                disabled={!shareURL || copyQrStatus === "copying"}
                startIcon={
                  copyQrStatus === "copying" ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : copyQrStatus === "copied" ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <ContentCopyIcon />
                  )
                }
                fullWidth
                variant="outlined"
                color={copyQrStatus === "copied" ? "success" : "inherit"}
                sx={{
                  backgroundColor: "#F3F4F6",
                  borderColor: "transparent",
                  color: "#3B4554",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                {copyQrStatus === "copying"
                  ? "Copying..."
                  : copyQrStatus === "copied"
                    ? "Copied"
                    : "Copy QR"}
              </Button>
              <Button
                onClick={handleDownloadQR}
                disabled={!shareURL}
                startIcon={
                  downloadStatus === "downloading" ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : downloadStatus === "downloaded" ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <DownloadIcon />
                  )
                }
                fullWidth
                variant="contained"
                color={downloadStatus === "downloaded" ? "primary" : "primary"}
                sx={{
                  backgroundColor: "#2563EB",
                  fontWeight: 500,
                  borderRadius: 2,
                  py: 1,
                  textTransform: "none",
                }}
              >
                {downloadStatus === "downloading"
                  ? "Downloading..."
                  : downloadStatus === "downloaded"
                    ? "Downloaded"
                    : "Download QR"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ShareSurveyModal;
