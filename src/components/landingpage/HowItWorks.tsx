import { useEffect, useRef, useState } from "react";

import { HowItWorksSteps } from "../../utils/utils";

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Watches the How It Works section and starts the reveal animation
   * only when the section enters the visible scroll area.
   */
  useEffect(() => {
    const sectionElement = sectionRef.current;

    if (!sectionElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Stops observing after the first reveal so animation runs only once.
          observer.unobserve(sectionElement);
        }
      },
      {
        // Starts animation when around 25% of the section is visible.
        threshold: 0.25,
      },
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`how-section ${isVisible ? "how-visible" : ""}`}
    >
      <div className="how-container">
        {/* Header */}
        <div className="how-header">
          <h2 className="how-title">Feedback to Insight</h2>

          <p className="how-subtitle">
            Create, share, and understand in one simple flow.
          </p>
        </div>

        {/* Steps */}
        <div className="how-grid">
          {HowItWorksSteps.map((step, index) => (
            <div className="how-card" key={step.title}>
              {/* Number badge */}
              <div className="how-step-number">{index + 1}</div>

              {/* Image */}
              <div className="how-image-wrap">
                <img className="how-image" src={step.image} alt={step.alt} />
              </div>

              {/* Text */}
              <h3 className="how-step-title">{step.title}</h3>

              <p className="how-step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;