import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { apiRequest } from "../../../utils/api";
import "../Auth.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Login successful! Redirecting to dashboard...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
      setSuccess("");
    }
  };

  return (
    <AuthLayout>
      <div className="auth-page login-page-bg">
        <div className="auth-shell auth-shell-login">
          <div className="auth-brand-panel">
            <div className="auth-brand-content">
              <span className="auth-badge">Welcome Back</span>
              <h1>Sign in to SmartStock</h1>
              <p>
                Access your inventory dashboard, track stock movement, and stay
                on top of supplier communication.
              </p>

              <div className="auth-feature-list">
                <div className="auth-feature-item">
                  📊 View dashboard insights
                </div>
                <div className="auth-feature-item">
                  📦 Manage inventory faster
                </div>
                <div className="auth-feature-item">
                  🔐 Secure business access
                </div>
              </div>
            </div>
          </div>

          <div className="auth-form-panel">
            <div className="auth-card">
              <div className="auth-header">
                <h2>Login</h2>
                <p>Enter your business account details to continue.</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
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

                {error && <p className="error-text">{error}</p>}
                {success && <p className="success-text">{success}</p>}

                <button type="submit" className="auth-btn">
                  Login
                </button>

                <p className="auth-footer">
                  Don&apos;t have an account? <Link to="/register">Register</Link>
                </p>

                <Link
                  to="/"
                  className="auth-btn"
                  style={{ textDecoration: "none", textAlign: "center" }}
                >
                  Go Back to Homepage
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;