import { useEffect, useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { FiUpload } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { useUploadQuestionTemplateImageMutation } from "../../app/slices/elementApiSlice";
import { setTemplateImage } from "../../app/slices/elementSlice";
import { useAppTheme } from "../../theme/useAppTheme";
import { ErrorData, QuestionImageUploadModalProps } from "../../utils/types";

const QuestionTemplateImageUpload = ({
  uploadImageModalOpen,
  setUploadImageModalOpen,
  questionID,
}: QuestionImageUploadModalProps) => {
  const { primary } = useAppTheme();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [
    uploadQuestionTemplateImage,
    {
      isSuccess,
      isLoading,
      isError: isErrorUploadImage,
      error: errorUploadImage,
    },
  ] = useUploadQuestionTemplateImageMutation();

  const handlePreviewImage = () => {
    // UI reset only
    setSelectedFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("imgFile", selectedFile);

        const data = await uploadQuestionTemplateImage({
          formData,
          questionID,
        }).unwrap();
        if (data) {
          dispatch(setTemplateImage({ url: data.questionImageTemplateUrl }));
          console.log(
            "Image uploaded successfully:",
            data.questionImageTemplateUrl
          );
        }
      }
    } catch (error) {
      console.error("Error uploading template:", error);
      toast.error("Error uploading template image", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "colored",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.success("Template Saved !", {
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
          toast.error(el.message, { position: "top-right" })
        );
      } else {
        toast.error(errorData.data.message, { position: "top-right" });
      }
    }
  }, [isErrorUploadImage, errorUploadImage, isSuccess]);

  return (
    <Modal
      open={uploadImageModalOpen}
      onClose={() => setUploadImageModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      // 🔥 Backdrop now matches Tailwind modal (dark + slight blur)
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <Box
        // 💳 Card container
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 560, // tighter, focused dialog
          bgcolor: "#ffffff",
          borderRadius: 3,
          boxShadow: "0 20px 45px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        {/* 🧭 Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2.5,
            borderBottom: "1px solid #F1F2F4",
          }}
        >
          <Box>
            <Typography
              sx={{ fontSize: 18, fontWeight: 600, color: "#111827" }}
            >
              Upload Image
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#6B7280", mt: 0.5 }}>
              upload image to use as template background
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => setUploadImageModalOpen(false)}
            sx={{
              p: 1,
              "&:hover": { backgroundColor: "#F3F4F6" },
            }}
          >
            <CloseIcon sx={{ fontSize: 24, color: "#6B7280" }} />
          </IconButton>
        </Box>

        {/* 📤 Body */}
        <Box sx={{ p: 3 }}>
          {/* If no preview yet, show dashed drop zone look (browse still triggers input) */}
          {!preview ? (
            <Box
              sx={{
                position: "relative",
                border: "2px dashed #D1D5DB",
                borderRadius: 2.5,
                p: 5,
                textAlign: "center",
                transition: "all 200ms ease",
                "&:hover": {
                  borderColor: "#9CA3AF",
                  backgroundColor: "#F9FAFB",
                },
              }}
            >
              {/* Circular icon container */}
              <Box
                sx={{
                  mx: "auto",
                  width: 64,
                  height: 64,
                  borderRadius: "9999px",
                  backgroundColor: "#F3F4F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {/* Keeping your FiUpload icon for consistency */}
                <Typography sx={{ fontSize: 30, color: "#2563EB" }}>
                  <FiUpload />
                </Typography>
              </Box>

              <Typography
                sx={{ fontSize: 16, fontWeight: 600, color: "#111827" }}
              >
                Drop your image here
              </Typography>

              <Typography sx={{ color: "#6B7280", mt: 0.5 }}>
                or{" "}
                {/* 🔗 Styled browse label triggers the hidden input (same behavior) */}
                <label
                  htmlFor="img-ipload"
                  style={{
                    cursor: "pointer",
                    color: "#2563EB",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    fontWeight: 600,
                  }}
                >
                  browse files
                </label>
              </Typography>

              {/* Constraints */}
              <Box sx={{ mt: 2, color: "#9CA3AF", fontSize: 8 }}>
                <Typography>Supported: JPEG, PNG</Typography>
                <Typography>Maximum size: 5MB</Typography>
              </Box>

              {/* Hidden input (unchanged behavior) */}
              <input
                type="file"
                id="img-ipload"
                onChange={handleFileChange}
                disabled={isLoading}
                accept="image/jpeg,image/png"
                style={{ display: "none" }}
              />
            </Box>
          ) : (
            // 🖼️ Preview state
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box
                sx={{
                  position: "relative",
                  backgroundColor: "#F9FAFB",
                  borderRadius: 2,
                  overflow: "hidden",
                  height: 220,
                }}
              >
                <img
                  src={preview}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* ⏳ Loading overlay (visual only) */}
                {isLoading && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(0,0,0,0.2)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: "3px solid #2563EB",
                        borderTopColor: "transparent",
                        animation: "spin 1s linear infinite",
                        "@keyframes spin": {
                          "0%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(360deg)" },
                        },
                        backgroundColor: "rgba(255,255,255,0.85)",
                      }}
                    />
                  </Box>
                )}

                {/* ❌ Remove preview button */}
                <IconButton
                  onClick={handlePreviewImage}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 32,
                    height: 32,
                    borderRadius: "9999px",
                    backgroundColor: "rgba(239, 68, 68, 0.95)",
                    color: "#fff",
                    boxShadow: "0 6px 14px rgba(239,68,68,0.3)",
                    "&:hover": { backgroundColor: "rgba(220, 38, 38, 1)" },
                  }}
                >
                  <ClearIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>

              {/* 📄 File info row */}
              {selectedFile && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.25,
                    border: "1px solid #E5E7EB",
                    borderRadius: 1.5,
                    backgroundColor: "#fff",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.25,
                        backgroundColor: "#DBEAFE",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {/* Simple image glyph using MUI icon */}
                      <ImageIcon sx={{ fontSize: 20, color: "#2563EB" }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#111827",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 240,
                        }}
                        title={selectedFile.name}
                      >
                        {selectedFile.name}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                  </Box>

                  {/* Status text (driven by your existing isLoading flag) */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {isLoading ? (
                      <Typography
                        sx={{ fontSize: 12, fontWeight: 600, color: "#2563EB" }}
                      >
                        Uploading…
                      </Typography>
                    ) : (
                      <Typography
                        sx={{ fontSize: 12, fontWeight: 600, color: "#059669" }}
                      >
                        Ready
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* 🧯 Footer actions */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid #F1F2F4",
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          {/* Secondary action: choose different (only shows if preview exists) */}
          {preview && (
            <Button
              onClick={handlePreviewImage}
              variant="outlined"
              disabled={isLoading}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2.5,
                borderColor: "#E5E7EB",
                color: "#374151",
                "&:hover": {
                  borderColor: "#D1D5DB",
                  backgroundColor: "#F9FAFB",
                },
              }}
            >
              Choose Different
            </Button>
          )}

          {/* Primary: Upload */}
          <Button
            onClick={handleUpload}
            role={undefined}
            variant="contained"
            size="medium"
            tabIndex={-1}
            startIcon={isLoading ? <SaveIcon /> : <CloudUploadIcon />}
            disabled={!selectedFile || isLoading}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              backgroundColor: primary.main,
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.25)",
              "&:hover": { backgroundColor: primary.main },
              "&.Mui-disabled": { backgroundColor: "#9CA3AF", color: "#FFF" },
            }}
          >
            {isLoading ? "Saving image ..." : "Upload image"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default QuestionTemplateImageUpload;
