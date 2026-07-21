import { useEffect, useRef, useState } from "react";

import createImg from "../../assets/create.webp";
import shareImg from "../../assets/share question.webp";
import understandImg from "../../assets/understand2.webp";

/**
 * Displays the three fixed Feedflo workflow steps and reveals them
 * when the section enters the visible part of the page.
 */
const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Observes the section and enables the entrance animation once
   * approximately 25% of the section becomes visible.
   */
  useEffect(() => {
    const sectionElement = sectionRef.current;

    if (!sectionElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsVisible(true);

        // Prevents the animation from replaying whenever the user scrolls back.
        observer.unobserve(sectionElement);
      },
      {
        threshold: 0.25,
      },
    );

    observer.observe(sectionElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`how-section ${isVisible ? "how-visible" : ""}`}
    >
      <div className="how-container">
        {/* Section heading */}
        <div className="how-header">
          <h2 className="how-title">Feedback to Insight</h2>

          <p className="how-subtitle">
            Create, share, and understand in one simple flow.
          </p>
        </div>

        <div className="how-grid">
          {/* Create step */}
          <div className="how-card">
            <div className="how-step-number">1</div>

            <div className="how-image-wrap">
              <img
                className="how-image"
                src={createImg}
                alt="Feedflo survey creation interface"
                loading="lazy"
                decoding="async"
              />
            </div>

            <h3 className="how-step-title">Create</h3>

            <p className="how-step-description">
              Build surveys with the question types, design, and flow you need.
            </p>
          </div>

          {/* Share step */}
          <div className="how-card">
            <div className="how-step-number">2</div>

            <div className="how-image-wrap">
              <img
                className="how-image"
                src={shareImg}
                alt="Feedflo survey sharing options with a link and QR code"
                loading="lazy"
                decoding="async"
              />
            </div>

            <h3 className="how-step-title">Share</h3>

            <p className="how-step-description">
              Share by link, QR code, or embed it directly on your site.
            </p>
          </div>

          {/* Understand step */}
          <div className="how-card">
            <div className="how-step-number">3</div>

            <div className="how-image-wrap">
              <img
                className="how-image"
                src={understandImg}
                alt="Feedflo response and behavioural insights dashboard"
                loading="lazy"
                decoding="async"
              />
            </div>

            <h3 className="how-step-title">Understand</h3>

            <p className="how-step-description">
              See what users say, where they pause, and what their feedback
              really means.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
