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
import {
  setQuestion,
  updateSelectedQuestion3DModel,
} from "../../app/slices/elementSlice";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/typedReduxHooks";
import { useSurveyCanvasRefetch } from "../../context/BuilderRefetchCanvas";
import { useSurveyEditLock } from "../../hooks/useSurveyEditLock";
import { SOFT_EDIT_MESSAGES } from "../../utils/constants";
import { showToast } from "../../utils/showToast";
import { Replace3DModelModalProps } from "../../utils/types";

const Replace3DModelModal = ({
  open,
  onClose,
  questionID,
  currentFileName = "current_model.glb",
}: Replace3DModelModalProps) => {
  const refetchCanvas = useSurveyCanvasRefetch();
  const dispatch = useAppDispatch();
  const { confirmSoftEdit } = useSurveyEditLock();

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessingReplacement, setIsProcessingReplacement] = useState(false);
  const [isReplacementComplete, setIsReplacementComplete] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<number | null>(null);

  const acceptedFormats = useMemo(() => [".glb"], []);
  const maxFileSize = 10 * 1024 * 1024;

  const [replace3DModel, { isLoading, error: mutationError, reset }] =
    useReplace3DModelMutation();

  const isBusy = isLoading || isProcessingReplacement;

  const clearPollInterval = useCallback(() => {
    if (pollIntervalRef.current) {
      window.clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearPollInterval();
    };
  }, [clearPollInterval]);

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

  const hasModelChanged = (nextModel: any, previousModel: any) => {
    if (!nextModel?.fileUrl) return false;
    if (!previousModel) return true;

    return (
      nextModel.updatedAt !== previousModel.updatedAt ||
      nextModel.contentHash !== previousModel.contentHash ||
      nextModel.public_id !== previousModel.public_id ||
      nextModel.fileUrl !== previousModel.fileUrl
    );
  };

  const startSimulatedProgress = useCallback(() => {
    setProgress(0);

    let current = 0;

    const id = window.setInterval(() => {
      current = Math.min(95, current + Math.random() * 12);
      setProgress(current);
    }, 180);

    return () => window.clearInterval(id);
  }, []);

  const resetLocal = useCallback(() => {
    clearPollInterval();

    setIsDragOver(false);
    setError(null);
    setSelectedFile(null);
    setProgress(0);
    setIsProcessingReplacement(false);
    setIsReplacementComplete(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    reset();
  }, [clearPollInterval, reset]);

  const handleRequestClose = useCallback(() => {
    if (isBusy) return;

    resetLocal();
    onClose();
  }, [isBusy, onClose, resetLocal]);

  const pollForReplacedModel = useCallback(
    (previousModel: any) => {
      clearPollInterval();

      let attempts = 0;
      const maxAttempts = 30;

      pollIntervalRef.current = window.setInterval(() => {
        attempts += 1;

        const refetchResult = refetchCanvas() as any;

        refetchResult
          ?.then?.((result: any) => {
            const questions =
              result?.data?.getSurveyCanvas?.questions ??
              result?.data?.questions ??
              [];

            const updatedQuestion = questions.find(
              (item: any) => item.questionID === questionID,
            );

            const nextModel = updatedQuestion?.Model3D;

            if (hasModelChanged(nextModel, previousModel)) {
              dispatch(setQuestion(updatedQuestion));
              dispatch(updateSelectedQuestion3DModel(nextModel));

              setProgress(100);
              setIsProcessingReplacement(false);
              setIsReplacementComplete(true);

              showToast.success("3D model replaced.");
              clearPollInterval();
              return;
            }

            if (attempts >= maxAttempts) {
              setIsProcessingReplacement(false);
              showToast.info(
                "Replacement is still processing. Refresh in a moment if it does not appear.",
              );
              clearPollInterval();
            }
          })
          ?.catch?.((pollError: unknown) => {
            console.error("Failed to refresh replacement status:", pollError);

            if (attempts >= maxAttempts) {
              setIsProcessingReplacement(false);
              showToast.info(
                "Replacement is still processing. Refresh in a moment if it does not appear.",
              );
              clearPollInterval();
            }
          });
      }, 1500);
    },
    [clearPollInterval, dispatch, questionID, refetchCanvas],
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!(await confirmSoftEdit(SOFT_EDIT_MESSAGES.MODEL_3D_CHANGE))) return;

      const validation = validateFile(file);

      if (validation) {
        setError(validation);
        setSelectedFile(null);
        return;
      }

      const previousModel = question?.Model3D;

      setError(null);
      setSelectedFile(file);
      setIsReplacementComplete(false);
      setIsProcessingReplacement(false);

      const formData = new FormData();
      formData.append("modelFile", file);
      formData.append("name", file.name);

      const stop = startSimulatedProgress();

      try {
        await replace3DModel({
          formData,
          questionID,
        }).unwrap();

        stop();
        setIsProcessingReplacement(true);
        showToast.success("Replacement uploaded. Processing 3D model...");
        pollForReplacedModel(previousModel);
      } catch (e: any) {
        stop();

        setError(
          typeof e?.data === "string"
            ? e.data
            : e?.data?.message || e?.error || "Failed to replace the model.",
        );

        setProgress(0);
        setIsProcessingReplacement(false);
      }
    },
    [
      confirmSoftEdit,
      pollForReplacedModel,
      question?.Model3D,
      questionID,
      replace3DModel,
      startSimulatedProgress,
    ],
  );

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

      const file = e.dataTransfer.files?.[0];
      if (file) {
        void handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const onInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        void handleFileSelect(file);
      }
    },
    [handleFileSelect],
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
        if (isBusy) return;

        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          handleRequestClose();
        }
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
          bgcolor: "#ffffff",
          backgroundImage: "none",
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
          disabled={isBusy}
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
        {isReplacementComplete ? (
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
                bgcolor: "#81C7841F",
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
            {isLoading || isProcessingReplacement ? (
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
                  {isLoading
                    ? "Uploading Replacement..."
                    : "Processing Replacement..."}
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {isLoading
                    ? "Please wait while we upload your new 3D model."
                    : "Please wait while we process your new 3D model."}
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
              <Stack spacing={3} sx={{ mt: 2 }}>
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
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        Current Model
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        You are about to replace:{" "}
                        <Box
                          component="span"
                          sx={{ fontWeight: 600, color: "text.primary" }}
                        >
                          {currentFileName}
                        </Box>
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

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
                    sx={{ mt: 1, borderRadius: 4 }}
                  >
                    Choose Replacement File
                    <input
                      hidden
                      ref={inputRef}
                      type="file"
                      accept={acceptedFormats.join(",")}
                      onChange={onInputChange}
                      onClick={(e) => {
                        e.currentTarget.value = "";
                      }}
                    />
                  </Button>
                </Box>

                <Paper
                  variant="outlined"
                  sx={{ p: 2.5, borderRadius: 2, bgcolor: "grey.50" }}
                >
                  <Typography sx={{ fontWeight: 700, mb: 1.5 }}>
                    Supported Formats
                  </Typography>

                  <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
                    {acceptedFormats.map((format) => (
                      <Chip
                        key={format}
                        label={format.toUpperCase()}
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

                        {error && (
                          <Typography variant="body2" color="error.main">
                            {error}
                          </Typography>
                        )}
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
