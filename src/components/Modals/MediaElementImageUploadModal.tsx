import { useCallback, useEffect, useState } from "react";

import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { ImageIcon, Loader2, Trash2, Upload, X } from "lucide-react";
import { toast } from "react-toastify";

import { useUploadImageMutation } from "../../app/slices/optionApiSlice";
import {
  ErrorData,
  MediaElementImageUploadModalProps,
} from "../../utils/types";
import UploadImageAnimation from "../Loaders/UploadImageAnimation";

const MediaElementImageUploadModal = ({
  uploadImageModalOpen,
  setUploadImageModalOpen,
  optionID,
}: MediaElementImageUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [
    uploadImage,
    {
      isSuccess,
      isLoading,
      isError: isErrorUploadImage,
      error: errorUploadImage,
    },
  ] = useUploadImageMutation();

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("imgFile", selectedFile);

      uploadImage({ formData, optionID: optionID });
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
    // optionID: string
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Image Saved !", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "colored",
      });
      setUploadImageModalOpen(false);
    }

    if (isErrorUploadImage) {
      const errorData = errorUploadImage as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isErrorUploadImage, errorUploadImage, isSuccess]);

  return (
    <Modal
      open={uploadImageModalOpen}
      onClose={() => setUploadImageModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "transparent",
        },
      }}
    >
      {isLoading ? (
        <UploadImageAnimation />
      ) : (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          {/* Modal content box */}
          <Box
            sx={{
              position: "relative",
              bgcolor: "common.white",
              borderRadius: 4,
              boxShadow: 24,
              width: "100%",
              maxWidth: 480,
              mx: "auto",
              transform: "scale(1)",
              opacity: 1,
              transition: "all 300ms",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 3,
                borderBottom: "1px solid",
                borderColor: "grey.100",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ p: 1, bgcolor: "blue.50", borderRadius: 2 }}>
                  <ImageIcon size={28} color="#2563eb" />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "grey.900" }}
                >
                  Upload Image
                </Typography>
              </Stack>

              <IconButton
                onClick={() => setUploadImageModalOpen(false)}
                disabled={isLoading}
                sx={{
                  p: 1,
                  borderRadius: 2,
                  color: "grey.500",
                  "&:hover": { bgcolor: "grey.100" },
                  "&.Mui-disabled": { opacity: 0.5, cursor: "not-allowed" },
                }}
              >
                <X size={28} />
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ p: 3 }}>
              {preview ? (
                <Box>
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 3,
                      border: "2px solid",
                      borderColor: "grey.200",
                      bgcolor: "grey.50",
                    }}
                  >
                    <Box
                      component="img"
                      src={preview}
                      alt="Preview"
                      sx={{ width: "100%", height: 256, objectFit: "contain" }}
                    />
                    <IconButton
                      onClick={handleRemoveImage}
                      disabled={isLoading}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        p: 1,
                        bgcolor: "error.main",
                        color: "white",
                        borderRadius: "50%",
                        boxShadow: 3,
                        transition: "all 200ms",
                        "&:hover": {
                          bgcolor: "error.dark",
                          transform: "scale(1.05)",
                        },
                        "&.Mui-disabled": {
                          opacity: 0.5,
                          cursor: "not-allowed",
                        },
                      }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                  <Box sx={{ mt: 2, textAlign: "center", color: "grey.600" }}>
                    <Typography fontWeight={500}>
                      {selectedFile?.name}
                    </Typography>
                    <Typography variant="body2">
                      {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-input")?.click()}
                  sx={{
                    position: "relative",
                    border: "2px dashed",
                    borderRadius: 3,
                    p: 6,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 200ms",
                    borderColor: isDragOver ? "blue.400" : "grey.300",
                    bgcolor: isDragOver ? "blue.50" : "background.paper",
                    "&:hover": {
                      borderColor: "grey.400",
                      bgcolor: "grey.50",
                    },
                  }}
                >
                  <input
                    type="file"
                    id="file-input"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    accept="image/*"
                    hidden
                  />

                  <Stack spacing={2} alignItems="center">
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "50%",
                        bgcolor: isDragOver ? "blue.100" : "grey.100",
                        display: "inline-flex",
                      }}
                    >
                      <Upload
                        size={32}
                        color={isDragOver ? "#2563eb" : "#6b7280"}
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "grey.900", mb: 1 }}
                      >
                        {isDragOver
                          ? "Drop your image here"
                          : "Drag & drop your image"}
                      </Typography>
                      <Typography sx={{ color: "grey.600" }}>
                        or{" "}
                        <Typography
                          component="span"
                          sx={{
                            color: "blue.600",
                            fontWeight: 500,
                            "&:hover": { color: "blue.700" },
                          }}
                        >
                          click to browse
                        </Typography>
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        fontSize: 14,
                        color: "grey.500",
                        textAlign: "center",
                      }}
                    >
                      <Typography>
                        Supported formats: JPEG, PNG, WebP
                      </Typography>
                      <Typography>Maximum size: 5MB</Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
            </Box>

            {/* Footer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
                p: 3,
                borderTop: "1px solid",
                borderColor: "grey.100",
              }}
            >
              <Button
                onClick={() => setUploadImageModalOpen(false)}
                disabled={isLoading}
                sx={{
                  px: 2,
                  py: 1,
                  fontWeight: 500,
                  color: "grey.700",
                  borderRadius: 2,
                  "&:hover": { bgcolor: "grey.100" },
                  "&.Mui-disabled": { opacity: 0.5, cursor: "not-allowed" },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isLoading}
                variant="contained"
                sx={{
                  px: 3,
                  py: 1,
                  fontWeight: 500,
                  borderRadius: 2,
                  bgcolor: selectedFile && !isLoading ? "blue.600" : "grey.300",
                  "&:hover": {
                    bgcolor:
                      selectedFile && !isLoading ? "blue.700" : "grey.300",
                  },
                  "&.Mui-disabled": { cursor: "not-allowed" },
                }}
                startIcon={
                  isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )
                }
              >
                {isLoading ? "Uploading..." : "Upload"}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Modal>
  );
};

export default MediaElementImageUploadModal;
