import { useState } from "react";

const CTA = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  /**
   * Opens the demo video modal.
   * Later, this modal can show a hosted video from YouTube, Vimeo, Cloudinary, S3, etc.
   */
  const handleOpenDemo = () => {
    setIsDemoOpen(true);
  };

  /**
   * Closes the demo video modal.
   */
  const handleCloseDemo = () => {
    setIsDemoOpen(false);
  };

  return (
    <>
      <div className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">
            Ready to understand
            <br />
            your users like never before?
          </h2>

          <p className="cta-subtitle">Create your first survey in minutes</p>

          <div className="cta-actions">
            <button className="cta-btn primary">Get started for free</button>

            <button
              type="button"
              className="cta-btn secondary"
              onClick={handleOpenDemo}
            >
              Watch demo
            </button>
          </div>
        </div>
      </div>

      {isDemoOpen && (
        <div className="demo-modal-backdrop" onClick={handleCloseDemo}>
          <div
            className="demo-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="demo-modal-close"
              onClick={handleCloseDemo}
              aria-label="Close demo video"
            >
              ×
            </button>

            <div className="demo-video-shell">
              {/* 
                Replace this block later with an iframe or video tag.

                Example iframe:
                <iframe
                  src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                  title="Product demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              */}

              <div className="demo-play-circle">▶</div>

              <div className="demo-video-copy">
                <h3>Product demo video</h3>
                <p>Hosted demo video will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CTA;