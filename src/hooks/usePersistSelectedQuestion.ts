import { useEffect, useMemo, useState } from "react";

type HasQuestionID = { questionID: string };

export function usePersistedSelectedQuestion<T extends HasQuestionID>(
  surveyID: string | undefined,
  elements: T[]
) {

  const storageKey = useMemo(
    () => (surveyID ? `sq:${surveyID}` : null),
    [surveyID]
  );

  const [questionId, setQuestionId] = useState<string | null>(null);

  // Keep just the IDs to make deps cheap & stable
  const ids = useMemo(() => elements.map((e) => e.questionID), [elements]);

  // Initialize / re-validate whenever survey or elements change
  useEffect(() => {
    if (!storageKey) return;

    const saved = localStorage.getItem(storageKey);
    const hasSaved = saved && ids.includes(saved);

    if (hasSaved) {
      // ✅ Saved selection is still valid for current elements
      setQuestionId(saved);
    } else if (ids.length > 0) {
      // ✅ Default to first question when:
      // - nothing saved yet, or
      // - saved id no longer exists (deleted/reordered/duplicated survey)
      setQuestionId(ids[0]);
      localStorage.setItem(storageKey, ids[0]);
    } else {
      // ✅ No elements at all
      setQuestionId(null);
      localStorage.removeItem(storageKey);
    }
  }, [storageKey, ids.join("|")]);

  // Persist whenever user changes selection
  useEffect(() => {
    if (!storageKey) return;
    if (questionId) {
      localStorage.setItem(storageKey, questionId);
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey, questionId]);

  return { questionId, setQuestionId };
}
