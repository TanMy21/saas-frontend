import { Box } from "@mui/material";
import { shallowEqual } from "react-redux";

import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/typedReduxHooks";
import { elementComponents } from "../../utils/elementsConfig";
import { QuestionTypeKey, SurveyBuilderCanvasProps } from "../../utils/types";

const SurveyBuilderCanvasMobile = ({ display }: SurveyBuilderCanvasProps) => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
    shallowEqual
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
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          border: "3px solid #E0E0E0",
          borderRadius: "24px",
          mt: "2%",
          mb: "2%",
          pt: "8%",
          // pl: "1%",
          // pr: "1%",
          bgcolor: "#FFFFFF",
          width: "300px",
          boxShadow: " 0 4px 20px rgba(0, 0, 0, 0.08)",
          height: { lg: "480px", xl: "600px" },
          transition: "minWidth 1s ease-in-out, opacity 1s ease-in-out",
          position: "relative",
          backgroundColor: backgroundColor,
          backgroundImage: backgroundImage,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          overflowX: "hidden",
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
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
  );
};

export default SurveyBuilderCanvasMobile;
