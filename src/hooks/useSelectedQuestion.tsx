import { useEffect } from "react";

import { resetQuestion, setQuestion } from "../app/slices/elementSlice";
import {
  initializeTypography,
  resetTypography,
} from "../app/slices/elementTypographySlice";
import { AppDispatch } from "../app/store";
import { Element } from "../utils/types";

const useSelectedQuestion = (
  selectedQuestion: Element | null,
  dispatch: AppDispatch,
) => {
  useEffect(() => {
    if (!selectedQuestion) {
      dispatch(resetQuestion());
      dispatch(resetTypography());
      return;
    }

    // Prevent infinite loop
    dispatch(setQuestion(selectedQuestion));
    dispatch(initializeTypography(selectedQuestion.questionPreferences));
  }, [selectedQuestion?.questionID, dispatch]);
};

export default useSelectedQuestion;
