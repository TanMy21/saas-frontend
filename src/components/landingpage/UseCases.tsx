import { useEffect, useRef, useState } from "react";

import { UseCasesProps } from "../../types/landingTypes";
import { useCases } from "../../utils/utils";

/**
 * getScrollViewportHeight
 * Returns the correct viewport height depending on whether the page scrolls on window or a parent div.
 */
function getScrollViewportHeight(scrollParent: HTMLDivElement | null) {
  return scrollParent ? scrollParent.clientHeight : window.innerHeight;
}

/**
 * UseCases
 * Displays one sticky use case area while the active use case changes based on the parent page scroll.
 */
const UseCases = ({ scrollParentRef }: UseCasesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /**
     * handleScroll
     * Reads this section's position inside the parent scroll flow and maps progress to active use case.
     */
    const handleScroll = () => {
      const container = containerRef.current;
      const scrollParent = scrollParentRef?.current ?? null;

      if (!container) return;

      const rect = container.getBoundingClientRect();

      // Uses parent container height if lp-root is the scroll container.
      const viewportHeight = getScrollViewportHeight(scrollParent);

      // Measures how much of this use case section has passed through the viewport.
      const scrollDistance = -rect.top;

      // Prevents division by zero if layout height becomes invalid.
      const scrollableHeight = Math.max(rect.height - viewportHeight, 1);

      if (scrollDistance <= 0) {
        setActiveIndex(0);
        return;
      }

      if (scrollDistance >= scrollableHeight) {
        setActiveIndex(useCases.length - 1);
        return;
      }

      // Converts scroll position into progress from 0 to 1.
      const progress = scrollDistance / scrollableHeight;

      // Converts progress into one of the use case indexes.
      const nextIndex = Math.floor(progress * useCases.length);

      setActiveIndex(Math.min(nextIndex, useCases.length - 1));
    };

    const scrollParent = scrollParentRef?.current ?? null;
    const scrollTarget: HTMLElement | Window = scrollParent ?? window;

    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    // Initializes active item correctly when component mounts.
    handleScroll();

    return () => {
      scrollTarget.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [scrollParentRef]);

  return (
    <section className="uc-page-section">
      <div
        ref={containerRef}
        className="uc-scroll-container"
        style={{
          // Creates enough scroll distance for every use case.
          height: `${useCases.length * 100}vh`,
        }}
      >
        <div className="uc-sticky-wrapper">
          <div className="uc-inner">
            <div className="uc-layout">
              <div className="uc-left-column">
                <div className="uc-static-content">
                  <h2 className="uc-main-title">
                    Built for real-world feedback, not just forms
                  </h2>

                  <p className="uc-main-subtitle">
                    From digital experiences to physical products, understand
                    what people think, do, and feel.
                  </p>
                </div>

                <div className="uc-dynamic-content">
                  {useCases.map((useCase, index) => (
                    <div
                      key={useCase.title}
                      className={`uc-dynamic-item ${
                        activeIndex === index ? "uc-active" : ""
                      }`}
                    >
                      <span className="uc-eyebrow">{useCase.eyebrow}</span>

                      <h3 className="uc-use-case-title">{useCase.title}</h3>

                      <p className="uc-use-case-description">
                        {useCase.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="uc-right-column">
                {useCases.map((useCase, index) => (
                  <div
                    key={useCase.mockupLabel}
                    className={`uc-mockup-panel ${useCase.color} ${
                      activeIndex === index ? "uc-active" : ""
                    }`}
                  >
                    <div className="uc-mockup-content">
                      <div className="uc-mockup-title">
                        {useCase.mockupLabel}
                      </div>

                      <div className="uc-mockup-line" />
                    </div>
                  </div>
                ))}

                <div className="uc-window-dots">
                  <div className="uc-window-dot" />
                  <div className="uc-window-dot" />
                  <div className="uc-window-dot" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
