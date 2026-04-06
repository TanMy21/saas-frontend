import { useEffect, useRef, useState } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { CheckIcon, CodeIcon, CopyIcon, LinkIcon, Mail } from "lucide-react";
import QRCode from "react-qr-code";

import { closeShareModal } from "../../app/slices/overlaySlice";
import { useAppSelector } from "../../app/store";
import { useAppDispatch } from "../../app/typedReduxHooks";
import { getSurveyEmailTemplate } from "../../utils/emailTemplate";
import { ShareSurveyProps } from "../../utils/types";

const ShareSurveyModal = ({
  setShareBtnSelected,
  setOpenSnackbar,
  shareID,
  title,
}: ShareSurveyProps) => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.overlayUI.shareModalOpen);

  // Tab state
  const [tab, setTab] = useState<"link" | "email" | "embed">("link");
  const [copyLinkStatus, _setCopyLinkStatus] = useState<"idle" | "copied">(
    "idle",
  );

  // Copy states
  const [copyQrStatus, setCopyQrStatus] = useState<
    "idle" | "copying" | "copied"
  >("idle");
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "downloading" | "downloaded"
  >("idle");

  const [copied, setCopied] = useState<string | null>(null);

  const qrContainerRef = useRef<HTMLDivElement>(null);

  const shareBaseURL = import.meta.env.VITE_SHARE_BASE_URL;
  const shareURL = `${shareBaseURL}/${shareID}`;

  // Embed code
  const embedCode = `<iframe src="${shareURL}?embed=true" width="100%" height="600" style="border:none;border-radius:8px;"></iframe>`;

  // Copy
  const handleCopy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setOpenSnackbar(true);

    setTimeout(() => setCopied(null), 2000);
  };

  // Copies HTML
  const copyRichText = async (html: string) => {
    const blob = new Blob([html], { type: "text/html" });
    const data = [new ClipboardItem({ "text/html": blob })];

    await navigator.clipboard.write(data);
    setCopied("template");
    setOpenSnackbar(true);
  };

  // Close modal
  const handleClose = () => {
    setShareBtnSelected(false);
    dispatch(closeShareModal());
  };

  // QR copy
  const handleCopyQR = () => {
    setCopyQrStatus("copying");
    const svgNode = qrContainerRef.current?.querySelector("svg");
    if (!svgNode) return;

    const svgData = new XMLSerializer().serializeToString(svgNode);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const img = new window.Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);

        setCopied("qr");
        setCopyQrStatus("copied");
        setOpenSnackbar(true);
        setTimeout(() => setCopied(null), 2000);
      });

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  // QR download
  const handleDownloadQR = () => {
    setDownloadStatus("downloading");
    const svgNode = qrContainerRef.current?.querySelector("svg");
    if (!svgNode) return;

    const svgData = new XMLSerializer().serializeToString(svgNode);
    const url = URL.createObjectURL(
      new Blob([svgData], { type: "image/svg+xml" }),
    );

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `${shareID}-qr.png`;
      link.href = canvas.toDataURL();
      link.click();

      URL.revokeObjectURL(url);
    };

    img.src = url;

    setDownloadStatus("downloaded");
  };

  useEffect(() => {
    if (!open) setCopied(null);
  }, [open]);

  return (
    <Modal open={Boolean(open)} onClose={handleClose}>
      <Box
        sx={{
          maxWidth: 520,
          mx: "auto",
          mt: 10,
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: 24,
          overflow: "hidden",
        }}
      >
        {/* ---------------- HEADER ---------------- */}
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight={600}>Share your survey</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* ---------------- TABS ---------------- */}
        <Tabs
          value={tab}
          onChange={(_, val) => setTab(val)}
          sx={{
            px: 2,
            minHeight: 40,
            borderBottom: "1px solid #eee",

            "& .MuiTabs-flexContainer": {
              gap: 2.5,
            },
            "& .MuiTabs-indicator": {
              height: 2,
              borderRadius: 2,
              bottom: 1,
            },
          }}
        >
          <Tab
            label="Link"
            value="link"
            icon={<LinkIcon size={20} />}
            iconPosition="start"
            sx={{
              minHeight: 40,
              textTransform: "none",
              fontSize: 20,
              fontWeight: 500,
              gap: 0.5,
              px: 1.5,
            }}
          />
          <Tab
            label="Email"
            value="email"
            icon={<Mail size={20} />}
            iconPosition="start"
            sx={{
              minHeight: 40,
              textTransform: "none",
              fontSize: 20,
              fontWeight: 500,
              gap: 0.5,
              px: 1.5,
            }}
          />
          <Tab
            label="Embed"
            value="embed"
            icon={<CodeIcon size={20} />}
            iconPosition="start"
            sx={{
              minHeight: 40,
              textTransform: "none",
              fontSize: 20,
              fontWeight: 500,
              gap: 0.5,
              px: 1.5,
            }}
          />
        </Tabs>

        {/* ---------------- CONTENT ---------------- */}
        <Box sx={{ p: 3 }}>
          {/* ================= LINK TAB ================= */}
          {tab === "link" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* URL */}
              <Box>
                <Typography variant="body2" fontWeight={600} mb={1}>
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
                            onClick={() => handleCopy(shareURL, "url")}
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

              {/* QR */}
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  p: 2,
                  bgcolor: "#F8FAFC",
                  borderRadius: 2,
                  alignItems: "center",
                }}
              >
                <Box
                  ref={qrContainerRef}
                  sx={{
                    p: 2,
                    bgcolor: "background.paper",
                    border: 2,
                    borderColor: "#F3F4F6",
                    borderRadius: 3,
                    boxShadow: 1,
                    minWidth: 100,
                    minHeight: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <QRCode value={shareURL} size={100} />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ mt: 1, display: "flex", gap: 4 }}>
                    <Button
                      size="small"
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
                      variant="contained"
                      color={
                        downloadStatus === "downloaded" ? "primary" : "primary"
                      }
                      sx={{
                        backgroundColor: "#2563EB",
                        fontWeight: 600,
                        borderRadius: 2,
                        py: 0.5,
                        textTransform: "none",
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
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
                      color={copyQrStatus === "copied" ? "success" : "inherit"}
                      sx={{
                        backgroundColor: "#F3F4F6",
                        borderColor: "transparent",
                        color: "#3B4554",
                        fontWeight: 600,
                        fontSize: 16,
                        borderRadius: 2,
                        py: 1.5,
                        width: 120,
                        textTransform: "none",
                      }}
                    >
                      {copied === "qr" ? "Copied" : "Copy"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* ================= EMAIL TAB ================= */}
          {tab === "email" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Email Template Card */}
              <Box
                onClick={() =>
                  copyRichText(
                    getSurveyEmailTemplate({
                      surveyTitle: title,
                      shareURL,
                      senderName: "<Your Name>",
                    }),
                  )
                }
                sx={{
                  position: "relative",
                  p: 2.5,
                  border: "1px solid #E5E7EB",
                  borderRadius: 2.5,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#6366F1",
                    bgcolor: "#F8FAFF",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                {/* Top-right icon */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    color: copied === "template" ? "success.main" : "#9CA3AF",
                  }}
                >
                  {copied === "template" ? (
                    <CheckIcon fontSize="small" />
                  ) : (
                    <CopyIcon fontSize="small" />
                  )}
                </Box>

                {/* Content */}
                <Typography fontWeight={600} mb={0.5}>
                  Email Template
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Copy a ready-to-send email with your survey link
                </Typography>
              </Box>

              {/* Survey Link Card */}
              <Box
                onClick={() => handleCopy(shareURL, "email_link")}
                sx={{
                  position: "relative",
                  p: 2.5,
                  border: "1px solid #E5E7EB",
                  borderRadius: 2.5,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#6366F1",
                    bgcolor: "#F8FAFF",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                {/* Top-right icon */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    color: copied === "email_link" ? "success.main" : "#9CA3AF",
                  }}
                >
                  {copied === "email_link" ? (
                    <CheckIcon fontSize="small" />
                  ) : (
                    <LinkIcon fontSize="small" />
                  )}
                </Box>

                {/* Content */}
                <Typography fontWeight={600} mb={0.5}>
                  Survey Link
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Copy just the link to share anywhere
                </Typography>
              </Box>
            </Box>
          )}

          {/* ================= EMBED TAB ================= */}
          {tab === "embed" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography fontWeight={600}>Embed code</Typography>

              <Box
                sx={{
                  bgcolor: "#F3F4F6",
                  p: 2,
                  borderRadius: 2,
                  fontFamily: "monospace",
                  fontSize: 12,
                  overflowX: "auto",
                }}
              >
                {embedCode}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Paste into your website
                </Typography>

                <Button
                  variant="outlined"
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
                  color={copyQrStatus === "copied" ? "success" : "inherit"}
                  sx={{
                    backgroundColor: "#F3F4F6",
                    borderColor: "transparent",
                    color: "#3B4554",
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1,
                    width: 160,
                    textTransform: "none",
                  }}
                  onClick={() => handleCopy(embedCode, "embed")}
                >
                  {copied === "embed" ? "Copied" : "Copy Code"}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ShareSurveyModal;
