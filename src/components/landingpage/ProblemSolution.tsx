import { useEffect, useId, useRef, useState } from "react";

import { ChevronRight } from "lucide-react";

import threeDImg from "../../assets/problem solution 3d.webp";
import behaviorImg from "../../assets/problem solution behavior.webp";
import intentImg from "../../assets/problem solution intent.webp";

const items = [
  {
    problem: "Hidden friction",
    problemDescription: "Users hesitate, scroll, and change answers — unseen.",
    solution: "Intent-aware feedback",
    solutionDescription:
      "Connect responses with behavior to understand real intent.",
    image: intentImg,
    imageAlt: "A short response surrounded by interaction context",
  },
  {
    problem: "Surface-level responses",
    problemDescription: "You get the responses, not the reason behind it.",
    solution: "Behavioral insights",
    solutionDescription:
      "Spot uncertainty, confusion, and confidence in interactions.",
    image: behaviorImg,
    imageAlt:
      "Behavioral signals including hesitation, reconsideration, and engagement",
  },
  {
    problem: "Flat product feedback",
    problemDescription:
      "Images and text fall short for visual or physical products.",
    solution: "3D product feedback",
    solutionDescription:
      "Let users explore products naturally before responding.",
    image: threeDImg,
    imageAlt: "A 3D product with feedback controls",
  },
];

const ProblemSolution = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const lastInteractionRef = useRef(0);

  const sectionId = useId();
  const solutionId = `${sectionId}-solution`;
  const activeItem = items[activeIndex];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setReducedMotion(preference.matches);
    };

    updatePreference();
    preference.addEventListener("change", updatePreference);

    return () => {
      preference.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const scrollParent = track.closest<HTMLElement>(".lp-root");
    const scrollTarget: HTMLElement | Window = scrollParent ?? window;

    const updateFromScroll = () => {
      if (window.matchMedia("(max-width: 900px)").matches) return;

      const viewportHeight = scrollParent
        ? scrollParent.clientHeight
        : window.innerHeight;

      const viewportTop = scrollParent
        ? scrollParent.getBoundingClientRect().top
        : 0;

      const trackRect = track.getBoundingClientRect();
      const scrollableDistance = Math.max(trackRect.height - viewportHeight, 1);

      const progress = Math.min(
        Math.max((viewportTop - trackRect.top) / scrollableDistance, 0),
        1,
      );

      const nextIndex = Math.min(
        Math.floor(progress * items.length),
        items.length - 1,
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
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const scrollParent = section.closest<HTMLElement>(".lp-root");

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      {
        root: scrollParent,
        threshold: 0.15,
      },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || reducedMotion) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;

      if (sectionRef.current?.querySelector(":focus-visible")) {
        return;
      }

      if (Date.now() - lastInteractionRef.current < 5500) {
        return;
      }

      setActiveIndex((current) => (current + 1) % items.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [isInView, reducedMotion]);

  return (
    <div ref={trackRef} className="ps-scroll-track">
      <section
        ref={sectionRef}
        className="ps-section"
        aria-labelledby={`${sectionId}-heading`}
      >
        <div className="ps-heading">
          <h2 id={`${sectionId}-heading`}>
            Plenty of responses.
            <br />
            Still missing the full picture.
          </h2>
        </div>

        <div className="ps-container">
          <div className="ps-problems">
            <div className="ps-problem-list">
              {items.map((item, index) => {
                const isActive = activeIndex === index;

                return (
                  <button
                    key={item.problem}
                    type="button"
                    className={`ps-problem ${isActive ? "is-active" : ""}`}
                    onClick={() => {
                      lastInteractionRef.current = Date.now();
                      setActiveIndex(index);
                    }}
                    aria-pressed={isActive}
                    aria-controls={solutionId}
                  >
                    {!isActive && (
                      <ChevronRight
                        className="ps-problem-chevron"
                        size={34}
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    )}

                    <span className="ps-problem-copy">
                      <span className="ps-problem-title">{item.problem}</span>

                      {isActive && (
                        <span className="ps-problem-desc">
                          {item.problemDescription}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id={solutionId}
            className="ps-solution"
            role="region"
            aria-labelledby={`${sectionId}-solution-heading`}
          >
            <div key={activeIndex} className="ps-solution-content">
              <p className="ps-solution-kicker">Solution</p>

              <h3 id={`${sectionId}-solution-heading`}>
                {activeItem.solution}
              </h3>

              <p className="ps-solution-description">
                {activeItem.solutionDescription}
              </p>

              <div className="ps-solution-media">
                <img
                  src={activeItem.image}
                  alt={activeItem.imageAlt}
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProblemSolution;
