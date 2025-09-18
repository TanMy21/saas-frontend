import { useRef, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Hash, Plus, TagIcon } from "lucide-react";

import { useUpdateSurveyTagsMutation } from "../../app/slices/surveysApiSlice";
import { SurveyTagsModalProps } from "../../utils/types";

const SurveyTagsModal = ({ open, onClose, survey }: SurveyTagsModalProps) => {
  const { surveyID, surveyTag } = survey;
  const [tags, setTags] = useState<string[]>(surveyTag || []);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [_isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_TAGS = 5;

  const [updateSurveyTags, { isLoading }] = useUpdateSurveyTagsMutation();

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim().toLowerCase();

    if (!trimmedValue) return;

    const normalizedTags = tags.map((tag) => tag.trim().toLowerCase());

    if (normalizedTags.includes(trimmedValue)) {
      setErrorMessage(`"${trimmedValue}" has already been added.`);
      return;
    }

    if (tags.length >= MAX_TAGS) {
      setErrorMessage(`You can only add up to ${MAX_TAGS} tags.`);
      return;
    }

    setTags([...tags, trimmedValue]);
    setInputValue("");
    setErrorMessage("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await updateSurveyTags({ surveyID, tags }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update tags", error);
    }
    onClose();
  };

  const remainingTags = MAX_TAGS - tags.length;
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{ zIndex: 1500 }}
      slotProps={{
        backdrop: {
          style: {
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
          },
        },
      }}
    >
      <Box
        sx={{
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          p: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: 12,
            width: "100%",
            maxWidth: 640,
            p: 0,
            overflow: "hidden",
            outline: "none",
            transition: "box-shadow 0.25s, transform 0.2s",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              position: "relative",
              px: 2,
              py: 2,
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 20,
                top: 20,
                p: 1.2,
                borderRadius: "50%",
                "&:hover": { bgcolor: "#f3f4f6" },
              }}
            >
              <CloseIcon style={{ width: 28, height: 28, color: "#6b7280" }} />
            </IconButton>
            <Box
              sx={{
                p: 2,
                bgcolor: "#eff6ff",
                borderRadius: 2.5,
                mr: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 36,
                minHeight: 36,
              }}
            >
              <TagIcon style={{ width: 28, height: 28, color: "#2563eb" }} />
            </Box>
            <Box>
              <Typography fontWeight={700} fontSize={24} color="#1e293b">
                Survey Tags
              </Typography>
              <Typography
                fontSize={15}
                color="#64748b"
                sx={{ mt: 0.5, fontWeight: 500 }}
              >
                Add tags to help organize and categorize your survey
              </Typography>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ px: 4, py: 2 }}>
            {/* Input */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Box sx={{ flex: 1, position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: 12,
                    pt: 0.5,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                  }}
                >
                  <Hash style={{ width: 20, height: 20, color: "#94a3b8" }} />
                </Box>
                <TextField
                  inputRef={inputRef}
                  fullWidth
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    remainingTags > 0
                      ? `Add a tag (${remainingTags} remaining)`
                      : "Maximum tags reached"
                  }
                  disabled={tags.length >= MAX_TAGS}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 60,
                      pl: 5,
                      pr: 1,
                      borderRadius: 2,
                      fontSize: 16,
                      bgcolor: "#fff",
                      alignItems: "center",
                      transition: "all 0.2s",
                      "& fieldset": {
                        border: "2px solid #e5e7eb",
                      },
                      "&:hover fieldset": {
                        borderColor: "#d1d5db",
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        boxShadow: "0 4px 24px 0 rgba(59,130,246,0.12)",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "#f3f4f6",
                        opacity: 0.8,
                      },
                    },
                  }}
                  inputProps={{
                    style: {
                      height: "100%",
                      padding: 0,
                      fontSize: 16,
                      boxSizing: "border-box",
                    },
                  }}
                />
              </Box>
              <Button
                onClick={handleAddTag}
                disabled={!inputValue.trim() || tags.length >= MAX_TAGS}
                sx={{
                  width: "100px",
                  height: "60px",
                  minWidth: 0,
                  px: 0,
                  py: 0,
                  bgcolor:
                    !inputValue.trim() || tags.length >= MAX_TAGS
                      ? "#e5e7eb"
                      : "#2563eb",
                  color:
                    !inputValue.trim() || tags.length >= MAX_TAGS
                      ? "#6b7280"
                      : "#fff",
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow:
                    !inputValue.trim() || tags.length >= MAX_TAGS
                      ? "none"
                      : "0 2px 10px 0 rgba(59,130,246,0.13)",
                  transition: "all 0.19s",
                  "&:hover": {
                    bgcolor:
                      !inputValue.trim() || tags.length >= MAX_TAGS
                        ? "#e5e7eb"
                        : "#1d4ed8",
                  },
                }}
                disableElevation
                startIcon={<Plus size={20} />}
              >
                Add
              </Button>
            </Box>

            {/* Error */}
            {errorMessage && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: -1.5, mb: 2, ml: 1, fontWeight: 500 }}
              >
                {errorMessage}
              </Typography>
            )}

            {/* Tags */}
            <Box sx={{ mb: 5, minHeight: 64 }}>
              {tags.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  {tags.map((tag, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        background:
                          "linear-gradient(90deg,#eff6ff,#dbeafe 88%,#bae6fd 120%)",
                        border: "1px solid #bfdbfe",
                        borderRadius: 2.5,
                        px: 2.5,
                        py: 1,
                        transition: "all 0.2s",
                        "&:hover": {
                          background: "linear-gradient(90deg,#dbeafe,#bae6fd)",
                          borderColor: "#60a5fa",
                        },
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      <Hash
                        style={{
                          width: 16,
                          height: 16,
                          color: "#2563eb",
                          marginRight: 6,
                        }}
                      />
                      <Typography
                        sx={{
                          color: "#1e40af",
                          fontWeight: 600,
                          mr: 0.5,
                          fontSize: 15,
                        }}
                      >
                        {tag}
                      </Typography>
                      <IconButton
                        onClick={() => handleRemoveTag(index)}
                        size="small"
                        sx={{
                          ml: 0.5,
                          p: "3px",
                          bgcolor: "transparent",
                          color: "#2563eb",
                          opacity: 0.4,
                          transition: "opacity 0.18s",
                          "&:hover": {
                            bgcolor: "#e0e7ff",
                            opacity: 1,
                          },
                        }}
                      >
                        <CloseIcon style={{ width: 14, height: 14 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      background: "#f3f4f6",
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <TagIcon
                      style={{ width: 32, height: 32, color: "#cbd5e1" }}
                    />
                  </Box>
                  <Typography sx={{ color: "#64748b", fontSize: 15 }}>
                    No tags added yet. You can add up to {MAX_TAGS} tags.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              px: 2,
              py: 2,
              bgcolor: "#f9fafb",
              borderTop: "1px solid #f3f4f6",
              borderRadius: "0 0 16px 16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                Tags help organize and filter your surveys
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={onClose}
                  sx={{
                    px: 3,
                    py: 1.7,
                    color: "#334155",
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: "transparent",
                    transition: "background 0.15s",
                    "&:hover": {
                      bgcolor: "#e2e8f0",
                      color: "#0f172a",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  sx={{
                    px: 4,
                    py: 1.7,
                    bgcolor: "#2563eb",
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: 2,
                    boxShadow: isLoading
                      ? "none"
                      : "0 2px 10px 0 rgba(59,130,246,0.13)",
                    "&:hover": {
                      bgcolor: "#1d4ed8",
                    },
                    minWidth: 120,
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={18} sx={{ color: "#fff", mr: 1 }} />
                  ) : null}
                  {isLoading ? "Saving Tags..." : "Save Tags"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default SurveyTagsModal;
