import { Box, Typography } from "@mui/material";

import { useGetOptionsOfQuestionQuery } from "../../../app/slices/optionApiSlice";
import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import {
  DEFAULT_CONCEPT_FIT_LEFT_TEXT,
  DEFAULT_CONCEPT_FIT_RIGHT_TEXT,
} from "../../../utils/constants";
import { OptionType } from "../../../utils/types";

export const ConceptFitResponseMobilePreview = () => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const questionID = question?.questionID;
  const uiConfig = question?.questionPreferences?.uiConfig || {};

  const conceptDisplayMode = uiConfig.conceptDisplayMode ?? "TEXT";
  const showImageMode = conceptDisplayMode === "IMAGE";

  const leftText = uiConfig.conceptFitLeftText || DEFAULT_CONCEPT_FIT_LEFT_TEXT;
  const rightText =
    uiConfig.conceptFitRightText || DEFAULT_CONCEPT_FIT_RIGHT_TEXT;

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    questionID!,
    {
      skip: !questionID,
    },
  );

  const firstAttribute = options[0];

  const conceptImage = question?.questionImages?.[0];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 480,
        display: "flex",
        mt: 0,
      }}
    >
      <Box
        sx={{
          width: "98%",
          minHeight: 400,
          borderRadius: "28px",
          bgcolor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          overflow: "hidden",
          // border: "2px solid green",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 1.5,
            px: 1.25,
          }}
        >
          {!firstAttribute ? (
            <Box
              sx={{
                width: "96%",
                minHeight: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 3,
                color: "#94A3B8",
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                Please define attributes in the builder first.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                // border: "2px solid red",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  width: "96%",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 3,
                  mb: 1,
                  // border: "2px solid blue",
                }}
              >
                <Box
                  sx={{
                    py: 3,
                    borderRadius: "18px",
                    bgcolor: "#FFF1F2",
                    color: "#BE123C",
                    border: "1px solid #FFE4E6",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    boxShadow: "0 6px 14px rgba(190,18,60,0.08)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {leftText}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    py: 3,
                    borderRadius: "18px",
                    bgcolor: "#ECFDF5",
                    color: "#047857",
                    border: "1px solid #D1FAE5",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    boxShadow: "0 6px 14px rgba(4,120,87,0.08)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {rightText}
                  </Typography>
                </Box>
              </Box>

              {showImageMode && conceptImage?.imageUrl && (
                <Box
                  sx={{
                    width: "82%",
                    maxHeight: 180,
                    borderRadius: "22px",
                    overflow: "hidden",
                    display: "flex",
                    mb: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={conceptImage.imageUrl}
                    alt={conceptImage.altText || "Concept preview image"}
                    sx={{
                      width: "100%",
                      height: "100%",
                      maxHeight: 180,
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </Box>
              )}

              {showImageMode && !conceptImage?.imageUrl && (
                <Box
                  sx={{
                    width: "82%",
                    minHeight: 120,
                    borderRadius: "22px",
                    bgcolor: "#F8FAFC",
                    border: "1px dashed #CBD5E1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#94A3B8",
                    }}
                  >
                    Upload a concept image to preview image mode.
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  width: "82%",
                  minHeight: 60,
                  bgcolor: "#FFFFFF",
                  border: "2px dashed #D8B4FE",
                  borderRadius: "28px",
                  p: showImageMode ? 2.2 : 3,
                  boxShadow: "0 12px 30px rgba(88,28,135,0.12)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: showImageMode ? 18 : 20,
                    fontWeight: 950,
                    color: "#6B21A8",
                    lineHeight: 1.25,
                    px: 1,
                  }}
                >
                  {firstAttribute.text || "Untitled Attribute"}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
