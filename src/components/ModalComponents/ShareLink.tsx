import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { CheckCircleIcon, CopyIcon, DownloadIcon, Loader } from "lucide-react";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";

import { ShareTabProps } from "../../types/surveyBuilderTypes";
import { qrToCanvas, safeCopyText } from "../../utils/utils";

const ShareLink = ({
  shareURL,
  shareID,
  setOpenSnackbar,
  trackShareEvent,
}: ShareTabProps) => {
  const { surveyID } = useParams();
  const [_loadingKey, setLoadingKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [copyQrStatus, setCopyQrStatus] = useState<
    "idle" | "copying" | "copied"
  >("idle");
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "downloading" | "downloaded"
  >("idle");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const resetAfterDelay = (fn: () => void) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(fn, 2000);
  };

  const triggerCopied = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setCopied(key);
    setOpenSnackbar(true);

    timeoutRef.current = setTimeout(() => setCopied(null), 2000);
  };
  const handleCopy = async (value: string, key: string) => {
    if (!value) return;

    setLoadingKey(key);
    const success = await safeCopyText(value);
    setLoadingKey(null);

    if (!success) {
      console.error("Copy failed");
      return;
    }

    triggerCopied(key);

    trackShareEvent({
      surveyID: surveyID!,
      actionType: "SHARE_LINK_COPIED",
    });
  };

  const handleCopyQR = async () => {
    const svgNode = qrContainerRef.current?.querySelector("svg");
    if (!svgNode) return;

    setLoadingKey("qr");

    try {
      const canvas = await qrToCanvas(svgNode);

      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res));

      if (!blob) throw new Error();

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      triggerCopied("qr");
      setCopyQrStatus("copied");
      trackShareEvent({
        surveyID: surveyID!,
        actionType: "SHARE_QR_COPIED",
      });
      resetAfterDelay(() => {
        setCopyQrStatus("idle");
        setCopied(null);
      });
    } catch {
      console.error("QR copy failed");
    } finally {
      setLoadingKey(null);
    }
  };

  const handleDownloadQR = async () => {
    const svgNode = qrContainerRef.current?.querySelector("svg");
    if (!svgNode) return;

    setLoadingKey("download");

    try {
      const canvas = await qrToCanvas(svgNode);

      const link = document.createElement("a");
      link.download = `${shareID}-qr.png`;
      link.href = canvas.toDataURL();
      link.click();

      triggerCopied("download");
      setDownloadStatus("downloaded");
      trackShareEvent({
        surveyID: surveyID!,
        actionType: "SHARE_QR_DOWNLOADED",
      });
      resetAfterDelay(() => {
        setDownloadStatus("idle");
        setCopied(null);
      });
    } catch {
      console.error("QR download failed");
    } finally {
      setLoadingKey(null);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                      color: copied === "url" ? "success.main" : "grey.600",
                    }}
                  >
                    {copied === "url" ? (
                      <CheckCircleIcon size={20} />
                    ) : (
                      <CopyIcon size={20} />
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
          <Box sx={{ mt: 1, display: "flex", gap: 2.5 }}>
            <Button
              size="small"
              onClick={handleDownloadQR}
              disabled={!shareURL}
              startIcon={
                downloadStatus === "downloading" ? (
                  <Loader size={18} color="white" />
                ) : downloadStatus === "downloaded" ? (
                  <CheckCircleIcon color="white" />
                ) : (
                  <DownloadIcon />
                )
              }
              variant="contained"
              color={downloadStatus === "downloaded" ? "primary" : "primary"}
              sx={{
                backgroundColor: "#2563EB",
                fontWeight: 600,
                borderRadius: 2,
                py: 0.5,
                textTransform: "none",
              }}
            >
              {downloadStatus === "downloading"
                ? "Downloading..."
                : downloadStatus === "downloaded"
                  ? "Downloaded"
                  : "Download"}
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={handleCopyQR}
              disabled={!shareURL || copyQrStatus === "copying"}
              startIcon={
                copyQrStatus === "copying" ? (
                  <Loader size={18} color="inherit" />
                ) : copyQrStatus === "copied" ? (
                  <CheckCircleIcon color="green" />
                ) : (
                  <CopyIcon />
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
                border: "3px solid #E5E7EB",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                "&:hover": {
                  borderColor: "#CBD5F5",
                  backgroundColor: "#EEF2FF",
                },
              }}
            >
              {copied === "qr" ? "Copied" : "Copy"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ShareLink;
