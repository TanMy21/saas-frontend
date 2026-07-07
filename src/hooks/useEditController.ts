import { useCallback, useRef, useState } from "react";

import { SOFT_EDIT_MESSAGES } from "../utils/constants";
import { normalizeHtml } from "../utils/richTextUtils";
import { EditControllerParams, EditTarget } from "../utils/types";

import { useSurveyEditLock } from "./useSurveyEditLock";

export function useEditController({
  questionID,
  text,
  description,
  updateElementText,
  updateElementDescription,
}: EditControllerParams) {
  const [editingTarget, setEditingTarget] = useState<EditTarget>("none");

  const { confirmSoftEdit } = useSurveyEditLock();

  const initialRef = useRef<{ title: string; description: string }>({
    title: "",
    description: "",
  });

  const beginEdit = useCallback(
    (target: EditTarget) => {
      if (target === "none") return;
      initialRef.current = {
        title: normalizeHtml(text),
        description: normalizeHtml(description),
      };
      setEditingTarget(target);
    },
    [text, description],
  );

  const saveTitleIfChanged = useCallback(async () => {
    if (!questionID) return;

    const next = normalizeHtml(text) || "Untitled";
    const prev = normalizeHtml(initialRef.current.title);
    if (next === prev) return;
    if (!(await confirmSoftEdit(SOFT_EDIT_MESSAGES.QUESTION_WORDING))) return;

    updateElementText({ questionID, text: next });
  }, [questionID, text, updateElementText]);

  const saveDescriptionIfChanged = useCallback(async () => {
    if (!questionID) return;

    const next = normalizeHtml(description);
    const prev = normalizeHtml(initialRef.current.description);
    if (next === prev) return;
    if (!(await confirmSoftEdit(SOFT_EDIT_MESSAGES.QUESTION_DESCRIPTION)))
      return;

    updateElementDescription({ questionID, description: next });
  }, [questionID, description, updateElementDescription]);

  const endEdit = useCallback(() => setEditingTarget("none"), []);

  return {
    editingTarget,
    beginEdit,
    endEdit,
    saveTitleIfChanged,
    saveDescriptionIfChanged,
  };
}
