import { useCallback, useRef, useState } from "react";

import { EditControllerParams, EditTarget } from "../utils/types";
import { normalize } from "../utils/utils";

export function useEditController({
  questionID,
  text,
  description,
  updateElementText,
  updateElementDescription,
}: EditControllerParams) {
  const [editingTarget, setEditingTarget] = useState<EditTarget>("none");

  const initialRef = useRef<{ title: string; description: string }>({
    title: "",
    description: "",
  });

  const beginEdit = useCallback(
    (target: EditTarget) => {
      if (target === "none") return;
      initialRef.current = {
        title: normalize(text),
        description: normalize(description),
      };
      setEditingTarget(target);
    },
    [text, description]
  );

  const saveTitleIfChanged = useCallback(() => {
    if (!questionID) return;
    const next = normalize(text) || "Untitled";
    const prev = normalize(initialRef.current.title);
    if (next !== prev) updateElementText({ questionID, text: next });
  }, [questionID, text, updateElementText]);

  const saveDescriptionIfChanged = useCallback(() => {
    if (!questionID) return;
    const next = normalize(description);
    const prev = normalize(initialRef.current.description);
    if (next !== prev)
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
