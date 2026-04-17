import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { apiRequest } from "../../../utils/api";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.email) {
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  const prefilledEmail = location.state?.email || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: prefilledEmail,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*()+-])[A-Za-z\d@#$%&*()+-]{9,}$/;

    return passwordRegex.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleResetPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validatePassword(formData.newPassword)) {
      setError(
        "Password must be at least 9 characters and include uppercase, lowercase, number, and special character."
      );
      setSuccess("");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email.trim(),
          otp: formData.otp.trim(),
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      setSuccess(data.message || "Password reset successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to reset password");
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

      const data = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: formData.email.trim() }),
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
      <div className="reset-page-bg">
        <div className="reset-container">
          <div className="reset-header">
            <span className="reset-badge">Reset Password</span>
            <h2>Create a new secure password</h2>
            <p>
              Enter the OTP sent to your business email and choose a new password
              for your SmartStock account.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="reset-form">
            <div className="reset-group">
              <label htmlFor="email">Business Email</label>
              <input
                type="email"
                id="email"
                className="reset-input"
                placeholder="Enter business email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="reset-group">
              <label htmlFor="otp">OTP Code</label>
              <input
                type="text"
                id="otp"
                className="reset-input"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                required
              />
            </div>

            <div className="reset-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="reset-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  className="reset-input password-input"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="reset-show-hide-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="reset-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="reset-password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="reset-input password-input"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="reset-show-hide-btn"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <p className="reset-error">{error}</p>}
            {success && <p className="reset-success">{success}</p>}

            <button type="submit" className="reset-btn" disabled={loading}>
              {loading ? "Processing..." : "Reset Password"}
            </button>

            <button
              type="button"
              className="reset-resend-btn"
              onClick={handleResendOTP}
              disabled={resending || !formData.email.trim()}
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>

            <p className="reset-footer-text">
              Back to <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ResetPassword;