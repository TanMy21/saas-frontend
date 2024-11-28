import { Box } from "@mui/material";

import { useGetElementByIDQuery } from "../../../app/slices/elementApiSlice";
import { useGetOptionsOfQuestionQuery } from "../../../app/slices/optionApiSlice";
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

  const { data: options } = useGetOptionsOfQuestionQuery(questionId ?? "", {
    skip: !questionId,
  });

  // console.log("Container: ",options);

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
            qOptions={options}
            qRequired={questions?.required}
            qSettings = {questions?.settings}
          />
        )}
      </Box>
    </Box>
  );
};

export default ElementSettingsContainer;
