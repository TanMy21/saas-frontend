import { useCallback, useEffect, useRef, useState } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  Alert,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useSurveyEditLock } from "../../hooks/useSurveyEditLock";
import { SOFT_EDIT_MESSAGES } from "../../utils/constants";
import { FileUploadProps, UploadState } from "../../utils/types";

const FileUpload3D = ({
  isUploading,
  onUpload,
  onUploadError,
}: FileUploadProps) => {
  const [state, setState] = useState<UploadState>({
    isDragOver: false,
    isUploading: false,
    uploadProgress: 0,
    uploadedFile: null,
    error: null,
  });

  const { confirmSoftEdit } = useSurveyEditLock();
  const [_selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  const acceptedFormats = [".gltf", ".glb"];
  const maxFileSize = 10 * 1024 * 1024;

  const busy = Boolean(isUploading || state.isUploading);

  const validateFile = (file: File): string | null => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!acceptedFormats.includes(extension)) {
      return `Unsupported file format. Please use: ${acceptedFormats.join(", ")}`;
    }

    if (file.size > maxFileSize) {
      return "File size exceeds 10MB limit.";
    }

    return null;
  };

  const clearUploadTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const simulateUpload = () => {
    clearUploadTimer();

    setState((prev) => ({
      ...prev,
      isUploading: true,
      error: null,
      uploadProgress: 0,
      uploadedFile: null,
    }));

    timerRef.current = window.setInterval(() => {
      setState((prev) => ({
        ...prev,
        uploadProgress: Math.min(95, prev.uploadProgress + Math.random() * 12),
      }));
    }, 180);
  };

  useEffect(
    () => () => {
      clearUploadTimer();
    },
    [],
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      const err = validateFile(file);

      if (err) {
        setState((prev) => ({ ...prev, error: err, uploadedFile: null }));
        setSelectedFile(null);
        return;
      }

      if (!(await confirmSoftEdit(SOFT_EDIT_MESSAGES.MODEL_3D_CHANGE))) {
        return;
      }

      setSelectedFile(file);
      simulateUpload();

      const uploaded = await onUpload(file);

      clearUploadTimer();

      if (!uploaded) {
        setState((prev) => ({
          ...prev,
          isUploading: false,
          uploadProgress: 0,
          uploadedFile: null,
          error: "Upload failed",
        }));

        onUploadError?.("Upload failed");
        return;
      }

      setState((prev) => ({
        ...prev,
        isUploading: false,
        uploadProgress: 100,
        uploadedFile: file,
        error: null,
      }));
    },
    [confirmSoftEdit, onUpload, onUploadError],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragOver: true }));
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragOver: false }));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setState((prev) => ({ ...prev, isDragOver: false }));

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        void handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const resetUpload = () => {
    clearUploadTimer();

    setState({
      isDragOver: false,
      isUploading: false,
      uploadProgress: 0,
      uploadedFile: null,
      error: null,
    });

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  if (state.uploadedFile && !state.isUploading && !isUploading) {
    return (
      <div
        style={{
          textAlign: "center",
          paddingTop: "24px",
          paddingBottom: "24px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#E6F4EA",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px",
          }}
        >
          <CheckCircleIcon style={{ fontSize: "32px", color: "#2E7D32" }} />
        </div>

        <Typography variant="h6" fontWeight={700} mb={1}>
          Upload Successful!
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            bgcolor: "primary.50",
            borderColor: "primary.100",
            borderRadius: 3,
            p: 2.5,
            mb: 3,
            maxWidth: 520,
            mx: "auto",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            justifyContent="center"
          >
            <InsertDriveFileIcon sx={{ color: "primary.main" }} />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 600 }}>{state.uploadedFile.name}</div>
              <div style={{ fontSize: "0.875rem", color: "rgba(0,0,0,0.6)" }}>
                {formatFileSize(state.uploadedFile.size)}
              </div>
            </div>
          </Stack>
        </Paper>

        <Button
          onClick={resetUpload}
          variant="contained"
          color="primary"
          sx={{ px: 3, py: 1.25, borderRadius: 2 }}
          startIcon={<FileUploadIcon />}
        >
          Upload Another File
        </Button>
      </div>
    );
  }

  if (state.isUploading || isUploading) {
    return (
      <div
        style={{
          textAlign: "center",
          paddingTop: "24px",
          paddingBottom: "24px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#BBDEFB",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px",
          }}
        >
          <FileUploadIcon style={{ fontSize: "32px", color: "#1976D2" }} />
        </div>

        <div
          style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "4px" }}
        >
          Uploading...
        </div>

        <div
          style={{
            fontSize: "0.875rem",
            color: "rgba(0,0,0,0.6)",
            marginBottom: "12px",
          }}
        >
          Please wait while we process your 3D model
        </div>

        <progress
          value={Math.round(state.uploadProgress)}
          max={100}
          style={{
            width: "100%",
            height: "10px",
            borderRadius: "5px",
            backgroundColor: "#0074EB",
            color: "#0074EB",
            overflow: "hidden",
            marginBottom: "6px",
            appearance: "none",
          }}
        />

        <div style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.6)" }}>
          {Math.round(state.uploadProgress)}% complete
        </div>
      </div>
    );
  }

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        onDrop={busy ? undefined : handleDrop}
        onDragOver={busy ? undefined : handleDrag}
        onDragEnter={busy ? undefined : handleDragIn}
        onDragLeave={busy ? undefined : handleDragOut}
        onClick={() => !busy && fileInputRef.current?.click()}
        sx={{
          p: { xs: 3, sm: 4 },
          textAlign: "center",
          border: "2px dashed",
          borderColor: state.isDragOver ? "primary.main" : "grey.300",
          borderRadius: 3,
          cursor: "pointer",
          transition: "all .3s ease",
          opacity: busy ? 0.7 : 1,
          pointerEvents: busy ? "none" : "auto",
          bgcolor: state.isDragOver ? "primary.50" : "background.paper",
          transform: state.isDragOver ? "scale(1.02)" : "none",
          "&:hover": {
            borderColor: "primary.light",
            bgcolor: "primary.50",
          },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={(e) => {
            if (busy) return;

            const files = e.target.files;
            if (files && files.length > 0) {
              void handleFileSelect(files[0]);
            }
          }}
          style={{ display: "none" }}
        />

        <div
          style={{
            transition: "transform .3s ease",
            transform: state.isDragOver ? "scale(1.05)" : "none",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#BBDEFB",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "8px",
            }}
          >
            <FileUploadIcon style={{ fontSize: "40px", color: "#1976D2" }} />
          </div>

          <div
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              marginBottom: "8px",
            }}
          >
            {state.isDragOver ? "Drop your file here" : "Upload 3D Model"}
          </div>

          <div style={{ color: "rgba(0,0,0,0.6)", marginBottom: "16px" }}>
            {state.isDragOver
              ? "Release to upload your 3D model"
              : "Drag and drop your file here, or click to browse"}
          </div>

          <button
            disabled={busy}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#1976D2",
              color: "#fff",
              border: "none",
              borderRadius: "16px",
              padding: "8px 20px",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: busy ? "not-allowed" : "pointer",
              opacity: busy ? 0.7 : 1,
            }}
          >
            <FileUploadIcon style={{ fontSize: "20px" }} />
            Choose File
          </button>
        </div>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "grey.50",
          borderColor: "grey.200",
        }}
      >
        <Typography fontWeight={700} mb={1.5}>
          Supported Formats
        </Typography>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" mb={2}>
          {acceptedFormats.map((format) => (
            <Chip
              key={format}
              label={format.toUpperCase()}
              variant="outlined"
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                bgcolor: "common.white",
              }}
            />
          ))}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <InsertDriveFileIcon fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            Maximum file size: 10MB
          </Typography>
        </Stack>
      </Paper>

      {state.error && (
        <Alert
          severity="error"
          icon={<ErrorOutlineIcon />}
          sx={{ borderRadius: 2 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setState((prev) => ({ ...prev, error: null }))}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Typography fontWeight={700}>Upload Error</Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {state.error}
          </Typography>
        </Alert>
      )}
    </Stack>
  );
};

export default FileUpload3D;
