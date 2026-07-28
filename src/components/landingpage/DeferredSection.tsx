import {
  CSSProperties,
  ReactNode,
  RefObject,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

interface DeferredSectionProps {
  children: ReactNode;
  minHeight: CSSProperties["minHeight"];
  rootRef?: RefObject<Element | null>;
  rootMargin?: string;
}

/**
 * Reserves the section's layout space and mounts its lazy content shortly
 * before the user reaches it.
 */
const DeferredSection = ({
  children,
  minHeight,
  rootRef,
  rootMargin = "800px 0px",
}: DeferredSectionProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const trigger = triggerRef.current;

    if (!trigger) return;

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setShouldRender(true);
        observer.disconnect();
      },
      {
        root: rootRef?.current ?? null,
        rootMargin,
      },
    );

    observer.observe(trigger);

    return () => observer.disconnect();
  }, [rootMargin, rootRef]);

  return (
    <div
      ref={triggerRef}
      style={{ minHeight }}
      aria-hidden={shouldRender ? undefined : true}
    >
      {shouldRender && <Suspense fallback={null}>{children}</Suspense>}
    </div>
  );
};

export default DeferredSection;
