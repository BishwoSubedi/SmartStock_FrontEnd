import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { apiRequest } from "../../../utils/api";
import "./VerifyOtp.css";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!location.state?.email) {
      alert("Please register first to verify your email.");
      navigate("/register");
    }
  }, [location, navigate]);
  const prefilledEmail = location.state?.email || "";

  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
        }),
      });

      setSuccess(data.message || "Email verified successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("OTP verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResending(true);
      setError("");
      setSuccess("");

      const data = await apiRequest("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });

      setSuccess(data.message || "OTP resent successfully");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to resend OTP");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="verify-otp-page">
        <div className="verify-otp-shell">
          <div className="verify-otp-left">
            <div className="verify-otp-left-content">
              <span className="verify-otp-badge">Verify Business Email</span>
              <h1>Confirm your SmartStock account</h1>
              <p>
                Enter the OTP sent to your business email to activate your
                account securely before logging in.
              </p>

              <div className="verify-otp-features">
                <div className="verify-otp-feature">
                  📩 OTP sent to your email
                </div>
                <div className="verify-otp-feature">
                  🔐 Secure account activation
                </div>
                <div className="verify-otp-feature">
                  ⚡ Quick business verification
                </div>
              </div>
            </div>
          </div>

          <div className="verify-otp-right">
            <div className="verify-otp-card">
              <div className="verify-otp-header">
                <h2>Verify OTP</h2>
                <p>Enter the 6-digit code sent to your business email.</p>
              </div>

              <form className="verify-otp-form" onSubmit={handleVerifyOTP}>
                <div className="verify-otp-group">
                  <label htmlFor="verify-email">Business Email</label>
                  <input
                    type="email"
                    id="verify-email"
                    placeholder="Enter business email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="verify-otp-group">
                  <label htmlFor="otp">OTP Code</label>
                  <input
                    type="text"
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="verify-otp-error">{error}</p>}
                {success && <p className="verify-otp-success">{success}</p>}

                <button
                  type="submit"
                  className="verify-otp-btn primary-btn"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </button>

                <button
                  type="button"
                  className="verify-otp-btn secondary-btn"
                  onClick={handleResendOTP}
                  disabled={resending || !email.trim()}
                >
                  {resending ? "Resending..." : "Resend OTP"}
                </button>

                <p className="verify-otp-footer">
                  Already verified? <Link to="/login">Go to Login</Link>
                </p>

                <Link to="/register" className="verify-otp-back-link">
                  Back to Register
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default VerifyOTP;
