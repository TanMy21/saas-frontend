import { useEffect } from "react";

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
      dispatch(resetTypography());
      return;
    }

    dispatch(initializeTypography(selectedQuestion.questionPreferences));
  }, [selectedQuestion?.questionID, dispatch]);
};

export default useSelectedQuestion;
