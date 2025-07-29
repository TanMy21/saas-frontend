import { useEffect } from "react";

import { setElements } from "../app/slices/surveySlice";
import { useAppDispatch } from "../app/typedReduxHooks";
import { Element } from "../utils/types";

const useSyncQuestionsToElements = (questions: Element[]) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (questions.length > 0) {
      dispatch(setElements(questions));
    }
  }, [questions]);
};

export default useSyncQuestionsToElements;
