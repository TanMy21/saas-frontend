import { useEffect } from "react";

import { setSelectedQuestionId } from "../app/slices/elementSlice";
import { AppDispatch } from "../app/store";
import { Element } from "../utils/types";

const useSortElements = (
  elements: Element[],
  selectedQuestionId: string | null,
  dispatch: AppDispatch,
) => {
  useEffect(() => {
    if (!elements?.length) return;

    const sorted = [...elements].sort((a, b) => a.order! - b.order!);
    const defaultId = sorted[0].questionID;

    const exists = sorted.find((q) => q.questionID === selectedQuestionId);

    if (!exists) {
      dispatch(setSelectedQuestionId(defaultId));
    }
  }, [elements, selectedQuestionId, dispatch]);
};
export default useSortElements;
