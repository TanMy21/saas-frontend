import { useEffect, useRef, useState } from "react";

import { FeatureItem, FeaturesProps } from "../../types/landingTypes";
import { features } from "../../utils/utils";

/**
 * getScrollViewportHeight
 * Returns the correct viewport height for either parent-container scroll or normal window scroll.
 */
function getScrollViewportHeight(scrollParent: HTMLDivElement | null) {
  return scrollParent ? scrollParent.clientHeight : window.innerHeight;
}

/**
 * formatMultilineTitle
 * Converts "\n" in feature titles into line breaks for clean headline layout.
 */
function formatMultilineTitle(title: string) {
  return title.split("\n").map((line) => (
    <span key={line}>
      {line}
      <br />
    </span>
  ));
}

/**
 * FeatureMockup
 * Right-side placeholder mockup for the active feature.
 * Later you can replace this with real dashboard/survey/3D UI.
 */
function FeatureMockup({ feature }: { feature: FeatureItem }) {
  const Icon = feature.icon;

  return (
    <div className={`feature-mockup-panel ${feature.color}`}>
      <div className="feature-mockup-dots">
        <span />
        <span />
        <span />
      </div>

      <div className="feature-mockup-card">
        <div className="feature-mockup-icon">
          <Icon size={32} />
        </div>

        <div className="feature-mockup-step">Step {feature.step}</div>

        <div className="feature-mockup-title">{feature.label}</div>

        <div className="feature-mockup-line" />
      </div>
    </div>
  );
}

/**
 * Features
 * Sticky scroll-driven feature section.
 * Active feature changes based on parent page scroll, similar to the UseCases section.
 */
const Features = ({ scrollParentRef }: FeaturesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /**
     * handleScroll
     * Calculates scroll progress inside the Features section and maps it to the active feature index.
     */
    const handleScroll = () => {
      const container = containerRef.current;
      const scrollParent = scrollParentRef?.current ?? null;

      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = getScrollViewportHeight(scrollParent);

      // How much of this section has moved past the top of the viewport.
      const scrollDistance = -rect.top;

      // Total scroll distance available after one sticky viewport is removed.
      const scrollableHeight = Math.max(rect.height - viewportHeight, 1);

      if (scrollDistance <= 0) {
        setActiveIndex(0);
        return;
      }

      if (scrollDistance >= scrollableHeight) {
        setActiveIndex(features.length - 1);
        return;
      }

      // Converts current scroll position into progress between 0 and 1.
      const progress = scrollDistance / scrollableHeight;

      // Converts progress into the active feature index.
      const nextIndex = Math.floor(progress * features.length);

      setActiveIndex(Math.min(nextIndex, features.length - 1));
    };

    const scrollParent = scrollParentRef?.current ?? null;
    const scrollTarget: HTMLElement | Window = scrollParent ?? window;

    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    // Initializes correct active feature on mount.
    handleScroll();

    return () => {
      scrollTarget.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [scrollParentRef]);

  return (
    <section className="feature-scroll-section">
      <div
        ref={containerRef}
        className="feature-scroll-container"
        style={{
          // One viewport of scroll distance for each feature.
          height: `${features.length * 100}vh`,
        }}
      >
        <div className="feature-sticky-wrapper">
          <div className="feature-inner">
            <div className="feature-layout">
              <div className="feature-left-column">
                <div className="feature-static-content">
                  <h2 className="feature-main-title">
                    Everything you need to collect smarter feedback
                  </h2>

                  <p className="feature-main-subtitle">
                    Create interactive surveys, capture richer responses, track
                    behavior, and turn feedback into decisions.
                  </p>
                </div>

                <div className="feature-dynamic-content">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;

                    return (
                      <div
                        key={feature.key}
                        className={`feature-dynamic-item ${
                          activeIndex === index ? "feature-active" : ""
                        }`}
                      >
                        <div className="feature-step-row">
                          <div className={`feature-step-icon ${feature.color}`}>
                            <Icon size={20} />
                          </div>

                          <span className="feature-step-text">
                            {feature.step} / {feature.label}
                          </span>
                        </div>

                        <h3 className="feature-title">
                          {formatMultilineTitle(feature.title)}
                        </h3>

                        <p className="feature-description">
                          {feature.description}
                        </p>

                        <div className="feature-bullets">
                          {feature.bullets.map((bullet) => {
                            const BulletIcon = bullet.icon;

                            return (
                              <div
                                key={bullet.title}
                                className="feature-bullet-item"
                              >
                                <div className="feature-bullet-icon">
                                  <BulletIcon size={18} />
                                </div>

                                <div>
                                  <div className="feature-bullet-title">
                                    {bullet.title}
                                  </div>

                                  <div className="feature-bullet-desc">
                                    {bullet.desc}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="feature-right-column">
                {features.map((feature, index) => (
                  <div
                    key={feature.key}
                    className={`feature-mockup-layer ${
                      activeIndex === index ? "feature-active" : ""
                    }`}
                  >
                    <FeatureMockup feature={feature} />
                  </div>
                ))}
              </div>
            </div>

            <div className="feature-progress">
              {features.map((feature, index) => (
                <div
                  key={feature.key}
                  className={`feature-progress-dot ${
                    activeIndex === index ? "feature-active" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
