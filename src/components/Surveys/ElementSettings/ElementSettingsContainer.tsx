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
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        sx={{
          margin: "auto",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Element view */}
        {question?.type && (
          <ElementSettingsComponent qID={questionId!} question={question} />
        )}
      </Box>
    </Box>
  );
};

export default ElementSettingsContainer;
