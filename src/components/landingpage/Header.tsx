import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleStartFlow = () => {
    navigate("/register");
  };
  return (
    <div className="lp-header">
      <div className="lp-container header-inner">
        {/* Logo */}
        <div className="logo-wrapper">
          <div className="logo-box">
            <img src="/Logo.png" alt="Feedflo" width={410} height={320} />
          </div>
          <span className="logo-text">eedflo</span>
        </div>

        {/* Actions */}
        <div className="header-actions">
          <a href="/login" className="login-link">
            Login
          </a>
          <button className="header-btn-primary" onClick={handleStartFlow}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
