import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <h3>SmartStock</h3>
        <p>
          Smart, fast and reliable inventory management for modern businesses.
          Track stock, manage suppliers, and stay in control effortlessly.
        </p>

        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#security">Security</a>
          <a href="/login">Login</a>
          <a href="/register">Get Started</a>
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} SmartStock. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;
