import { useEffect, useRef, useState } from "react";

import CustomerResearchImg from "../../assets/customer research.webp";
import MarketingResearchImg from "../../assets/marketing research.webp";
import PhysicalResearchImg from "../../assets/physical product.webp";
import ProductResearchImg from "../../assets/product research.webp";
import { UseCasesProps } from "../../types/landingTypes";
import { useCases } from "../../utils/utils";

function getScrollViewportHeight(scrollParent: HTMLDivElement | null) {
  return scrollParent ? scrollParent.clientHeight : window.innerHeight;
}

const useCaseImages = [
  {
    src: CustomerResearchImg,
    alt: "Customer research interview in a bright modern workspace",
  },
  {
    src: ProductResearchImg,
    alt: "Product team reviewing a physical product prototype and sketches",
  },
  {
    src: MarketingResearchImg,
    alt: "Marketing team discussing audience research on a strategy board",
  },
  {
    src: PhysicalResearchImg,
    alt: "Premium perfume bottle used for physical product feedback",
  },
];

const UseCases = ({ scrollParentRef }: UseCasesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /**
     * handleScroll
     * Calculates scroll progress inside the UseCases section and maps it to the active use case index.
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
          // Creates enough scroll distance for every use case on desktop/tablet.
          height: `${useCases.length * 100}vh`,
        }}
      >
        <div className="uc-sticky-wrapper">
          <div className="uc-inner">
            <div className="uc-layout">
              <div className="uc-left-column">
                <div className="uc-static-content">
                  <h2 className="uc-main-title">
                    Feedback for every kind of decision
                  </h2>

                  <p className="uc-main-subtitle">
                    Capture the signals behind every response and turn them into
                    clearer direction.
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
                      <h3 className="uc-use-case-title">{useCase.title}</h3>

                      <p className="uc-use-case-description">
                        {useCase.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="uc-right-column">
                {useCases.map((useCase, index) => {
                  const image = useCaseImages[index];

                  return (
                    <div
                      key={useCase.mockupLabel}
                      className={`uc-image-panel ${
                        activeIndex === index ? "uc-active" : ""
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="uc-use-case-image"
                        loading="lazy"
                        decoding="async"
                      />

                      <div className="uc-image-overlay">
                        <span>{useCase.mockupLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="uc-progress" aria-hidden="true">
                {useCases.map((useCase, index) => (
                  <div
                    key={useCase.title}
                    className={`uc-progress-dot ${
                      activeIndex === index ? "uc-active" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default UseCases;
