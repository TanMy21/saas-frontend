import { Box } from "@mui/material";
import { useGetElementByIDQuery } from "../../../app/slices/elementApiSlice";
import { elementSettingsComponents } from "../../../utils/elementsConfig";
import {
  QuestionTypeKey,
  SurveyBuilderCanvasProps,
} from "../../../utils/types";

const ElementSettingsContainer = ({
  questionId,
  //display,
  // handleLayoutChange,
}: SurveyBuilderCanvasProps) => {
  const { data: questions } = useGetElementByIDQuery(questionId ?? "", {
    skip: !questionId,
  });

  const ElementSettingsComponent =
    // firstQuestion
    elementSettingsComponents[questions?.type as QuestionTypeKey];
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        sx={{
          margin: "auto",
          width: "96%",
          height: "100%",
        }}
      >
        {/* Element view */}
        {questions?.type && (
          <ElementSettingsComponent
            qID={questions?.questionID}
            qNO={questions?.order?.toString()}
            qText={questions?.text}
            qDescription={questions?.description}
            qType={questions?.type}
          />
        )}
      </Box>
    </Box>
  );
};

export default ElementSettingsContainer;
