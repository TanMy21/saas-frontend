import { useEffect, useId, useRef, useState } from "react";

import {
  Box,
  GitBranch,
  GripVertical,
  Layers,
  MousePointerClick,
  Palette,
  PieChart,
  Plus,
  Route,
  RotateCw,
  Sparkles,
  Split,
  Type,
  Workflow,
} from "lucide-react";

import threeDTypeQuestionImg from "../../assets/feature 3d type.webp";
import createFeatureImg from "../../assets/feature create.webp";
import flowFeatureImg from "../../assets/feature flow.webp";
import insightsFeatureImg from "../../assets/feature insights.webp";
import type { FeaturesProps } from "../../types/landingTypes";

const features = [
  {
    label: "Create Surveys",
    icon: Plus,
    title: "Create beautiful surveys in minutes",
    description:
      "Build engaging surveys with an intuitive builder. Choose from different question types and customize the experience to match your research needs.",
    image: createFeatureImg,
    imageAlt: "Feedflo survey builder interface",
    points: [
      {
        icon: GripVertical,
        title: "Drag-and-drop builder",
        description: "Create and organize surveys effortlessly",
      },
      {
        icon: Type,
        title: "Multiple question types",
        description: "Use choices, ratings, media, timed tests, and more",
      },
      {
        icon: Palette,
        title: "Fully customizable",
        description: "Match the survey experience to your brand",
      },
    ],
  },
  {
    label: "3D Questions",
    icon: Box,
    title: "Capture feedback on real 3D products",
    description:
      "Let participants interact with 3D models directly inside surveys. They can rotate, inspect, and respond to products such as packaging, electronics, footwear, and prototypes.",
    image: threeDTypeQuestionImg,
    imageAlt: "Interactive 3D product question inside a Feedflo survey",
    points: [
      {
        icon: RotateCw,
        title: "Interactive 3D models",
        description: "Participants can rotate, zoom, and inspect freely",
      },
      {
        icon: MousePointerClick,
        title: "Contextual feedback",
        description: "Understand which product areas attract attention",
      },
      {
        icon: Layers,
        title: "Product concept validation",
        description: "Test designs before manufacturing or launch",
      },
    ],
  },
  {
    label: "Survey Logic",
    icon: GitBranch,
    title: "Build smarter flows with branching logic",
    description:
      "Guide each participant through the questions that matter based on their answers. Create focused survey paths instead of forcing everyone through the same sequence.",
    image: flowFeatureImg,
    imageAlt:
      "Conditional survey flow connecting questions through branching logic",
    points: [
      {
        icon: Split,
        title: "Conditional branching",
        description: "Send participants to the right next question",
      },
      {
        icon: Route,
        title: "Personalized survey paths",
        description: "Show questions based on earlier responses",
      },
      {
        icon: Workflow,
        title: "Visual flow control",
        description: "Understand how every question connects",
      },
    ],
  },
  {
    label: "Understand Insights",
    icon: PieChart,
    title: "Turn feedback into clear, useful insights",
    description:
      "Combine participant answers with behavior signals such as hesitation, answer changes, backtracking, and time spent to understand more than the final response alone.",
    image: insightsFeatureImg,
    imageAlt: "Feedflo feedback insights and response analysis dashboard",
    points: [
      {
        icon: PieChart,
        title: "Response analysis",
        description: "Understand answer patterns at a glance",
      },
      {
        icon: Sparkles,
        title: "Behavior signals",
        description: "See hesitation, changes, and interaction patterns",
      },
      {
        icon: GitBranch,
        title: "Actionable findings",
        description: "Find what deserves attention and further research",
      },
    ],
  },
];

const Features = ({ scrollParentRef }: FeaturesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastInteractionRef = useRef(0);
  const sectionId = useId();

  // Select a feature as the user progresses through the sticky section.
  useEffect(() => {
    const scrollParent = scrollParentRef?.current ?? null;
    const scrollTarget: HTMLElement | Window = scrollParent ?? window;

    const updateFromScroll = () => {
      const container = containerRef.current;
      if (!container || window.matchMedia("(max-width: 900px)").matches) {
        return;
      }

      const viewportHeight = scrollParent
        ? scrollParent.clientHeight
        : window.innerHeight;

      const viewportTop = scrollParent
        ? scrollParent.getBoundingClientRect().top
        : 0;

      const distance = viewportTop - container.getBoundingClientRect().top;
      const scrollableDistance = Math.max(
        container.offsetHeight - viewportHeight,
        1,
      );

      const progress = Math.min(Math.max(distance / scrollableDistance, 0), 1);

      const nextIndex = Math.min(
        Math.floor(progress * features.length),
        features.length - 1,
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

  // Only autoplay while this section is visible.
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

  useEffect(() => {
    if (
      !isInView ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      // Give someone time to read after they click or scroll.
      if (Date.now() - lastInteractionRef.current < 5500) return;

      setActiveIndex((current) => (current + 1) % features.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [isInView]);

  const activeFeature = features[activeIndex];

  return (
    <section ref={sectionRef} className="feature-scroll-section">
      <div ref={containerRef} className="feature-scroll-container">
        <div className="feature-sticky-wrapper">
          <div className="feature-inner">
            <div className="feature-layout">
              <div className="feature-copy">
                <h2 className="feature-main-title">
                  Everything you need to collect smarter feedback
                </h2>

                <div className="feature-list">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    const isActive = index === activeIndex;
                    const panelId = `${sectionId}-panel-${index}`;

                    return (
                      <div
                        className={`feature-entry ${
                          isActive ? "is-active" : ""
                        }`}
                        key={feature.label}
                      >
                        <button
                          type="button"
                          className="feature-trigger"
                          aria-expanded={isActive}
                          aria-controls={panelId}
                          onClick={() => {
                            lastInteractionRef.current = Date.now();
                            setActiveIndex(index);
                          }}
                        >
                          <Icon
                            className="feature-trigger-icon"
                            size={19}
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                          <span>{feature.label}</span>
                        </button>

                        <div
                          id={panelId}
                          className="feature-panel"
                          hidden={!isActive}
                        >
                          <h3>{feature.title}</h3>
                          <p className="feature-panel-description">
                            {feature.description}
                          </p>

                          <div className="feature-points">
                            {feature.points.map((point) => {
                              const PointIcon = point.icon;

                              return (
                                <div
                                  className="feature-point"
                                  key={point.title}
                                >
                                  <PointIcon
                                    size={16}
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                  />
                                  <div>
                                    <strong>{point.title}</strong>
                                    <span>{point.description}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="feature-visual">
                <img
                  key={activeIndex}
                  src={activeFeature.image}
                  alt={activeFeature.imageAlt}
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
