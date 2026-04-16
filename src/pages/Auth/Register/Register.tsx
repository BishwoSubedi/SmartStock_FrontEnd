import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { apiRequest } from "../../../utils/api";
import "../Auth.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*()+-])[A-Za-z\d@#$%&*()+-]{9,}$/;

    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 9 characters and include uppercase, lowercase, number, and special characters."
      );
      setSuccess("");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setSuccess(data.message || "Business account registered successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed");
      }
      setSuccess("");
    }
  };

  return (
    <AuthLayout>
      <div className="auth-page register-page-bg">
        <div className="auth-shell">
          <div className="auth-brand-panel">
            <div className="auth-brand-content">
              <span className="auth-badge">SmartStock</span>
              <h1>Build your inventory system in minutes</h1>
              <p>
                Register your business and start managing stock, suppliers, and
                low-stock alerts from one modern dashboard.
              </p>

              <div className="auth-feature-list">
                <div className="auth-feature-item">📦 Real-time stock tracking</div>
                <div className="auth-feature-item">🔔 Automatic low-stock alerts</div>
                <div className="auth-feature-item">🤝 Easy supplier management</div>
              </div>
            </div>
          </div>

          <div className="auth-form-panel">
            <div className="auth-card">
              <div className="auth-header">
                <h2>Create Account</h2>
                <p>Register your business to get started.</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="businessName">Business Name</label>
                  <input
                    type="text"
                    id="businessName"
                    placeholder="Enter business name"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="adminName">Admin Name</label>
                  <input
                    type="text"
                    id="adminName"
                    placeholder="Enter admin name"
                    value={formData.adminName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="email">Business Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter business email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="show-hide-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="show-hide-btn"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {error && <p className="error-text">{error}</p>}
                {success && <p className="success-text">{success}</p>}

                <button type="submit" className="auth-btn">
                  Create Account
                </button>

                <p className="auth-footer">
                  Already have an account? <Link to="/login">Login</Link>
                </p>

                <Link
                  to="/"
                  className="auth-btn"
                  style={{ textDecoration: "none", textAlign: "center" }}
                >
                  Back to Homepage
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Register;