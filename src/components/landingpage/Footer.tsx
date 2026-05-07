import Logo from "../../../public/Logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top row */}
        <div className="footer-top">
          {/* Logo */}
          <div className="footer-logo">
            <div className="footer-logo-box">
              <img src={Logo} alt="Feedflo logo" />
            </div>
            <span className="footer-logo-text">eedflo</span>
          </div>

          {/* Center navigation */}
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#features">Privacy policy</a>
            <a href="#use-cases">Terms of use</a>
            <a href="#pricing">Pricing</a>
            <a href="#company">Company</a>
          </nav>

          {/* Right side replacement for social icons */}
          <div className="footer-actions">
            <a href="/register" className="footer-cta">
              Try it now
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="footer-bottom">
          <p>© 2026 Feedflo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
