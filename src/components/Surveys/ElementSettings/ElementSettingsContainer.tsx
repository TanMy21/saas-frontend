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
      {question?.type && (
        <ElementSettingsComponent qID={questionId!} question={question} />
      )}
    </>
  );
};

export default ElementSettingsContainer;
