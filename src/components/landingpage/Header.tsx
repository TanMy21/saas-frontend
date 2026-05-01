import Logo from "../../../public/Logo.png";

const Header = () => {
  return (
  <div className="lp-header">
      <div className="lp-container header-inner">
        
        {/* Logo */}
        <div className="logo-wrapper">
          <div className="logo-box">
            <img src={Logo} alt="logo" />
          </div>
          <span className="logo-text">eedflo</span>
        </div>

        {/* Actions */}
        <div className="header-actions">
          <a href="/login" className="login-link">Login</a>
          <button className="btn-primary">Get Started</button>
        </div>

      </div>
    </div>
  );
};

export default Header;
