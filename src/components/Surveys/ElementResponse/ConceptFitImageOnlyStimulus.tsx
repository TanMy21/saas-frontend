import { useRef } from "react";

import { Box, Button, Typography } from "@mui/material";

import {
  useRemoveQuestionImageMutation,
  useReplaceQuestionImageMutation,
  useUploadQuestionImageMutation,
} from "../../../app/slices/elementApiSlice";
import useAuth from "../../../hooks/useAuth";
import { ConceptFitStimulusLayoutProps } from "../../../types/surveyBuilderTypes";
import { CONCEPT_FIT_IMAGE_ROLE } from "../../../utils/constants";
import { showToast } from "../../../utils/showToast";

import { ConceptFitAttributeManager } from "./ConceptFitAttributeManager";

export const ConceptFitImageOnlyStimulus = (
  props: ConceptFitStimulusLayoutProps,
) => {
  const { qID, display, qImage = [] } = props;

  const { can } = useAuth();

  const canEditQuestion = can("UPDATE_QUESTION");
  const isMobile = display === "mobile";

  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadQuestionImage, { isLoading: isUploading }] =
    useUploadQuestionImageMutation();

  const [replaceQuestionImage, { isLoading: isReplacing }] =
    useReplaceQuestionImageMutation();

  const [removeQuestionImage, { isLoading: isDeleting }] =
    useRemoveQuestionImageMutation();

  const conceptImage = qImage.find(
    (image) => image.role === CONCEPT_FIT_IMAGE_ROLE,
  );

  const isBusy = isUploading || isReplacing || isDeleting;

  const handleUploadImage = async (file: File) => {
    if (!qID || !canEditQuestion) return;

    try {
      const formData = new FormData();
      formData.append("imgFile", file);

      await uploadQuestionImage({
        questionID: qID,
        role: CONCEPT_FIT_IMAGE_ROLE,
        formData,
      }).unwrap();

      showToast.success("Concept image uploaded.");
    } catch (error) {
      console.error("Concept image upload error:", error);
      showToast.error("Failed to upload concept image.");
    }
  };

  const handleReplaceImage = async (file: File) => {
    if (!qID || !conceptImage || !canEditQuestion) return;

    try {
      const formData = new FormData();
      formData.append("imgFile", file);

      await replaceQuestionImage({
        questionID: qID,
        questionImageID: conceptImage.questionImageID,
        formData,
      }).unwrap();

      showToast.success("Concept image replaced.");
    } catch (error) {
      console.error("Concept image replace error:", error);
      showToast.error("Failed to replace concept image.");
    }
  };

  /**
   * Deletes the existing static Concept Fit image.
   */
  const handleDeleteImage = async () => {
    if (!qID || !conceptImage || !canEditQuestion) return;

    try {
      await removeQuestionImage({
        questionID: qID,
        questionImageID: conceptImage.questionImageID,
      }).unwrap();

      showToast.success("Concept image deleted.");
    } catch (error) {
      console.error("Concept image delete error:", error);
      showToast.error("Failed to delete concept image.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 3,
      }}
    >
      <Box
        sx={{
          width: isMobile ? "92%" : "72%",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Box
          sx={{
            // border: conceptImage ? "1px solid #E2E8F0" : "1px dashed #CBD5E1",
            // borderRadius: 3,
            // bgcolor: conceptImage ? "#FFFFFF" : "#F8FAFC",
            px: isMobile ? 2 : 3,
            py: isMobile ? 2.5 : 3,
            textAlign: "center",
            // boxShadow: conceptImage
            //   ? "0 14px 34px rgba(15,23,42,0.08)"
            //   : "none",
          }}
        >
          {conceptImage?.imageUrl ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box
                component="img"
                src={conceptImage.imageUrl}
                alt={conceptImage.altText || "Concept image"}
                sx={{
                  width: "100%",
                  maxWidth: isMobile ? 280 : 420,
                  maxHeight: isMobile ? 180 : 260,
                  objectFit: "contain",
                  mx: "auto",
                  borderRadius: 2.5,
                  bgcolor: "#ffffff",
                  // border: "1px solid #E2E8F0",
                }}
              />

              {!isMobile && canEditQuestion && (
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
                      fontWeight: 700,
                      borderRadius: 999,
                    }}
                  >
                    {isReplacing ? "Replacing..." : "Replace image"}
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    disabled={isBusy}
                    onClick={handleDeleteImage}
                    sx={{
                      textTransform: "none",
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

                  // Allows selecting the same file again.
                  event.target.value = "";

                  if (!file) return;

                  await handleReplaceImage(file);
                }}
              />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#64748B",
                }}
              >
                Concept image
              </Typography>

              <Typography sx={{ fontSize: 14, color: "#64748B" }}>
                Upload one static image for the concept being tested.
              </Typography>

              {!isMobile && canEditQuestion && (
                <>
                  <Button
                    variant="contained"
                    disabled={isUploading}
                    onClick={() => uploadInputRef.current?.click()}
                    sx={{
                      alignSelf: "center",
                      mt: 0.5,
                      textTransform: "none",
                      fontWeight: 800,
                      borderRadius: 999,
                      bgcolor: "#0891B2",
                      "&:hover": {
                        bgcolor: "#0E7490",
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

                      // Allows selecting the same file again.
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

        <ConceptFitAttributeManager {...props} />
      </Box>
    </Box>
  );
};
