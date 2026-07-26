import { useEffect, useRef, useState } from "react";

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
import { FeaturesProps } from "../../types/landingTypes";

// Defines the number of scroll-controlled feature panels in this section.
const FEATURE_COUNT = 4;

// Matches each feature container to its source image so it can fill the
// available area without being cropped or distorted.
const FEATURE_IMAGE_ASPECT_RATIOS = [
  "1639 / 960",
  "1535 / 1024",
  "1672 / 941",
  "1254 / 1069",
] as const;

/**
 * Returns the viewport height of the custom scroll container when provided,
 * otherwise returns the browser viewport height.
 */
function getScrollViewportHeight(scrollParent: HTMLDivElement | null) {
  return scrollParent ? scrollParent.clientHeight : window.innerHeight;
}

/**
 * Displays the right-side image mockup for the survey creation feature.
 */
function CreateFeatureMockup() {
  return (
    // <div className="feature-mockup-panel feature-color-blue">
    //   <div className="feature-mockup-dots" aria-hidden="true">
    //     <span />
    //     <span />
    //     <span />
    //   </div>

    <div
      className="feature-mockup-card feature-mockup-image-card feature-mockup-fill-card"
    >
      <img
        className="feature-mockup-image"
        src={createFeatureImg}
        alt="Feedflo survey builder interface"
        width={1639}
        height={960}
        loading="lazy"
        decoding="async"
      />
    </div>
    // </div>
  );
}

/**
 * Displays the right-side image mockup for the interactive 3D question feature.
 */
