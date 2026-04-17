import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { apiRequest } from "../../../utils/api";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });

      setSuccess(data.message || "OTP sent successfully");

      setTimeout(() => {
        navigate("/reset-password", {
          state: { email: email.trim() },
        });
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send reset OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="forgot-page-bg">
        <div className="forgot-container">
          <div className="forgot-header">
            <span className="forgot-badge">Password Recovery</span>
            <h2>Forgot Password</h2>
            <p>
              Enter your business email and we will send an OTP to help you reset
              your password securely.
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="forgot-form">
            <div className="forgot-group">
              <label htmlFor="forgot-email">Business Email</label>
              <input
                type="email"
                id="forgot-email"
                className="forgot-input"
                placeholder="Enter business email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <p className="forgot-error">{error}</p>}
            {success && <p className="forgot-success">{success}</p>}

            <button type="submit" className="forgot-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <p className="forgot-footer-text">
              Remembered your password? <Link to="/login">Back to Login</Link>
            </p>

            <Link to="/" className="forgot-secondary-link">
              Go Back to Homepage
            </Link>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;