import { useRef } from "react";

import { Box, Typography, Button, IconButton } from "@mui/material";
import { UploadCloud, X } from "lucide-react";
import toast from "react-hot-toast";

import { FeedbackScreenshotUploadProps } from "../../types/feedBackTypes";

const FeedbackScreenshotUpload = ({
  file,
  setFile,
}: FeedbackScreenshotUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (selected: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(selected.type)) {
      toast.error("Only JPG and PNG images allowed");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  return (
    <Box sx={{ mb: 2 }}>
      {!file ? (
        <Box
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          sx={{
            border: "1.5px dashed #d1d5db",
            borderRadius: 3,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            bgcolor: "#fafafa",
            "&:hover": {
              borderColor: "#2563eb",
              bgcolor: "#f8fafc",
            },
          }}
        >
          <UploadCloud style={{ width: 32, height: 32, color: "#6b7280" }} />

          <Typography mt={1} fontSize={14} color="grey.700">
            Drag & drop or click to upload
          </Typography>

          <Typography fontSize={12} color="grey.500">
            PNG or JPG (max 5MB)
          </Typography>

          <input
            ref={inputRef}
            hidden
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) handleFile(selected);
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
            position: "relative",
          }}
        >
          {/* Remove */}
          <IconButton
            onClick={() => setFile(null)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "#e64242",
              color: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              "&:hover": { bgcolor: "#dc2626" },
            }}
          >
            <X size={18} />
          </IconButton>

          {/* Image preview */}
          <Box
            component="img"
            src={URL.createObjectURL(file)}
            sx={{
              width: "100%",
              maxHeight: 200,
              objectFit: "cover",
              borderRadius: 2,
            }}
          />

          {/* File name */}
          <Typography mt={1} fontSize={12} color="grey.600">
            {file.name}
          </Typography>

          {/* Replace button */}
          <Button
            size="small"
            onClick={() => inputRef.current?.click()}
            sx={{ mt: 1, textTransform: "none" }}
          >
            Replace image
          </Button>

          <input
            ref={inputRef}
            hidden
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) handleFile(selected);
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default FeedbackScreenshotUpload;
