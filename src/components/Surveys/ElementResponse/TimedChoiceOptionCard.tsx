import { useEffect, useRef, useState } from "react";

import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { CircleX } from "lucide-react";

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
  canDelete,
  onDelete,
  displayMode,
  imageRole,
  optionImage,
}: {
  qID: string;
  option: OptionType;
  index: number;
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (optionID: string) => void;
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
      <Typography
        sx={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          bgcolor: "#FFF7ED",
          color: "#EA580C",
          fontSize: 13,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1.25,
        }}
      >
        {index === 0 ? "A" : "B"}
      </Typography>

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
                  bgcolor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                }}
              />

              {canEdit && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={isBusy}
                    onClick={() => replaceInputRef.current?.click()}
                    sx={{
                      textTransform: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      borderRadius: 999,
                    }}
                  >
                    {isReplacing ? "Replacing..." : "Replace"}
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    disabled={isBusy}
                    onClick={handleDeleteImage}
                    sx={{
                      textTransform: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      borderRadius: 999,
                    }}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
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
            minHeight: 38,
            cursor: canEdit ? "text" : "default",
            wordBreak: "break-word",
          }}
        >
          {option.text}
        </Typography>
      )}

      {canDelete && (
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            onDelete(option.optionID);
          }}
          aria-label="Delete timed choice option"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "darkred",
            bgcolor: "transparent",
            "&:hover": {
              bgcolor: "transparent",
            },
          }}
        >
          <CircleX fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
