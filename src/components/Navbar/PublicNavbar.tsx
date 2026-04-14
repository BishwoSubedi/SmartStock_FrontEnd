import "./PublicNavbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={`navbar ${open ? "nav-open" : ""}`}>
      <div className="logo">SmartStock</div>

      {/* HAMBURGER MENU */}
      <div className={`hamburger ${open ? "active" : ""}`} onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* NAV LINKS */}
      <nav className={`nav-links ${open ? "open" : ""}`}>
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>
        <a href="#security">Security</a>

        <Link to="/login" className="link">Login</Link>
        <Link to="/register" className="btn">Get Started</Link>
      </nav>
    </header>
  );
}

export default PublicNavbar;
