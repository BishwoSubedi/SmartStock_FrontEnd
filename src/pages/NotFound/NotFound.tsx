import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./NotFound.css";

function NotFound() {
  useEffect(() => {
    document.title = "404 | SmartStock";
  }, []);

  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="notfound-actions">
          <Link to="/dashboard" className="notfound-btn primary">
            Go to Dashboard
          </Link>

          <Link to="/" className="notfound-btn secondary">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;