import { useRef } from "react";

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

import { useBatchedTracking } from "../../hooks/useBatchedTracking";
import { useShareCopyHandler } from "../../hooks/useShareCopyHandler";
import { useShareQRActions } from "../../hooks/useShareQRActions";
import { useTrackedEvent } from "../../hooks/useTrackedEvent";
import { ShareTabProps } from "../../types/surveyBuilderTypes";

const ShareLink = ({
  shareURL,
  shareID,
  surveyID,
  title,
  setOpenSnackbar,
  trackShareEvent,
}: ShareTabProps) => {
  const batchedTrack = useBatchedTracking(trackShareEvent, surveyID!);
  const track = useTrackedEvent(batchedTrack, surveyID!);

  const { copied, copy, triggerCopied, clear } = useShareCopyHandler(
    setOpenSnackbar,
    track,
  );

  const qrContainerRef = useRef<HTMLDivElement>(null);

  const { copyQrStatus, downloadStatus, copyQR, downloadQR } =
    useShareQRActions(
      qrContainerRef,
      shareID!,
      title,
      triggerCopied,
      clear,
      track,
    );

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
                    onClick={() => copy(shareURL, "url", "SHARE_LINK_COPIED")}
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
            width: 120,
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <QRCode
            value={shareURL}
            size={200}
            style={{
              display: "block",
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ mt: 1, display: "flex", gap: 2.5 }}>
            <Button
              size="small"
              onClick={downloadQR}
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
              onClick={copyQR}
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
