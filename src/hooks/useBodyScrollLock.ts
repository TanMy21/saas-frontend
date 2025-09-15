import { useEffect } from "react";

export function useBodyScrollLock(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // current scroll
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // scrollbar width
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const { style } = document.body;

    // previous inline styles
    const prev = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
      overflowY: style.overflowY,
      paddingRight: style.paddingRight,
    };

    // Lock: "freeze" the body
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    style.overflowY = "hidden";
    // Prevent content jump when scrollbar disappears
    if (scrollbarWidth > 0) {
      style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      // Unlock: restore styles and scroll
      style.position = prev.position;
      style.top = prev.top;
      style.left = prev.left;
      style.right = prev.right;
      style.width = prev.width;
      style.overflowY = prev.overflowY;
      style.paddingRight = prev.paddingRight;

      // Restore scroll position
      const y = Math.abs(parseInt(prev.top || "0", 10)) || scrollY;
      window.scrollTo(0, y);
    };
  }, [enabled]);
}
