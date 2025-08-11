import { useCallback, useRef, useState } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { FileUploadProps, UploadState } from "../../utils/types";

const FileUpload3D = ({ onFileSelect }: FileUploadProps) => {
  const [state, setState] = useState<UploadState>({
    isDragOver: false,
    isUploading: false,
    uploadProgress: 0,
    uploadedFile: null,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = [
    ".obj",
    ".fbx",
    ".gltf",
    ".glb",
    ".3ds",
    ".dae",
    ".blend",
    ".max",
    ".ma",
    ".mb",
  ];
  const maxFileSize = 100 * 1024 * 1024; // 100MB

  const validateFile = (file: File): string | null => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!acceptedFormats.includes(extension)) {
      return `Unsupported file format. Please use: ${acceptedFormats.join(", ")}`;
    }
    if (file.size > maxFileSize) {
      return "File size exceeds 100MB limit.";
    }
    return null;
  };

  // NOTE: kept your simulated upload for demo parity
  const simulateUpload = (file: File) => {
    setState((prev) => ({
      ...prev,
      isUploading: true,
      error: null,
      uploadProgress: 0,
    }));
    const interval = setInterval(() => {
      setState((prev) => {
        const newProgress = prev.uploadProgress + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            isUploading: false,
            uploadProgress: 100,
            uploadedFile: file,
          };
        }
        return { ...prev, uploadProgress: newProgress };
      });
    }, 200);
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setState((prev) => ({ ...prev, error, uploadedFile: null }));
        return;
      }
      onFileSelect(file); // ← unchanged
      simulateUpload(file); // ← unchanged
    },
    [onFileSelect]
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

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
      <Box textAlign="center" py={6}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "success.100",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 32, color: "success.main" }} />
        </Box>

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
            <Box textAlign="left">
              <Typography fontWeight={600}>
                {state.uploadedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatFileSize(state.uploadedFile.size)}
              </Typography>
            </Box>
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
      </Box>
    );
  }

  // =======================
  // Uploading view (unchanged behavior; MUI styling)
  // =======================
  if (state.isUploading) {
    return (
      <Box textAlign="center" py={6}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "primary.100",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <FileUploadIcon sx={{ fontSize: 32, color: "primary.main" }} />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={0.5}>
          Uploading...
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Please wait while we process your 3D model
        </Typography>

        <LinearProgress
          variant="determinate"
          // NOTE: MUI LinearProgress handles animation smoothly; replaces custom gradient bar
          value={Math.round(state.uploadProgress)}
          sx={{
            height: 10,
            borderRadius: 5,
            mb: 1.5,
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {Math.round(state.uploadProgress)}% complete
        </Typography>
      </Box>
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
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onClick={() => fileInputRef.current?.click()}
        sx={{
          p: { xs: 3, sm: 4 },
          textAlign: "center",
          border: "2px dashed",
          borderColor: state.isDragOver ? "primary.main" : "grey.300",
          borderRadius: 3,
          cursor: "pointer",
          transition: "all .3s ease",
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
          onChange={handleInputChange}
          style={{ display: "none" }} // ← replaces className="hidden"
        />

        <Box
          sx={{
            transition: "transform .3s ease",
            transform: state.isDragOver ? "scale(1.05)" : "none",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "primary.100",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <FileUploadIcon sx={{ fontSize: 40, color: "primary.main" }} />
          </Box>

          <Typography variant="h6" fontWeight={800} mb={1}>
            {state.isDragOver ? "Drop your file here" : "Upload 3D Model"}
          </Typography>

          <Typography color="text.secondary" mb={2}>
            {state.isDragOver
              ? "Release to upload your 3D model"
              : "Drag and drop your file here, or click to browse"}
          </Typography>

          <Button
            variant="contained"
            startIcon={<FileUploadIcon />}
            sx={{ borderRadius: 2, px: 2.5, py: 1 }}
          >
            Choose File
          </Button>
        </Box>
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
            Maximum file size: 100MB
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
