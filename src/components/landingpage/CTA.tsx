import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  const handleStartFlow = () => {
    navigate("/register");
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

          <p className="cta-subtitle">
            Create surveys that help you understand users better.
          </p>

          <div className="cta-actions">
            <button className="cta-btn primary" onClick={handleStartFlow}>
              Start creating
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CTA;
