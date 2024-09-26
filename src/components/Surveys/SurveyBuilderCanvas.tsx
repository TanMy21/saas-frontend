import { Box } from "@mui/material";
import { QuestionTypeKey, SurveyBuilderCanvasProps } from "../../utils/types";
// import SurveyWelcomeElement from "./Elements/SurveyWelcomeElement";
import { useGetElementByIDQuery } from "../../app/slices/elementApiSlice";
import { elementComponents } from "../../utils/elementsConfig";

const SurveyBuilderCanvas = ({
  questionId,
  //display,
  // handleLayoutChange,
}: SurveyBuilderCanvasProps) => {
  const { data: questions } = useGetElementByIDQuery(questionId ?? "", {
    skip: !questionId,
  });

  const QuestionComponent =
    // firstQuestion
    elementComponents[questions?.type as QuestionTypeKey];
  // : null;

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        margin={"auto"}
        width={"96%"}
        minHeight={"72vh"}
        borderRadius={"12px"}
        bgcolor={"#FFFFFF"}
        mt={"2%"}
        p={2}
        sx={{ transition: "minWidth 1s ease-in-out , opacity 1s ease-in-out" }}
      >
        <Box
          sx={{
            margin: "auto",
            width: "96%",
            height: "100%",
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
              qSettings={questions?.settings}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SurveyBuilderCanvas;
