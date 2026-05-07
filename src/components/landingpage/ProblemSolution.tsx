import { useEffect, useRef, useState } from "react";

import { newWayItems, oldWayItems } from "../../utils/utils";

const ProblemSolution = () => {
  // Tracks whether the section has entered the viewport once.
  const [isVisible, setIsVisible] = useState(false);

  // Stores the section DOM node so IntersectionObserver can watch it.
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Do nothing if the section is not mounted yet.
    if (!sectionRef.current) return;

    // Watches when the problem-solution section enters the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Runs the animation only once when enough of the section is visible.
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        // Starts animation when around 25% of the section is visible.
        threshold: 0.25,
      },
    );

    // Starts observing the current section element.
    observer.observe(sectionRef.current);

    // Cleans up observer when component unmounts.
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`ps-section ${isVisible ? "ps-visible" : ""}`}
    >
      <div className="ps-container">
        <div className="ps-left">
          <p className="ps-label red">🥱 Old Way</p>

          <div className="ps-list">
            {oldWayItems.map((item, index) => {
              // Converts the stored Lucide icon component into a JSX component.
              const Icon = item.icon;

              return (
                <div
                  className="ps-item"
                  key={item.title}
                  style={{
                    // Staggers each item so they do not appear all at once.
                    transitionDelay: `${160 + index * 90}ms`,
                  }}
                >
                  <div className="ps-icon red">
                    <Icon size={20} strokeWidth={2.2} />
                  </div>

                  <div className="ps-item-content">
                    <p className="ps-item-title">{item.title}</p>
                    <p className="ps-item-desc">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ps-divider">
          <div className="arrow">→</div>
        </div>

        <div className="ps-right">
          <p className="ps-label ps-blue">😎 New Way</p>

          <div className="ps-list">
            {newWayItems.map((item, index) => {
              // Converts the stored Lucide icon component into a JSX component.
              const Icon = item.icon;

              return (
                <div
                  className="ps-item"
                  key={item.title}
                  style={{
                    // Starts right-side items slightly later than old-way items.
                    transitionDelay: `${260 + index * 90}ms`,
                  }}
                >
                  <div className="ps-icon blue">
                    <Icon size={20} strokeWidth={2.2} />
                  </div>

                  <div className="ps-item-content">
                    <p className="ps-item-title">{item.title}</p>
                    <p className="ps-item-desc">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolution;
