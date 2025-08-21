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
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useUpload3DModelMutation } from "../../app/slices/elementApiSlice";
import { FileUploadProps, UploadState } from "../../utils/types";

const FileUpload3D = ({
  questionID,
  onFileSelect,
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) => {
  const [state, setState] = useState<UploadState>({
    isDragOver: false,
    isUploading: false,
    uploadProgress: 0,
    uploadedFile: null,
    error: null,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [upload3DModel, { isLoading, isSuccess, isError, error, data }] =
    useUpload3DModelMutation();

  const handleUpload = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("modelFile", file);
      formData.append("name", file.name);

      try {
        const result = await upload3DModel({ formData, questionID }).unwrap();
        onUploadSuccess?.({
          fileUrl: result.fileUrl,
          name: result.name,
          model3DID: result.model3DID,
        });
      } catch (e) {
        onUploadError?.("Upload failed");
        console.error("Upload failed:", e);
      }
    },
    [questionID, upload3DModel]
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = [".gltf", ".glb"];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

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

  const timerRef = useRef<number | null>(null);
  const simulateUpload = (file: File) => {
    setState((prev) => ({
      ...prev,
      isUploading: true,
      error: null,
      uploadProgress: 0,
    }));
    timerRef.current = window.setInterval(() => {
      setState((prev) => {
        const next = prev.uploadProgress + Math.random() * 15;
        if (next >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          return {
            ...prev,
            isUploading: false,
            uploadProgress: 100,
            uploadedFile: file,
          };
        }
        return { ...prev, uploadProgress: next };
      });
    }, 180);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    []
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      const err = validateFile(file);
      if (err) {
        setState((prev) => ({ ...prev, error: err, uploadedFile: null }));
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
      simulateUpload(file);
      void handleUpload(file);
    },
    [handleUpload, onFileSelect]
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
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const resetUpload = () => {
    setState({
      isDragOver: false,
      isUploading: false,
      uploadProgress: 0,
      uploadedFile: null,
      error: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (isSuccess && data) {
      onUploadSuccess?.(data);
    }
  }, [isSuccess, data, onUploadSuccess]);

  useEffect(() => {
    if (isError) {
      const msg = (error as any)?.data?.error || "Upload failed";
      onUploadError?.(msg);
      setState((prev) => ({ ...prev, isUploading: false, error: msg }));
    }
  }, [isError, error, onUploadError]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // =======================
  // Success view (unchanged behavior; MUI styling)
  // =======================
  if (state.uploadedFile && !state.isUploading) {
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
            backgroundColor: "#E6F4EA", // success.100 equivalent
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px",
          }}
        >
          <CheckCircleIcon style={{ fontSize: "32px", color: "#2E7D32" }} />{" "}
          {/* success.main equivalent */}
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
              <div
                style={{
                  fontSize: "0.875rem", // body2 equivalent
                  color: "rgba(0,0,0,0.6)", // text.secondary
                }}
              >
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

  // =======================
  // Uploading view (unchanged behavior; MUI styling)
  // =======================
  if (state.isUploading) {
    return (
      <div
        style={{
          textAlign: "center",
          paddingTop: "24px",
          paddingBottom: "24px",
        }}
      >
        {/* Icon container */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#BBDEFB", // primary.100
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px",
          }}
        >
          <FileUploadIcon style={{ fontSize: "32px", color: "#1976D2" }} />{" "}
          {/* primary.main */}
        </div>

        {/* Heading */}
        <div
          style={{
            fontSize: "1.25rem", // matches h6
            fontWeight: 700,
            marginBottom: "4px",
          }}
        >
          Uploading...
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "0.875rem", // body2
            color: "rgba(0,0,0,0.6)", // text.secondary
            marginBottom: "12px",
          }}
        >
          Please wait while we process your 3D model
        </div>

        {/* Progress bar */}
        <progress
          value={Math.round(state.uploadProgress)}
          max={100}
          style={{
            width: "100%",
            height: "10px",
            borderRadius: "5px",
            overflow: "hidden",
            marginBottom: "6px",
            appearance: "none",
          }}
        />
        {/* Percentage text */}
        <div
          style={{
            fontSize: "0.75rem", // caption
            color: "rgba(0,0,0,0.6)", // text.secondary
          }}
        >
          {Math.round(state.uploadProgress)}% complete
        </div>
      </div>
    );
  }

  // =======================
  // Default view (drag & drop + click)
  // =======================
  return (
    <Stack spacing={3}>
      {/* Upload Area */}
      <Paper
        elevation={0}
        onDrop={isLoading || state.isUploading ? undefined : handleDrop}
        onDragOver={isLoading || state.isUploading ? undefined : handleDrag}
        onDragEnter={isLoading || state.isUploading ? undefined : handleDragIn}
        onDragLeave={isLoading || state.isUploading ? undefined : handleDragOut}
        onClick={() =>
          !isLoading && !state.isUploading && fileInputRef.current?.click()
        }
        sx={{
          p: { xs: 3, sm: 4 },
          textAlign: "center",
          border: "2px dashed",
          borderColor: state.isDragOver ? "primary.main" : "grey.300",
          borderRadius: 3,
          cursor: "pointer",
          transition: "all .3s ease",
          opacity: isLoading || state.isUploading ? 0.7 : 1,
          pointerEvents: isLoading || state.isUploading ? "none" : "auto",
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
            if (isLoading || state.isUploading) return;
            const files = e.target.files;
            if (files && files.length > 0) handleFileSelect(files[0]);
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
          {/* Icon Circle */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#BBDEFB", // primary.100
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "8px",
            }}
          >
            <FileUploadIcon style={{ fontSize: "40px", color: "#1976D2" }} />{" "}
            {/* primary.main */}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "1.25rem", // h6 equivalent
              fontWeight: 800,
              marginBottom: "8px",
            }}
          >
            {state.isDragOver ? "Drop your file here" : "Upload 3D Model"}
          </div>

          {/* Subtitle */}
          <div
            style={{
              color: "rgba(0,0,0,0.6)", // text.secondary
              marginBottom: "16px",
            }}
          >
            {state.isDragOver
              ? "Release to upload your 3D model"
              : "Drag and drop your file here, or click to browse"}
          </div>

          {/* Button */}
          <button
            disabled={isLoading || state.isUploading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#1976D2", // primary.main
              color: "#fff",
              border: "none",
              borderRadius: "16px", // 2 * 8px
              padding: "8px 20px", // py:1 (8px), px:2.5 (~20px)
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor:
                isLoading || state.isUploading ? "not-allowed" : "pointer",
              opacity: isLoading || state.isUploading ? 0.7 : 1,
            }}
          >
            <FileUploadIcon style={{ fontSize: "20px" }} />
            Choose File
          </button>
        </div>
      </Paper>

      {/* File Format Info */}
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

      {/* Error Message */}
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
