import { Box } from "@mui/material";

import { elementComponents } from "../../utils/elementsConfig";
import { QuestionTypeKey, SurveyBuilderCanvasProps } from "../../utils/types";

const SurveyBuilderCanvasMobile = ({
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
        {question?.type && (
          <QuestionComponent
            qID={question?.questionID}
            qNO={question?.order?.toString()}
            qText={question?.text}
            qDescription={question?.description}
            qType={question?.type}
            display={display}
            qSettings={question?.config}
          />
        )}
      </Box>
    </Box>
  );
};

export default SurveyBuilderCanvasMobile;
