import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ImageMinus, Replace } from "lucide-react";

import {
  useRemoveQuestionImageMutation,
  useReplaceQuestionImageMutation,
  useUploadQuestionImageMutation,
} from "../../../app/slices/elementApiSlice";
import { useUpdateOptionTextandValueMutation } from "../../../app/slices/optionApiSlice";
import { QuestionImageAsset } from "../../../types/surveyBuilderTypes";
import { showToast } from "../../../utils/showToast";
import { OptionType } from "../../../utils/types";

export const TimedChoiceOptionCard = ({
  qID,
  option,
  index,
  canEdit,
  displayMode,
  imageRole,
  optionImage,
}: {
  qID: string;
  option: OptionType;
  index: number;
  canEdit: boolean;
  displayMode: "TEXT" | "IMAGE";
  imageRole: string;
  optionImage?: QuestionImageAsset;
}) => {
  const [editText, setEditText] = useState(option.text);
  const [isEditing, setIsEditing] = useState(false);

  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);

  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

  const [uploadQuestionImage, { isLoading: isUploading }] =
    useUploadQuestionImageMutation();

  const [replaceQuestionImage, { isLoading: isReplacing }] =
    useReplaceQuestionImageMutation();

  const [removeQuestionImageAsset, { isLoading: isDeleting }] =
    useRemoveQuestionImageMutation();

  const isImageMode = displayMode === "IMAGE";
  const isBusy = isUploading || isReplacing || isDeleting;

  /**
   * Keeps local edit text synced when RTK Query returns updated option data.
   */
  useEffect(() => {
    setEditText(option.text);
  }, [option.text]);

  /**
   * Saves the option text and value together so dropdown/radio-style response logic stays consistent.
   */
  const handleSave = async () => {
    if (!canEdit) return;

    const trimmedText = editText.trim();

    if (!trimmedText) {
      setEditText(option.text);
      setIsEditing(false);
      return;
    }

    if (trimmedText !== option.text.trim()) {
      await updateOptionTextandValue({
        optionID: option.optionID,
        text: trimmedText,
        value: trimmedText,
      }).unwrap?.();
    }

    setIsEditing(false);
  };

  /**
   * Uploads an image for this timed choice option card.
   * The role decides whether it belongs to the left or right card.
   */
  const handleUploadImage = async (file: File) => {
    if (!qID || !imageRole || !canEdit) return;

    try {
      const formData = new FormData();
      formData.append("imgFile", file);

      await uploadQuestionImage({
        questionID: qID,
        role: imageRole,
        formData,
      }).unwrap();

      showToast.success("Option image uploaded.");
    } catch (error) {
      console.error("Timed choice image upload error:", error);
      showToast.error("Failed to upload option image.");
    }
  };

  /**
   * Replaces the image for this timed choice option card.
   */
  const handleReplaceImage = async (file: File) => {
    if (!qID || !optionImage || !canEdit) return;

    try {
      const formData = new FormData();
      formData.append("imgFile", file);

      await replaceQuestionImage({
        questionID: qID,
        questionImageID: optionImage.questionImageID,
        formData,
      }).unwrap();

      showToast.success("Option image replaced.");
    } catch (error) {
      console.error("Timed choice image replace error:", error);
      showToast.error("Failed to replace option image.");
    }
  };

  /**
   * Deletes the image from this timed choice option card.
   */
  const handleDeleteImage = async () => {
    if (!qID || !optionImage || !canEdit) return;

    try {
      await removeQuestionImageAsset({
        questionID: qID,
        questionImageID: optionImage.questionImageID,
      }).unwrap();

      showToast.success("Option image deleted.");
    } catch (error) {
      console.error("Timed choice image delete error:", error);
      showToast.error("Failed to delete option image.");
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        flex: 1,
        minWidth: 0,
        border: "1px solid #E2E8F0",
        borderRadius: 3,
        bgcolor: "#FFFFFF",
        px: 2,
        py: 2,
        boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: "#FDBA74",
          boxShadow: "0 10px 28px rgba(234,88,12,0.12)",
        },
      }}
    >
      {isImageMode && (
        <Box
          sx={{
            mb: 1.5,
            border: optionImage ? "1px solid #E2E8F0" : "1px dashed #CBD5E1",
            borderRadius: 2.5,
            bgcolor: optionImage ? "#FFFFFF" : "#F8FAFC",
            p: 1.25,
            textAlign: "center",
          }}
        >
          {optionImage?.imageUrl ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box
                component="img"
                src={optionImage.imageUrl}
                alt={
                  optionImage.altText || option.text || "Timed choice option"
                }
                sx={{
                  width: "100%",
                  height: 150,
                  objectFit: "contain",
                  borderRadius: 2,
                  bgcolor: "#ffffff",
                  border: "1px solid #E2E8F0",
                }}
              />

              {canEdit && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Tooltip
                    title={isReplacing ? "Replacing image..." : "Replace image"}
                  >
                    <span>
                      <IconButton
                        size="small"
                        disabled={isBusy}
                        onClick={() => replaceInputRef.current?.click()}
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: 1,
                          border: "1px solid #E2E8F0",
                          bgcolor: "#FFFFFF",
                          color: "#475569",
                          boxShadow: "0 6px 16px rgba(15, 23, 42, 0.08)",
                          transition: "all 0.18s ease",
                          "&:hover": {
                            bgcolor: "#F8FAFC",
                            color: "#2563EB",
                            borderColor: "#BFDBFE",
                            transform: "translateY(-1px)",
                            boxShadow: "0 10px 22px rgba(37, 99, 235, 0.16)",
                          },
                          "&.Mui-disabled": {
                            bgcolor: "#F8FAFC",
                            color: "#CBD5E1",
                            borderColor: "#E2E8F0",
                            boxShadow: "none",
                          },
                        }}
                      >
                        <Replace size={17} />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip
                    title={isDeleting ? "Deleting image..." : "Delete image"}
                  >
                    <span>
                      <IconButton
                        size="small"
                        disabled={isBusy}
                        onClick={handleDeleteImage}
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: 1,
                          border: "1px solid #FECACA",
                          bgcolor: "#FFFFFF",
                          color: "#DC2626",
                          boxShadow: "0 6px 16px rgba(15, 23, 42, 0.08)",
                          transition: "all 0.18s ease",
                          "&:hover": {
                            bgcolor: "#FEF2F2",
                            color: "#B91C1C",
                            borderColor: "#FCA5A5",
                            transform: "translateY(-1px)",
                            boxShadow: "0 10px 22px rgba(220, 38, 38, 0.16)",
                          },
                          "&.Mui-disabled": {
                            bgcolor: "#F8FAFC",
                            color: "#CBD5E1",
                            borderColor: "#E2E8F0",
                            boxShadow: "none",
                          },
                        }}
                      >
                        <ImageMinus size={17} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              )}

              <input
                ref={replaceInputRef}
                hidden
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";

                  if (!file) return;

                  await handleReplaceImage(file);
                }}
              />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={{ fontSize: 12, color: "#64748B" }}>
                Upload image for option {index === 0 ? "A" : "B"}
              </Typography>

              {canEdit && (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={isUploading}
                    onClick={() => uploadInputRef.current?.click()}
                    sx={{
                      alignSelf: "center",
                      textTransform: "none",
                      fontSize: 12,
                      fontWeight: 800,
                      borderRadius: 999,
                      bgcolor: "#EA580C",
                      "&:hover": {
                        bgcolor: "#C2410C",
                      },
                    }}
                  >
                    {isUploading ? "Uploading..." : "Upload image"}
                  </Button>

                  <input
                    ref={uploadInputRef}
                    hidden
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";

                      if (!file) return;

                      await handleUploadImage(file);
                    }}
                  />
                </>
              )}
            </Box>
          )}
        </Box>
      )}

      {isEditing ? (
        <TextField
          value={editText}
          autoFocus
          fullWidth
          size="small"
          onChange={(event) => setEditText(event.target.value)}
          onBlur={handleSave}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSave();
            }

            if (event.key === "Escape") {
              setEditText(option.text);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <Typography
          onClick={() => {
            if (!canEdit) return;
            setIsEditing(true);
          }}
          sx={{
            fontSize: 16,
            fontWeight: 700,
            color: "#0F172A",
            minHeight: 24,
            cursor: canEdit ? "text" : "default",
            wordBreak: "break-word",
          }}
        >
          {option.text}
        </Typography>
      )}
    </Box>
  );
};
