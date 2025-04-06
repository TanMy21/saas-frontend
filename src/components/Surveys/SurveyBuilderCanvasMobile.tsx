import { Box } from "@mui/material";

import { useGetElementByIDQuery } from "../../app/slices/elementApiSlice";
import { elementComponents } from "../../utils/elementsConfig";
import { QuestionTypeKey, SurveyBuilderCanvasProps } from "../../utils/types";

const SurveyBuilderCanvasMobile = ({
  questionId,
  display,
  // handleLayoutChange,
}: SurveyBuilderCanvasProps) => {
  const { data: questions } = useGetElementByIDQuery(questionId, {
    skip: !questionId,
  });

  // useEffect(() => {
  //   if (questions && questions.length > 0) {
  //     setSelectedQuestion(questions[0]);
  //   }
  // }, [questions]);

  const QuestionComponent =
    /*selectedQuestion*/
    /*?*/ elementComponents[questions?.type as QuestionTypeKey];
  // : SurveyWelcomeElement;

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          border: "3px solid #E0E0E0",
          borderRadius: "12px",
          mt: "2%",
          mb: "2%",
          pt: "8%",
          pl: "1%",
          pr: "1%",
          bgcolor: "#FAF9F5",
          width: "300px",
          minHeight: { lg: "480px", xl: "600px" },
          transition: "minWidth 1s ease-in-out, opacity 1s ease-in-out",
        }}
      >
        {/* Element view */}
        {questions?.type && (
          <QuestionComponent
            qID={questions?.questionID}
            qNO={questions?.order?.toString()}
            qText={questions?.text}
            qDescription={questions?.description}
            qType={questions?.type}
            display={display}
            qSettings={questions?.settings}
          />
        )}
      </Box>
    </Box>
  );
};

export default SurveyBuilderCanvasMobile;
