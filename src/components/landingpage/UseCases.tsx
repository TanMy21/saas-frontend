import { useEffect, useId, useRef, useState } from "react";

import CustomerResearchImg from "../../assets/customer research.webp";
import MarketingResearchImg from "../../assets/marketing research.webp";
import PhysicalResearchImg from "../../assets/physical product.webp";
import ProductResearchImg from "../../assets/product research.webp";
import { useCases } from "../../data/landingPageData";
import type { UseCasesProps } from "../../types/landingTypes";

const useCaseImages = [
  {
    src: CustomerResearchImg,
    alt: "Customer research interview in a bright modern workspace",
  },
  {
    src: ProductResearchImg,
    alt: "Product team reviewing a prototype and sketches",
  },
  {
    src: MarketingResearchImg,
    alt: "Marketing team discussing audience research",
  },
  {
    src: PhysicalResearchImg,
    alt: "Physical product presented for feedback",
  },
];

const UseCases = ({ scrollParentRef }: UseCasesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const lastInteractionRef = useRef(0);
  const sectionId = useId();

  // Change the expanded item as the user scrolls through the sticky section.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const scrollParent = scrollParentRef?.current ?? null;
    const scrollTarget: HTMLElement | Window =
      scrollParent ?? window;

    const updateFromScroll = () => {
      // The stacked mobile layout does not use scroll stages.
      if (window.matchMedia("(max-width: 800px)").matches) return;

      const viewportHeight = scrollParent
        ? scrollParent.clientHeight
        : window.innerHeight;

      const viewportTop = scrollParent
        ? scrollParent.getBoundingClientRect().top
        : 0;

      const trackRect = track.getBoundingClientRect();
      const scrollableDistance = Math.max(
        trackRect.height - viewportHeight,
        1,
      );

      const progress = Math.min(
        Math.max(
          (viewportTop - trackRect.top) / scrollableDistance,
          0,
        ),
        1,
      );

      const nextIndex = Math.min(
        Math.floor(progress * useCases.length),
        useCases.length - 1,
      );

      lastInteractionRef.current = Date.now();
      setActiveIndex(nextIndex);
    };

    scrollTarget.addEventListener("scroll", updateFromScroll, {
      passive: true,
    });
    window.addEventListener("resize", updateFromScroll);
    updateFromScroll();

    return () => {
      scrollTarget.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
    };
  }, [scrollParentRef]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      {
        root: scrollParentRef?.current ?? null,
        threshold: 0.15,
      },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [scrollParentRef]);

  // Auto-expand while visible, allowing time after a click or scroll.
  useEffect(() => {
    if (!isInView) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      // Pause while someone navigates the list with a keyboard.
      if (sectionRef.current?.querySelector(":focus-visible")) {
        return;
      }

      if (Date.now() - lastInteractionRef.current < 5500) {
        return;
      }

      setActiveIndex((current) => (current + 1) % useCases.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [isInView]);

  return (
    <div ref={trackRef} className="uc-scroll-track">
      <section
        ref={sectionRef}
        className="uc-section"
        aria-labelledby={`${sectionId}-heading`}
      >
        <div className="uc-inner">
          <div className="uc-heading">
            <h2 id={`${sectionId}-heading`}>
              Feedback for every
              <br />
              kind of decision
            </h2>
          </div>

          <div className="uc-layout">
            <div className="uc-list">
              {useCases.map((useCase, index) => {
                const isActive = activeIndex === index;
                const panelId = `${sectionId}-panel-${index}`;

                return (
                  <div
                    key={useCase.title}
                    className={`uc-item ${
                      isActive ? "uc-active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="uc-item-trigger"
                      onClick={() => {
                        lastInteractionRef.current = Date.now();
                        setActiveIndex(index);
                      }}
                      aria-expanded={isActive}
                      aria-controls={panelId}
                    >
                      <span>{useCase.title}</span>
                      <span
                        className="uc-item-indicator"
                        aria-hidden="true"
                      />
                    </button>

                    <div
                      id={panelId}
                      className="uc-item-panel"
                      hidden={!isActive}
                    >
                      <p>{useCase.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="uc-visual" aria-label="Use case imagery">
              {useCaseImages.map((image, index) => (
                <div
                  key={image.src}
                  className={`uc-image-layer ${
                    activeIndex === index ? "uc-active" : ""
                  }`}
                  aria-hidden={activeIndex !== index}
                >
                  <img
                    src={image.src}
                    alt={activeIndex === index ? image.alt : ""}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UseCases;