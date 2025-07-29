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
  dispatch: AppDispatch
) => {
  useEffect(() => {
    if (selectedQuestion) {
      dispatch(setQuestion(selectedQuestion));
      dispatch(initializeTypography(selectedQuestion?.questionPreferences));
    } else {
      dispatch(resetQuestion());
      dispatch(resetTypography());
    }
  }, [selectedQuestion?.questionID]);
};

export default useSelectedQuestion;
