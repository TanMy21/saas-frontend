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
            <a href="#features">Features</a>
            <a href="#use-cases">Use cases</a>
            <a href="#pricing">Pricing</a>
            <a href="#company">Company</a>
          </nav>

          {/* Right side replacement for social icons */}
          <div className="footer-actions">
            <a href="#get-started" className="footer-cta">
              Get started
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom row */}
        <div className="footer-bottom">
          <p>© 2026 Feedflo. All rights reserved.</p>
          <p>Made with ❤️ for better insights</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
