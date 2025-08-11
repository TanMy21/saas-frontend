import { useCallback, useRef } from "react";

import { updateElementField } from "../app/slices/surveySlice";

const DEBOUNCE_MS = 220;

export function useDebouncedElementDispatch(
  dispatch: any,
  questionID?: string
) {
  const titleTimerRef = useRef<number | null>(null);
  const descTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (titleTimerRef.current) window.clearTimeout(titleTimerRef.current);
    if (descTimerRef.current) window.clearTimeout(descTimerRef.current);
    titleTimerRef.current = null;
    descTimerRef.current = null;
  }, []);

  const debouncedUpdate = useCallback(
    (key: "text" | "description", value: string) => {
      if (!questionID) return;
      const ref = key === "text" ? titleTimerRef : descTimerRef;
      if (ref.current) window.clearTimeout(ref.current);
      ref.current = window.setTimeout(() => {
        dispatch(updateElementField({ questionID, key, value }));
      }, DEBOUNCE_MS) as unknown as number;
    },
    [dispatch, questionID]
  );

  return { debouncedUpdate, clearTimers };
}
