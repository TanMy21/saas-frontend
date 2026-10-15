import { useState } from "react";

import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleStartFlow = () => {
    navigate("/register");
  };
  return (
    <div className="lp-header">
      <div className="lp-container header-inner">
        {/* Logo */}
        <div className="logo-wrapper">
          <div className="logo-box">
            <img src="/Logo.webp" alt="Feedflo" width={410} height={320} />
          </div>
          <span className="logo-text">eedflo</span>
        </div>

        {/* Actions */}
        <div className="header-actions">
          <nav
            id="landing-navigation"
            className={`header-nav${isMenuOpen ? " is-open" : ""}`}
            aria-label="Main navigation"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setIsMenuOpen(false);
                document.getElementById("landing-menu-toggle")?.focus();
              }
            }}
          >
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>
              How it works
            </a>
            <a href="#features" onClick={() => setIsMenuOpen(false)}>
              Features
            </a>
            <a href="#use-cases" onClick={() => setIsMenuOpen(false)}>
              Use cases
            </a>
          </nav>

          <button
            id="landing-menu-toggle"
            type="button"
            className="header-menu-toggle"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            aria-controls="landing-navigation"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            {isMenuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>

          <button className="header-btn-primary" onClick={handleStartFlow}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
