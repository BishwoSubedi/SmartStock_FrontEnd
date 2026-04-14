import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import "../Auth.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Form Data:", formData);
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
                <div className="auth-feature-item">📊 View dashboard insights</div>
                <div className="auth-feature-item">📦 Manage inventory faster</div>
                <div className="auth-feature-item">🔐 Secure business access</div>
              </div>
            </div>
          </div>

          <div className="auth-form-panel">
            <div className="auth-card">
              <div className="auth-header">
                <h2>Login</h2>
                <p>Enter your account details to continue.</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email"
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

                <div className="auth-links-row">
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" className="auth-btn">
                  Login
                </button>

                <p className="auth-footer">
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;