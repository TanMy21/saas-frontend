import {
  ChangeEventHandler,
  DragEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import BackupIcon from "@mui/icons-material/Backup";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Close from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useReplace3DModelMutation } from "../../app/slices/elementApiSlice";
import { useSurveyCanvasRefetch } from "../../context/BuilderRefetchCanvas";
import { Replace3DModelModalProps } from "../../utils/types";

const Replace3DModelModal = ({
  open,
  onClose,
  questionID,
  currentFileName = "current_model.glb",
}: Replace3DModelModalProps) => {
  const refetchCanvas = useSurveyCanvasRefetch();
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = useMemo(() => [".glb"], []);
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // RTK mutation
  const [
    replace3DModel,
    { isLoading, isSuccess, error: mutationError, reset },
  ] = useReplace3DModelMutation();

  // ---- Helpers ----
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const validateFile = (file: File): string | null => {
    const extension = "." + (file.name.split(".").pop()?.toLowerCase() || "");
    if (!acceptedFormats.includes(extension)) {
      return `Unsupported file format. Use: ${acceptedFormats.join(", ")}`;
    }
    if (file.size > maxFileSize) {
      return `File exceeds 10MB. Current size: ${formatFileSize(file.size)}`;
    }
    return null;
  };

  // Simulate progress while the network call runs (fetch doesn't expose progress)
  const startSimulatedProgress = useCallback(() => {
    setProgress(0);
    let current = 0;
    const id = setInterval(() => {
      current = Math.min(95, current + Math.random() * 12); // cap at 95% until server responds
      setProgress(current);
    }, 180);
    return () => clearInterval(id);
  }, []);

  const resetLocal = useCallback(() => {
    setIsDragOver(false);
    setError(null);
    setSelectedFile(null);
    setProgress(0);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    reset(); // reset RTK mutation state
  }, [reset]);

  // Close handler (blocked while uploading)
  const handleRequestClose = useCallback(() => {
    if (isLoading) return; // prevent closing mid-upload
    resetLocal();
    onClose();
  }, [isLoading, onClose, resetLocal]);

  // File select -> validate -> upload
  const handleFileSelect = useCallback(
    async (file: File) => {
      const validation = validateFile(file);
      if (validation) {
        setError(validation);
        setSelectedFile(null);
        return;
      }

      setError(null);
      setSelectedFile(file);

      // Build form data (⚠️ change 'file' key if your backend expects a different field)
      const formData = new FormData();
      formData.append("modelFile", file);

      // simulate progress while awaiting the PUT
      const stop = startSimulatedProgress();
      try {
        await replace3DModel({ formData, questionID }).unwrap();
        setProgress(100); // finish the bar
        refetchCanvas();
      } catch (e: any) {
        // Surface server error
        setError(
          typeof e?.data === "string"
            ? e.data
            : e?.data?.message || e?.error || "Failed to replace the model."
        );
        setProgress(0);
      } finally {
        stop();
      }
    },
    [questionID, replace3DModel, startSimulatedProgress]
  );

  // ---- Drag & Drop ----
  const onDragOver = useCallback<DragEventHandler<HTMLDivElement>>((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDragEnter = useCallback<DragEventHandler<HTMLDivElement>>((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback<DragEventHandler<HTMLDivElement>>((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback<DragEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFileSelect(f);
    },
    [handleFileSelect]
  );

  const onInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const f = e.target.files?.[0];
      if (f) handleFileSelect(f);
    },
    [handleFileSelect]
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        // prevent accidental close during upload
        if (isLoading) return;
        if (reason === "backdropClick" || reason === "escapeKeyDown")
          handleRequestClose();
      }}
      fullWidth
      maxWidth="md"
      transitionDuration={300}
      sx={{
        "& .MuiDialog-container": {
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        },
        "& .MuiPaper-root": {
          borderRadius: 4,
          boxShadow: 24,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          py: 2.5,
          borderBottom: "1px solid",
          borderColor: "grey.100",
          fontWeight: 800,
          fontSize: 24,
        }}
      >
        Replace 3D Model
        <IconButton
          onClick={handleRequestClose}
          disabled={isLoading}
          sx={{
            p: 1,
            borderRadius: 2,
            color: "grey.500",
            "&:hover": { color: "grey.700", backgroundColor: "grey.100" },
            transition: "all .2s ease",
          }}
        >
          <Close fontSize="medium" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3 }}>
        {/* Success */}
        {isSuccess && !isLoading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                mx: "auto",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "success.light",
                color: "success.main",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 36 }} />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Model Replaced Successfully!
            </Typography>

            {selectedFile && (
              <Paper
                variant="outlined"
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "primary.50",
                  borderColor: "primary.100",
                  maxWidth: 420,
                  mx: "auto",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  justifyContent="center"
                >
                  <InsertDriveFileIcon color="primary" />
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatFileSize(selectedFile.size)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}

            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                startIcon={<SwapVertIcon />}
                onClick={() => {
                  resetLocal();
                  inputRef.current?.click();
                }}
              >
                Replace Again
              </Button>
              <Button variant="outlined" onClick={handleRequestClose}>
                Done
              </Button>
            </Stack>
          </Box>
        ) : (
          <>
            {/* Uploading */}
            {isLoading ? (
              <Box sx={{ textAlign: "center", py: 5 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    mx: "auto",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.100",
                    color: "primary.main",
                  }}
                >
                  <BackupIcon sx={{ fontSize: 36 }} className="spin" />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Replacing Model…
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Please wait while we process your new 3D model.
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={Math.round(progress)}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    "& .MuiLinearProgress-bar": { borderRadius: 5 },
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1.5 }}
                >
                  {Math.round(progress)}% complete
                </Typography>
              </Box>
            ) : (
              // Idle (choose file)
              <Stack spacing={3}>
                {/* Current file warning */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "warning.50",
                    borderColor: "warning.200",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <ErrorIcon sx={{ color: "warning.main" }} />
                    <Box>
                      <Typography
                        sx={{ fontWeight: 600, color: "warning.dark" }}
                      >
                        Current Model
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "warning.main" }}
                      >
                        You are about to replace:{" "}
                        <Box component="span" sx={{ fontWeight: 600 }}>
                          {currentFileName}
                        </Box>
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                {/* Drop zone */}
                <Box
                  onDragOver={onDragOver}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  role="button"
                  tabIndex={0}
                  sx={{
                    border: "2px dashed",
                    borderColor: isDragOver ? "primary.main" : "grey.300",
                    bgcolor: isDragOver ? "primary.50" : "background.paper",
                    p: 6,
                    borderRadius: 3,
                    textAlign: "center",
                    transition: "all .25s ease",
                    outline: "none",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "primary.light",
                      bgcolor: "primary.50",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "primary.100",
                      color: "primary.main",
                      transform: isDragOver ? "scale(1.06)" : "scale(1)",
                      transition: "transform .2s ease",
                    }}
                  >
                    <BackupIcon sx={{ fontSize: 40 }} />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    {isDragOver
                      ? "Drop your replacement file here"
                      : "Replace 3D Model"}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    {isDragOver
                      ? "Release to replace your 3D model"
                      : "Drag & drop your new file here, or click to browse"}
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<BackupIcon />}
                    component="label"
                    sx={{ mt: 1 }}
                  >
                    Choose Replacement File
                    <input
                      hidden
                      ref={inputRef}
                      type="file"
                      accept={acceptedFormats.join(",")}
                      onChange={onInputChange}
                      onClick={(e) => {
                        (e.currentTarget as HTMLInputElement).value = "";
                      }}
                    />
                  </Button>
                </Box>

                {/* Supported formats */}
                <Paper
                  variant="outlined"
                  sx={{ p: 2.5, borderRadius: 2, bgcolor: "grey.50" }}
                >
                  <Typography sx={{ fontWeight: 700, mb: 1.5 }}>
                    Supported Formats
                  </Typography>
                  <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
                    {acceptedFormats.map((f) => (
                      <Chip
                        key={f}
                        label={f.toUpperCase()}
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1.5, color: "error.main", fontWeight: 600 }}
                  >
                    Maximum file size: 10MB (strict)
                  </Typography>
                </Paper>

                {/* Error block */}
                {(error || mutationError) && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "error.50",
                      borderColor: "error.200",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <ErrorIcon sx={{ color: "error.main" }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{ fontWeight: 700, color: "error.dark", mb: 0.5 }}
                        >
                          Error Replacing Model
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        onClick={() => setError(null)}
                        sx={{ color: "error.main", minWidth: 0 }}
                      >
                        <Close fontSize="small" />
                      </Button>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Replace3DModelModal;
