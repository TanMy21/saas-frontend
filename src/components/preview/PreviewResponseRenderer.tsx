import { useEffect, useRef, type ReactNode } from "react";

import { Box, Button } from "@mui/material";
import { MoveRight } from "lucide-react";

import { setQuestion } from "../../app/slices/elementSlice";
import { useAppDispatch } from "../../app/typedReduxHooks";
import { isIATOptionInGroup } from "../../utils/iatUtils";
import type { Element, OptionType } from "../../utils/types";
import BinaryResponseContainer from "../Surveys/ElementResponse/BinaryResponseContainer";
import { ConceptFitPreview } from "../Surveys/ElementResponse/ConceptFitPreview";
import { ConceptFitResponseMobilePreview } from "../Surveys/ElementResponse/ConceptFitResponseMobilePreview";
import { DropdownPreview } from "../Surveys/ElementResponse/DropdownPreview";
import { IATMobilePreview } from "../Surveys/ElementResponse/IATResposeMobilePreview";
import InputResponse from "../Surveys/ElementResponse/InputResponse";
import MediaOptionsContainer from "../Surveys/ElementResponse/MediaOptionsContainer";
import ResponseListItem from "../Surveys/ElementResponse/ResponseListItem";
import ScaleResponse from "../Surveys/ElementResponse/ScaleResponse";
import { TimedChoiceResponse } from "../Surveys/ElementResponse/TimedChoiceResponse";
import { TimedChoiceResponseMobilePreview } from "../Surveys/ElementResponse/TimedChoiceResponseMobilePreview";
import { InfoScreenContent } from "../Surveys/Elements/InfoScreenContent";
import ThreeDMobileView from "../Surveys/Elements/ThreeDMobileView";
import ThreeDView from "../Surveys/Elements/ThreeDView";

import type { PreviewViewport } from "./PreviewHeader";
import PreviewIATCombinedBlock from "./PreviewIATCombinedBlock";
import type { PreviewQuestion } from "./previewTypes";

type PreviewResponseRendererProps = {
  question: PreviewQuestion;
  viewport: PreviewViewport;
};

const EDITOR_ICON_TYPES = new Set([
  "CONCEPT_FIT",
  "DROPDOWN",
  "IAT",
  "MEDIA",
  "MULTIPLE_CHOICE",
  "RADIO",
  "RANK",
  "TIMED_CHOICE",
]);

const ReadOnlyResponseBoundary = ({
  children,
  hideIconButtons,
  hideDeleteControls = true,
  allowInteraction = false,
}: {
  children: ReactNode;
  hideIconButtons: boolean;
  hideDeleteControls?: boolean;
  allowInteraction?: boolean;
}) => {
  const boundaryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary) return;

    if (allowInteraction) {
      boundary.removeAttribute("inert");
      return;
    }

    boundary.setAttribute("inert", "");
    return () => boundary.removeAttribute("inert");
  }, [allowInteraction]);

  return (
    <Box
      component="div"
      ref={boundaryRef}
      aria-label="Read-only response preview"
      sx={{
        width: "100%",
        pointerEvents: allowInteraction ? "auto" : "none",
        userSelect: "none",
        "& [aria-label*='upload' i], & [aria-label*='replace' i], & [aria-label*='add option' i], & .template-icon-btn":
          { display: "none !important" },
        ...(hideDeleteControls && {
          "& [aria-label*='delete' i]": { display: "none !important" },
        }),
        ...(hideIconButtons && {
          "& .MuiIconButton-root": { display: "none !important" },
        }),
      }}
    >
      {children}
    </Box>
  );
};

const WelcomeResponse = ({ question }: { question: PreviewQuestion }) => {
  const buttonText = question.questionPreferences?.uiConfig?.buttonText;
  const label = typeof buttonText === "string" ? buttonText : "Next";

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        width: "100%",
        height: 100,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          borderRadius: 9999,
          backgroundColor: "#005BC4",
          px: 3,
          py: 1,
          color: "#FFFFFF",
          fontSize: "1.125rem",
          fontWeight: 700,
          textTransform: "none",
          "&:hover": { backgroundColor: "#004A9F" },
        }}
      >
        {label}
        <MoveRight size={24} />
      </Button>
    </Box>
  );
};

