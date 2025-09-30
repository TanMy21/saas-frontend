import { useRef } from "react";

import { Box } from "@mui/material";

import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/typedReduxHooks";
import { elementComponents } from "../../utils/elementsConfig";
import { QuestionTypeKey, SurveyBuilderCanvasProps } from "../../utils/types";
import DevicePreview from "../DevicePreview";

const SurveyBuilderCanvasMobile = ({ display }: SurveyBuilderCanvasProps) => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion
    // shallowEqual
  );
  const canvasRef = useRef<HTMLDivElement | null>(null);
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
          // margin: "auto",
          width: "100%",
          minHeight: "82vh",
          // border: "3px solid #E0E0E0",
          // borderRadius: "24px",
          // mt: "1%",
          // mb: "2%",
          // bgcolor: "#FFFFFF",
          // boxShadow: " 0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "minWidth 1s ease-in-out, opacity 1s ease-in-out",
          position: "relative",
          border: "2px solid blue",
          backgroundColor: backgroundColor || "#FFFFFF",
          backgroundImage: backgroundImage || "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          overflow: "hidden",
          // overflowY: "scroll",
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
          {question?.type && (
            <QuestionComponent
              qID={question?.questionID}
              qNO={question?.order?.toString()}
              qText={question?.text}
              qDescription={question?.description}
              qType={question?.type}
              display={display}
              qImage={question?.questionImage}
            />
          )}
        </Box>
      </Box>
    </DevicePreview>
  );
};

export default SurveyBuilderCanvasMobile;
