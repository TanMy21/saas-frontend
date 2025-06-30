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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "300px",
        height: { md: "520px", xl: "700px" },
        border: "3px solid #E0E0E0",
        borderRadius: "24px",
        mt: "1%",
        mb: "2%",
        bgcolor: "#FFFFFF",
        boxShadow: " 0 4px 20px rgba(0, 0, 0, 0.08)",
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
      <Box
        sx={{
          margin: "auto",
          width: "96%",
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
  );
};

export default SurveyBuilderCanvasMobile;
