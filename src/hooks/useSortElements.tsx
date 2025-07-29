import { useEffect } from "react";

import { Element } from "../utils/types";

const useSortElements = (
  elements: Element[],
  setQuestionId: (id: string) => void,
  currentId: string | null
) => {
  useEffect(() => {
    if (!elements?.length) return;
    const sorted = [...elements].sort((a, b) => a.order! - b.order!);
    const defaultId = sorted[0].questionID;
    const exists = sorted.find((q) => q.questionID === currentId);
    if (!exists) setQuestionId(defaultId);
  }, [elements]);
};

export default useSortElements;
