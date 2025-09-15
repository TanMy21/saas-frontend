import { useEffect, useRef } from "react";

import { SurveyCollectionsScrollNavProps } from "../utils/types";

export function useWheelPageNav({
  containerRef,
  enabled,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  cooldownMs = 600,
  wheelThreshold = 100,
  touchThreshold = 48,
}: SurveyCollectionsScrollNavProps) {
  const accumRef = useRef(0);
  const lastFiredRef = useRef(0);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    const now = () => performance.now();
    const onCooldown = () => now() - lastFiredRef.current < cooldownMs;

    const isInputLike = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        tag === "button"
      )
        return true;
      if (target.isContentEditable) return true;
      if (target.closest("[data-ignore-pager], [data-ignore-scrollnav]"))
        return true;
      return false;
    };

    const fire = (dir: "next" | "prev") => {
      lastFiredRef.current = now();
      if (dir === "next" && canGoNext) onNext();
      if (dir === "prev" && canGoPrev) onPrev();
    };

    const onWheel = (e: WheelEvent) => {
      if (!enabled) return;
      if (onCooldown()) return;
      if (isInputLike(e.target)) return;

      e.preventDefault();

      accumRef.current += e.deltaY;
      if (Math.abs(accumRef.current) >= wheelThreshold) {
        const dir = accumRef.current > 0 ? "next" : "prev";
        accumRef.current = 0;
        fire(dir);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!enabled) return;
      if (isInputLike(e.target)) return;
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!enabled) return;
      if (onCooldown()) return;
      if (isInputLike(e.target)) return;
      if (touchStartY.current == null) return;

      const y = e.touches[0]?.clientY ?? touchStartY.current;
      const dy = touchStartY.current - y;

      // Prevent native scroll
      e.preventDefault();

      if (Math.abs(dy) >= touchThreshold) {
        const dir = dy > 0 ? "next" : "prev";
        touchStartY.current = y; // reset baseline to avoid double-trigger
        fire(dir);
      }
    };

    // Use passive: false so preventDefault works
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel as any);
      el.removeEventListener("touchstart", onTouchStart as any);
      el.removeEventListener("touchmove", onTouchMove as any);
    };
  }, [
    containerRef,
    enabled,
    canGoPrev,
    canGoNext,
    onPrev,
    onNext,
    cooldownMs,
    wheelThreshold,
    touchThreshold,
  ]);
}
