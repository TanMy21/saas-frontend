import { Suspense } from "react";

import { Box, CircularProgress } from "@mui/material";

import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/typedReduxHooks";
import { elementComponents } from "../../utils/elementComponentRegistry";
import { QuestionTypeKey, SurveyBuilderCanvasProps } from "../../utils/types";
import DevicePreview from "../DevicePreview";

const SurveyBuilderCanvasMobile = ({ display }: SurveyBuilderCanvasProps) => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
    // shallowEqual
  );

  const backgroundColor =
    question?.questionPreferences?.questionBackgroundColor;

  const templateUrl = question?.questionPreferences?.questionImageTemplateUrl;
  const templateImage = question?.questionPreferences?.questionImageTemplate;

  const backgroundImage =
    templateImage && templateUrl ? `url(${templateUrl})` : "none";

  const QuestionComponent =
    elementComponents[question?.type as QuestionTypeKey];

  return (
    <DevicePreview display={display}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: "82vh",
          position: "relative",
          backgroundColor: backgroundColor || "#FFFFFF",
          backgroundImage: backgroundImage || "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          overflow: "hidden",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Box
          sx={{
            margin: "auto",
            width: "96%",
            overflow: "hidden",
            // height: "100%",
          }}
        >
          {/* Element view */}
          {question?.type && QuestionComponent && (
            <Suspense
              fallback={
                <Box
                  sx={{
                    minHeight: 240,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress size={28} />
                </Box>
              }
            >
              <QuestionComponent
                qID={question?.questionID}
                qNO={question?.order?.toString()}
                qText={question?.text}
                qDescription={question?.description}
                qType={question?.type}
                display={display}
                qImage={question?.questionImage}
                showQuestion={
                  question?.showQuestion ?? question?.Model3D?.showQuestion
                }
              />
            </Suspense>
          )}
        </Box>
      </Box>
    </DevicePreview>
  );
};

export default SurveyBuilderCanvasMobile;
