import { useCallback, useEffect, useState } from "react";

import { LayoutMode } from "../../../utils/types";

export function useLayoutMode(surveyID?: string) {
  const storageKey = surveyID ? `flow:layout:${surveyID}` : "flow:layout";
  const [layout, setLayout] = useState<LayoutMode>(() => {
    return (localStorage.getItem(storageKey) as LayoutMode) || "sugiyama";
  });

  useEffect(() => {
    localStorage.setItem(storageKey, layout);
  }, [layout, storageKey]);

  const set = useCallback((m: LayoutMode) => setLayout(m), []);
  return { layout, setLayout: set };
}
