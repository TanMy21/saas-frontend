import { Box } from "@mui/material";

import { elementComponents } from "../../utils/elementsConfig";
import { QuestionTypeKey, SurveyBuilderCanvasProps } from "../../utils/types";

const SurveyBuilderCanvas = ({
  display,
  question,
}: SurveyBuilderCanvasProps) => {
  const QuestionComponent =
    elementComponents[question?.type as QuestionTypeKey];

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          width: "96%",
          minHeight: "72vh",
          borderRadius: "12px",
          bgcolor: "#FAF9F5",
          border: "3px solid #E0E0E0",
          mt: "2%",
          mb: "2%",
          p: 2,
          transition: "minWidth 1s ease-in-out , opacity 1s ease-in-out",
        }}
      >
        <Box
          sx={{
            margin: "auto",
            width: "96%",
            height: "100%",
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
              qSettings={question?.config}
              display={display}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SurveyBuilderCanvas;