const BackendResponseList = ({
  question,
  display,
  qType,
}: {
  question: PreviewQuestion;
  display: PreviewViewport;
  qType: "MULTIPLE_CHOICE" | "RADIO" | "RANK";
}) => {
  const options = question.options ?? [];

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          width: display === "mobile" ? "98%" : "84%",
          mx: "auto",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {options.map((option, index) => (
          <Box
            component="div"
            key={option.optionID}
            sx={{ outline: "none", border: "none" }}
          >
            <ResponseListItem
              qType={qType}
              response={option as OptionType}
              index={index}
              display={display}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const ExistingResponse = ({
  question,
  viewport,
}: PreviewResponseRendererProps) => {
  const display = viewport;
  const qID = question.questionID;

  switch (question.type) {
    case "BINARY":
      return <BinaryResponseContainer display={display} />;
    case "CONCEPT_FIT":
      if (display === "mobile") {
        return <ConceptFitResponseMobilePreview />;
      }

      return (
        <Box
          component="div"
          sx={{
            width: "72%",
            mx: "auto",
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {question.questionPreferences?.uiConfig?.conceptDisplayMode ===
            "IMAGE" &&
            question.questionImages?.[0]?.imageUrl && (
              <Box
                component="img"
                src={question.questionImages[0].imageUrl}
                alt={
                  question.questionImages[0].altText ?? "Concept fit image"
                }
                sx={{
                  display: "block",
                  width: "100%",
                  maxWidth: 420,
                  maxHeight: 260,
                  mx: "auto",
                  borderRadius: 2.5,
                  objectFit: "contain",
                }}
              />
            )}
          <ConceptFitPreview firstAttribute={question.options?.[0]?.text} />
        </Box>
      );
    case "DROPDOWN":
      return (
        <Box
          component="div"
          sx={{
            width: display === "mobile" ? "92%" : "62%",
            mx: "auto",
            mt: 3,
          }}
        >
          <DropdownPreview
            options={(question.options ?? []) as OptionType[]}
          />
        </Box>
      );
    case "EMAIL_CONTACT":
      return (
        <Box
          component="div"
          sx={{
            width: "100%",
            boxSizing: "border-box",
            pl:
              display === "desktop" &&
              typeof question.order === "number" &&
              question.order > 0
                ? 5
                : 0,
            "& > .MuiBox-root > .MuiBox-root": {
              width: "100%",
              m: 0,
            },
            "& .MuiTextField-root": {
              width: display === "mobile" ? "92%" : "64%",
              ml: "0 !important",
              mr: "auto !important",
            },
          }}
        >
          <InputResponse
            inputPlaceholder="name@example.com"
            submitButtonText="Submit"
            display={display}
          />
        </Box>
      );
    case "IAT": {
      if (display === "mobile") {
        return <IATMobilePreview qID={qID} display={display} />;
      }

      const sortedOptions = [...(question.options ?? [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      );
      const firstStimulus =
        sortedOptions.find((option) =>
          isIATOptionInGroup(option.settings, "THEME_A"),
        )?.text ??
        sortedOptions.find((option) =>
          isIATOptionInGroup(option.settings, "THEME_B"),
        )?.text ??
        sortedOptions[0]?.text;

      return (
        <Box
          component="div"
          sx={{
            width: "76%",
            mx: "auto",
            mt: 3,
          }}
        >
          <PreviewIATCombinedBlock
            centerStimulus={firstStimulus}
            uiConfig={question.questionPreferences?.uiConfig}
          />
        </Box>
      );
    }
    case "INFO_SCREEN":
    case "INSTRUCTIONS":
      return (
        <Box
          component="div"
          sx={{
            width: "100%",
            ...(display === "desktop" && {
              "& > .MuiBox-root > .MuiBox-root": {
                px: 4,
                py: 4,
              },
              "& > .MuiBox-root > .MuiBox-root > .MuiBox-root": {
                p: 3,
                minHeight: 360,
              },
              "& .ProseMirror": {
                minHeight: 320,
              },
              "& .ProseMirror h1": {
                fontSize: 32,
              },
              "& .ProseMirror h2": {
                fontSize: 26,
              },
              "& .ProseMirror h3": {
                fontSize: 22,
              },
            }),
          }}
        >
          <InfoScreenContent qID={qID} display="mobile" />
        </Box>
      );
    case "MEDIA":
      return (
        <Box
          component="div"
          sx={{
            width: "100%",
            "& > .MuiBox-root > button": {
              display: "none !important",
            },
          }}
        >
          <MediaOptionsContainer qID={qID} display={display} />
        </Box>
      );
    case "MULTIPLE_CHOICE":
      return (
        <BackendResponseList
          question={question}
          display={display}
          qType="MULTIPLE_CHOICE"
        />
      );
    case "NUMBER":
    case "TEXT":
      return (
        <InputResponse
          inputPlaceholder="Type your answer here..."
          submitButtonText="Ok"
          display={display}
        />
      );
    case "RADIO":
      return (
        <BackendResponseList
          question={question}
          display={display}
          qType="RADIO"
        />
      );
    case "RANGE":
      return display === "mobile" ? (
        <Box
          component="div"
          sx={{
            width: "100%",
            "& > .MuiBox-root": {
              width: "92%",
              boxSizing: "border-box",
              mx: "auto",
              p: 1,
            },
            "& > .MuiBox-root > .MuiBox-root": {
              p: 1,
            },
            "& > .MuiBox-root > .MuiBox-root > .MuiBox-root": {
              gap: 2,
            },
          }}
        >
          <ScaleResponse display={display} />
        </Box>
      ) : (
        <ScaleResponse display={display} />
      );
    case "RANK":
      return (
        <BackendResponseList
          question={question}
          display={display}
          qType="RANK"
        />
      );
    case "TIMED_CHOICE":
      return display === "mobile" ? (
        <TimedChoiceResponseMobilePreview />
      ) : (
        <TimedChoiceResponse qID={qID} display={display} />
      );
    case "WELCOME_SCREEN":
      return <WelcomeResponse question={question} />;
    case "THREE_D": {
      const viewerUrl = question.Model3D?.fileUrl ?? "";
      return display === "mobile" ? (
        <Box
          component="div"
          sx={{
            width: "100%",
            pb: 4,
            boxSizing: "border-box",
            "& > div > div:last-of-type": {
              width: "102% !important",
              ml: "-1%",
              height: "500px !important",
              boxSizing: "border-box",
            },
          }}
        >
          <ThreeDMobileView
            url={viewerUrl}
            display={display}
            showQuestion={false}
          />
        </Box>
      ) : (
        <ThreeDView url={viewerUrl} display={display} showQuestion={false} />
      );
    }
    case "CONSENT":
    case "END_SCREEN":
    default:
      return null;
  }
};

const PreviewResponseRenderer = ({
  question,
  viewport,
}: PreviewResponseRendererProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const selectedQuestion =
      question.type === "THREE_D"
        ? {
            ...question,
            Model3D: { ...question.Model3D, showQuestion: false },
          }
        : question;

    dispatch(setQuestion(selectedQuestion as unknown as Element));
  }, [dispatch, question]);

  return (
    <ReadOnlyResponseBoundary
      hideIconButtons={EDITOR_ICON_TYPES.has(question.type)}
      hideDeleteControls={question.type !== "THREE_D"}
      allowInteraction={
        question.type === "DROPDOWN" || question.type === "THREE_D"
      }
    >
      <ExistingResponse question={question} viewport={viewport} />
    </ReadOnlyResponseBoundary>
  );
};

export default PreviewResponseRenderer;
