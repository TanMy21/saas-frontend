import { Box } from "@mui/material";

import { elementSettingsComponents } from "../../../utils/elementsConfig";
import {
  ElementSettingsContainerProps,
  QuestionTypeKey,
} from "../../../utils/types";

const ElementSettingsContainer = ({
  questionId,
  question,
}: ElementSettingsContainerProps) => {
  // const { options } = question || {};

  const ElementSettingsComponent =
    // firstQuestion
    elementSettingsComponents[question?.type as QuestionTypeKey];
  return (
    <>
      {/* Element view */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          left: "0%",
          m: 0,
          p: 0,
          boxSizing: "border-box",
          // border: "2px solid blue",
        }}
      >
        {question?.type && (
          <ElementSettingsComponent qID={questionId!} question={question} />
        )}
      </Box>
    </>
  );
};

export default ElementSettingsContainer;
