import { useEffect, useState } from "react";

import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartFlow = () => {
    navigate("/register");
  };

  const openDemoModal = () => {
    setIsDemoOpen(true);
  };

  const closeDemoModal = () => {
    setIsDemoOpen(false);
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDemoModal();
      }
    };

    if (isDemoOpen) {
      window.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isDemoOpen]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-container">
          {/* Hero text content */}
          <div className="hero-content">
            <h1 className="hero-title">
              Understand users,
              <br />
              not just responses
            </h1>

            <p className="hero-description">
              Move beyond surface-level responses. Understand real user intent.
            </p>

            <div className="hero-actions">
              <button className="hero-primary-btn" onClick={handleStartFlow}>
                Start the flow <MoveRight />
              </button>

              <button
                type="button"
                className="hero-secondary-btn"
                onClick={openDemoModal}
              >
                Watch demo
              </button>
            </div>
          </div>

          {/* Hero image collage */}
          <div className="hero-visual">
            <div className="hero-collage">
              {/* Small square image aligned to the left/lower area of the main image */}
              <div className="hero-image-card hero-image-left">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=90"
                  alt="User working on laptop"
                />
              </div>

              {/* Main image gets the maximum visual weight */}
              <div className="hero-image-card hero-image-main">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1100&q=90"
                  alt="Team discussion"
                />
              </div>

              {/* Right vertical image aligned closer to the main image */}
              <div className="hero-image-card hero-image-right">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=90"
                  alt="Team planning"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo modal */}
      {isDemoOpen && (
        <div className="demo-modal-overlay" onClick={closeDemoModal}>
          <div
            className="demo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="demo-modal-close"
              onClick={closeDemoModal}
              aria-label="Close demo popup"
            >
              ×
            </button>

            <div className="demo-modal-header">
              <p className="demo-modal-eyebrow">Product demo</p>
            </div>

            <div className="demo-video-shell">
              <div className="demo-video-placeholder">
                <div className="demo-play-button">▶</div>

                <div className="demo-video-text">
                  <strong>Demo video placeholder</strong>
                </div>
              </div>
            </div>

            <div className="demo-modal-footer">
              <button
                type="button"
                className="demo-modal-primary-btn"
                onClick={closeDemoModal}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;
