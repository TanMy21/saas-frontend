import { useLayoutEffect, useRef } from "react";

import { Box, Chip } from "@mui/material";

import { useAppTheme } from "../../theme/useAppTheme";
import { DEFAULT_DESCRIPTION_PLACEHOLDER_TEXT } from "../../utils/constants";
import {
  sanitizeRichTextHtml,
  stripSummaryHtml,
} from "../../utils/richTextUtils";

import type { PreviewViewport } from "./PreviewHeader";
import PreviewResponseRenderer from "./PreviewResponseRenderer";
import type { PreviewQuestion } from "./previewTypes";

type PreviewQuestionRendererProps = {
  question: PreviewQuestion;
  viewport: PreviewViewport;
};

const SCREEN_TYPES = new Set([
  "WELCOME_SCREEN",
  "END_SCREEN",
  "INSTRUCTIONS",
  "INFO_SCREEN",
]);

const CONTENT_SCREEN_TYPES = new Set(["INSTRUCTIONS", "INFO_SCREEN"]);
const CENTERED_SCREEN_TYPES = new Set(["WELCOME_SCREEN", "END_SCREEN"]);

const PreviewQuestionRenderer = ({
  question,
  viewport,
}: PreviewQuestionRendererProps) => {
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const { primary } = useAppTheme();
  const isMobile = viewport === "mobile";
  const isMobileScale = isMobile && question.type === "RANGE";
  const isCenteredScreen = CENTERED_SCREEN_TYPES.has(question.type);
  const preferences = question.questionPreferences;
  const templateImage =
    preferences?.questionImageTemplate && preferences.questionImageTemplateUrl
      ? `url(${preferences.questionImageTemplateUrl})`
      : "none";
  const showQuestion =
    !CONTENT_SCREEN_TYPES.has(question.type) &&
    (question.showQuestion ?? question.Model3D?.showQuestion ?? true);
  const questionImage = question.questionImages?.[0];
  const isConceptFitImageMode =
    question.type === "CONCEPT_FIT" &&
    preferences?.uiConfig?.conceptDisplayMode === "IMAGE";
  const usesOptionImages = question.type === "TIMED_CHOICE";
  const showOrder =
    !SCREEN_TYPES.has(question.type) &&
    typeof question.order === "number" &&
    question.order > 0;
  const descriptionText = stripSummaryHtml(question.description);
  const showDescription =
    descriptionText.length > 0 &&
    descriptionText.toLocaleLowerCase() !==
      DEFAULT_DESCRIPTION_PLACEHOLDER_TEXT.toLocaleLowerCase();

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    scrollContainer.scrollTop = 0;
    scrollContainer.scrollLeft = 0;
  }, [question.questionID, viewport]);

  return (
    <Box
      component="section"
      ref={scrollContainerRef}
      aria-labelledby={`preview-question-${question.questionID}`}
      sx={{
        position: "relative",
        zIndex: 0,
        display: "flex",
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          width: 0,
          height: 0,
          display: "none",
        },
        backgroundColor: preferences?.questionBackgroundColor ?? "#FFFFFF",
        backgroundImage: templateImage,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Box
        component="div"
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 860,
          boxSizing: "border-box",
          m: "auto",
          pb: "calc(88px + env(safe-area-inset-bottom, 0px))",
          px: isMobileScale ? 4 : isMobile ? 2.5 : 5,
          py: isMobile ? 4 : 6,
        }}
      >
        {questionImage?.imageUrl &&
          !CONTENT_SCREEN_TYPES.has(question.type) &&
          !isConceptFitImageMode &&
          !usesOptionImages && (
            <Box
              component="img"
              src={questionImage.imageUrl}
              alt={questionImage.altText ?? ""}
              sx={{
                display: "block",
                width: "100%",
                maxHeight: isMobile ? 220 : 320,
                mb: 3,
                borderRadius: 2,
                objectFit: "contain",
              }}
            />
          )}

        {showQuestion && (
          <Box component="div" sx={{ mb: 4 }}>
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "flex-start",
                gap: isMobile ? 1.75 : 1.5,
              }}
            >
              {showOrder && (
                <Chip
                  label={question.order}
                  size="small"
                  sx={{
                    mt: isMobile ? 0 : 0.5,
                    width: 28,
                    height: 28,
                    minWidth: 28,
                    borderRadius: "50%",
                    alignSelf: isMobile ? "center" : "auto",
                    backgroundColor: primary.light,
                    color: "#f0f4fa",
                    fontWeight: 700,
                    "& .MuiChip-label": { px: 0 },
                  }}
                />
              )}
              <Box component="div" sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  component="div"
                  id={`preview-question-${question.questionID}`}
                  sx={{
                    color: preferences?.titleTextColor ?? "#101828",
                    fontSize: isMobile
                      ? (preferences?.titleFontSizeMobile ?? 26)
                      : (preferences?.titleFontSize ?? 34),
                    fontWeight: 700,
                    lineHeight: 1.2,
                    textAlign: isCenteredScreen ? "center" : undefined,
                    overflowWrap: "anywhere",
                    "& p": {
                      m: 0,
                      ...(isCenteredScreen && {
                        textAlign: "center !important",
                      }),
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeRichTextHtml(
                      question.text ?? "Untitled question",
                    ),
                  }}
                />

                {showDescription && (
                  <Box
                    component="div"
                    sx={{
                      width: "100%",
                      mt: 1.5,
                      color: preferences?.descriptionTextColor ?? "#667085",
                      fontSize: isMobile
                        ? (preferences?.descriptionFontSizeMobile ?? 15)
                        : (preferences?.descriptionFontSize ?? 16),
                      lineHeight: 1.5,
                      textAlign: "center",
                      overflowWrap: "anywhere",
                      "& p": {
                        m: 0,
                        textAlign: isCenteredScreen
                          ? "center !important"
                          : "center",
                      },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeRichTextHtml(question.description),
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        )}

        <PreviewResponseRenderer question={question} viewport={viewport} />
      </Box>
    </Box>
  );
};

export default PreviewQuestionRenderer;
