import { useEffect, useRef, useState } from "react";

import { MoveRight, X } from "lucide-react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

import mockup3dImg from "../../assets/3d_phone_mockup.webp";

const HeroSection = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isHeroVideoPlaying, setIsHeroVideoPlaying] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();

  const handleStartFlow = () => {
    navigate("/register");
  };

  const playModalVideo = async () => {
    const heroVideo = heroVideoRef.current;

    if (!heroVideo) return;

    try {
      await heroVideo.play();
      setIsHeroVideoPlaying(true);
    } catch {
      setIsHeroVideoPlaying(false);
    }
  };

  const openDemoModal = () => {
    flushSync(() => {
      setIsDemoOpen(true);
      setIsHeroVideoPlaying(false);
    });

    void playModalVideo();
  };

  const closeDemoModal = () => {
    heroVideoRef.current?.pause();
    setIsHeroVideoPlaying(false);
    setIsDemoOpen(false);
  };

  useEffect(() => {
    if (!isDemoOpen) return;

    const pageRoot = document.querySelector<HTMLElement>(".lp-root");
    const previousPageOverflow = pageRoot?.style.overflowY ?? "";
    const previousBodyOverflow = document.body.style.overflow;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDemoModal();
      }
    };

    if (pageRoot) {
      pageRoot.style.overflowY = "hidden";
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = previousBodyOverflow;

      if (pageRoot) {
        pageRoot.style.overflowY = previousPageOverflow;
      }
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
            </div>
          </div>

          {/* Hero image collage */}
          <div className="hero-visual">
            <div className="hero-collage">
              {/* Main image gets the maximum visual weight */}
              <div className="hero-image-card hero-image-main">
                <img
                  src={import.meta.env.VITE_HERO_DEMO_POSTER_URL}
                  alt="Feedflo product demo preview"
                  loading="eager"
                  fetchPriority="high"
                />

                <button
                  type="button"
                  className="hero-demo-play-button"
                  onClick={openDemoModal}
                  aria-label="Open Feedflo product demo"
                />
              </div>

              {/* Right vertical image aligned closer to the main image */}
              <div className="hero-image-card hero-image-right">
                <img
                  src={mockup3dImg}
                  alt="3D survey preview"
                  width={623}
                  height={961}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {isDemoOpen && (
        <div className="hero-demo-modal-overlay" onClick={closeDemoModal}>
          <div
            className="hero-demo-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Feedflo product demo"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="hero-demo-modal-close"
              onClick={closeDemoModal}
              aria-label="Close product demo"
            >
              <X aria-hidden="true" />
            </button>

            <div className="hero-demo-modal-video-shell">
              <video
                ref={heroVideoRef}
                className="hero-demo-modal-video"
                src={import.meta.env.VITE_HERO_DEMO_VIDEO_URL}
                controls
                controlsList="nodownload noplaybackrate"
                preload="metadata"
                playsInline
                poster={import.meta.env.VITE_HERO_DEMO_POSTER_URL}
                aria-label="Feedflo product demo video"
                onPlaying={() => setIsHeroVideoPlaying(true)}
                onPause={() => setIsHeroVideoPlaying(false)}
                onEnded={() => setIsHeroVideoPlaying(false)}
              />

              {!isHeroVideoPlaying && (
                <button
                  type="button"
                  className="hero-demo-play-button hero-demo-modal-play-button"
                  onClick={() => void playModalVideo()}
                  aria-label="Play Feedflo product demo video"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;
