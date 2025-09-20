import { useEffect } from "react";

export function useOutsideSave(
  active: boolean,
  rootRef: React.RefObject<HTMLElement>,
  onSaveBoth: () => void
) {
  useEffect(() => {
    if (!active) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current) return;
      const clickedInside = rootRef.current.contains(e.target as Node);
      if (!clickedInside) onSaveBoth();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [active, rootRef, onSaveBoth]);
}