function ThreeDFeatureMockup() {
  return (
    <div
      className="feature-mockup-panel feature-mockup-image-panel feature-color-violet"
    >
      <div className="feature-mockup-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div
        className="feature-mockup-card feature-mockup-image-card feature-mockup-fill-card"
      >
        <img
          className="feature-mockup-image"
          src={threeDTypeQuestionImg}
          alt="Interactive 3D product question inside a Feedflo survey"
          width={1535}
          height={1024}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

/**
 * Displays the right-side image mockup for conditional survey flow and logic.
 */
function FlowFeatureMockup() {
  return (
    <div
      className="feature-mockup-panel feature-mockup-image-panel feature-color-emerald"
    >
      <div className="feature-mockup-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div
        className="feature-mockup-card feature-mockup-image-card feature-mockup-fill-card"
      >
        <img
          className="feature-mockup-image"
          src={flowFeatureImg}
          alt="Conditional survey flow connecting questions through branching logic"
          width={1672}
          height={941}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

/**
 * Displays the right-side image mockup for survey insights and analysis.
 */
function InsightsFeatureMockup() {
  return (
    <div
      className="feature-mockup-panel feature-mockup-image-panel feature-color-amber"
    >
      <div className="feature-mockup-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div
        className="feature-mockup-card feature-mockup-image-card feature-mockup-fill-card"
      >
        <img
          className="feature-mockup-image"
          src={insightsFeatureImg}
          alt="Feedflo feedback insights and response analysis dashboard"
          width={1254}
          height={1069}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

/**
 * Displays the content for the survey creation feature.
 */
function CreateFeatureContent({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`feature-dynamic-item ${isActive ? "feature-active" : ""}`}
      aria-hidden={!isActive}
    >
      <div className="feature-step-row">
        <div className="feature-step-icon feature-color-blue">
          <Plus size={20} />
        </div>

        <span className="feature-step-text">01 / Create Surveys</span>
      </div>

      <h3 className="feature-title">
        Create beautiful surveys
        <br />
        in minutes
      </h3>

      <p className="feature-description">
        Build engaging surveys with an intuitive builder. Choose from different
        question types and customize the experience to match your research
        needs.
      </p>

      <div className="feature-bullets">
        <div className="feature-bullet-item">
          <div className="feature-bullet-icon">
            <GripVertical size={18} />
          </div>

          <div>
            <div className="feature-bullet-title">Drag-and-drop builder</div>

            <div className="feature-bullet-desc">
              Create and organize surveys effortlessly
            </div>
          </div>
        </div>

        <div className="feature-bullet-item">
          <div className="feature-bullet-icon">
            <Type size={18} />
          </div>

          <div>
            <div className="feature-bullet-title">Multiple question types</div>

            <div className="feature-bullet-desc">
              Use choices, ratings, media, timed tests, and more
            </div>
          </div>
        </div>

        <div className="feature-bullet-item">
          <div className="feature-bullet-icon">
            <Palette size={18} />
          </div>

          <div>
            <div className="feature-bullet-title">Fully customizable</div>

            <div className="feature-bullet-desc">
              Match the survey experience to your brand
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Displays the content for the interactive 3D question feature.
 */
function ThreeDFeatureContent({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`feature-dynamic-item ${isActive ? "feature-active" : ""}`}
      aria-hidden={!isActive}
    >
      <div className="feature-step-row">
        <div className="feature-step-icon feature-color-violet">
          <Box size={20} />
        </div>

        <span className="feature-step-text">02 / 3D Questions</span>
      </div>

      <h3 className="feature-title">
        Capture feedback
        <br />
        on real 3D products
      </h3>

      <p className="feature-description">
        Let participants interact with 3D models directly inside surveys. They
        can rotate, inspect, and respond to products such as packaging,
        electronics, footwear, and prototypes.
      </p>

      <div className="feature-bullets">
        <div className="feature-bullet-item">
          <div className="feature-bullet-icon">
            <RotateCw size={18} />
          </div>

          <div>
            <div className="feature-bullet-title">Interactive 3D models</div>

            <div className="feature-bullet-desc">
              Participants can rotate, zoom, and inspect freely
            </div>
          </div>
        </div>

        <div className="feature-bullet-item">
          <div className="feature-bullet-icon">
            <MousePointerClick size={18} />
          </div>

          <div>
            <div className="feature-bullet-title">Contextual feedback</div>

            <div className="feature-bullet-desc">
              Understand which product areas attract attention
            </div>
          </div>
        </div>

        <div className="feature-bullet-item">
          <div className="feature-bullet-icon">
            <Layers size={18} />
          </div>

          <div>
            <div className="feature-bullet-title">
              Product concept validation
            </div>

            <div className="feature-bullet-desc">
              Test designs before manufacturing or launch
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Displays the content for conditional survey paths and branching logic.
 */
function FlowFeatureContent({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`feature-dynamic-item ${isActive ? "feature-active" : ""}`}
      aria-hidden={!isActive}
    >
      <div className="feature-step-row">
        <div className="feature-step-icon feature-color-emerald">
          <GitBranch size={20} />
        </div>

        <span className="feature-step-text">03 / Survey Logic</span>
      </div>

      <h3 className="feature-title">
        Build smarter flows
        <br />
        with branching logic
      </h3>

      <p className="feature-description">
        Guide each participant through the questions that matter based on their
        answers. Create focused survey paths instead of forcing everyone through
        the same sequence.
      </p>

      <div className="feature-bullets">
        <div className="feature-bullet-item">
          <div className="feature-bullet-icon">
            <Split size={18} />
          </div>

          <div>
            <div className="feature-bullet-title">Conditional branching</div>

            <div className="feature-bullet-desc">
              Send participants to the right next question
            </div>
          </div>
        </div>

        <div className="feature-bullet-item">
          <div className="feature-bullet-icon">
            <Route size={18} />
          </div>

          <div>
            <div className="feature-bullet-title">
              Personalized survey paths
            </div>

            <div className="feature-bullet-desc">
              Show questions based on earlier responses
            </div>
          </div>
        </div>

        <div className="feature-bullet-item">
          <div className="feature-bullet-icon">
            <Workflow size={18} />
          </div>

          <div>
            <div className="feature-bullet-title">Visual flow control</div>

            <div className="feature-bullet-desc">
              Understand how every question connects
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Displays the content for response analysis and feedback insights.
 */
function InsightsFeatureContent({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`feature-dynamic-item ${isActive ? "feature-active" : ""}`}
      aria-hidden={!isActive}
    >
      <div className="feature-step-row">
        <div className="feature-step-icon feature-color-amber">
          <PieChart size={20} />
        </div>

        <span className="feature-step-text">04 / Understand Insights</span>
      </div>

      <h3 className="feature-title">
        Turn feedback into
        <br />
        clear, useful insights
      </h3>

      <p className="feature-description">
        Combine participant answers with behavior signals such as hesitation,
        answer changes, backtracking, and time spent to understand more than the
        final response alone.
      </p>

      <div className="feature-bullets">
        <div className="feature-bullet-item">
          <div className="feature-bullet-icon">
            <PieChart size={18} />
          </div>

          <div>
            <div className="feature-bullet-title">Response analysis</div>

            <div className="feature-bullet-desc">
              Understand answer patterns at a glance
            </div>
          </div>
        </div>

        <div className="feature-bullet-item">
          <div className="feature-bullet-icon">
            <Sparkles size={18} />
          </div>

          <div>
            <div className="feature-bullet-title">Behavior signals</div>

            <div className="feature-bullet-desc">
              See hesitation, changes, and interaction patterns
            </div>
          </div>
        </div>

        <div className="feature-bullet-item">
          <div className="feature-bullet-icon">
            <GitBranch size={18} />
          </div>

          <div>
            <div className="feature-bullet-title">Actionable findings</div>

            <div className="feature-bullet-desc">
              Find what deserves attention and further research
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Displays the sticky, scroll-driven feature section and updates the active
 * feature according to the user's progress through the section.
 */
const Features = ({ scrollParentRef }: FeaturesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /**
   * Registers scroll and resize listeners used to calculate the currently
   * active feature panel.
   */
  useEffect(() => {
    /**
     * Converts the current section scroll position into an active feature
     * index between zero and three.
     */
    const handleScroll = () => {
      const container = containerRef.current;
      const scrollParent = scrollParentRef?.current ?? null;

      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = getScrollViewportHeight(scrollParent);

      // Measures how far the feature section has travelled above the viewport.
      const scrollDistance = -rect.top;

      // Removes one sticky viewport from the total available scroll distance.
      const scrollableHeight = Math.max(rect.height - viewportHeight, 1);

      if (scrollDistance <= 0) {
        setActiveIndex(0);
        return;
      }

      if (scrollDistance >= scrollableHeight) {
        setActiveIndex(FEATURE_COUNT - 1);
        return;
      }

      // Converts the current scroll distance into a value between zero and one.
      const progress = scrollDistance / scrollableHeight;

      // Converts progress into one of the four explicit feature indexes.
      const nextIndex = Math.floor(progress * FEATURE_COUNT);

      setActiveIndex(Math.min(nextIndex, FEATURE_COUNT - 1));
    };

    const scrollParent = scrollParentRef?.current ?? null;
    const scrollTarget: HTMLElement | Window = scrollParent ?? window;

    scrollTarget.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    // Calculates the correct active feature immediately after mounting.
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
          // Gives each of the four features one viewport of scroll distance.
          height: `${FEATURE_COUNT * 100}vh`,
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
                    Create interactive surveys, guide participants through
                    smarter flows, capture richer responses, and turn feedback
                    into decisions.
                  </p>
                </div>

                <div className="feature-dynamic-content">
                  <CreateFeatureContent isActive={activeIndex === 0} />

                  <ThreeDFeatureContent isActive={activeIndex === 1} />

                  <FlowFeatureContent isActive={activeIndex === 2} />

                  <InsightsFeatureContent isActive={activeIndex === 3} />
                </div>
              </div>

              <div
                className="feature-right-column"
                style={{
                  aspectRatio: FEATURE_IMAGE_ASPECT_RATIOS[activeIndex],
                }}
              >
                <div
                  className={`feature-mockup-layer ${
                    activeIndex === 0 ? "feature-active" : ""
                  }`}
                  aria-hidden={activeIndex !== 0}
                >
                  <CreateFeatureMockup />
                </div>

                <div
                  className={`feature-mockup-layer ${
                    activeIndex === 1 ? "feature-active" : ""
                  }`}
                  aria-hidden={activeIndex !== 1}
                >
                  <ThreeDFeatureMockup />
                </div>

                <div
                  className={`feature-mockup-layer ${
                    activeIndex === 2 ? "feature-active" : ""
                  }`}
                  aria-hidden={activeIndex !== 2}
                >
                  <FlowFeatureMockup />
                </div>

                <div
                  className={`feature-mockup-layer ${
                    activeIndex === 3 ? "feature-active" : ""
                  }`}
                  aria-hidden={activeIndex !== 3}
                >
                  <InsightsFeatureMockup />
                </div>
              </div>
            </div>

            <div className="feature-progress" aria-label="Feature progress">
              <div
                className={`feature-progress-dot ${
                  activeIndex === 0 ? "feature-active" : ""
                }`}
              />

              <div
                className={`feature-progress-dot ${
                  activeIndex === 1 ? "feature-active" : ""
                }`}
              />

              <div
                className={`feature-progress-dot ${
                  activeIndex === 2 ? "feature-active" : ""
                }`}
              />

              <div
                className={`feature-progress-dot ${
                  activeIndex === 3 ? "feature-active" : ""
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
