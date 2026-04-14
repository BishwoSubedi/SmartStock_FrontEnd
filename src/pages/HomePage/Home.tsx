import "./Home.css";
import PublicLayout from "../../layouts/PublicLayout";
import heroImage from "../../assets/hero/heroImage.png";

function Home() {
  return (
    <PublicLayout>
      <div className="home">

        {/* HERO SECTION*/}
        <section className="hero">
          <div className="hero-left">

            <h1>SmartStock Inventory Management System </h1>

            <p>
              Manage your entire inventory ecosystem with real-time tracking,
              supplier management, and automated low-stock alerts — all in one
              intuitive dashboard.
            </p>

            <div className="buttons">
              <a href="/register" className="btn-primary">Register Your Business</a>
              <a href="#how-it-works" className="btn-secondary">How it works</a>
            </div>
          </div>

          <div className="hero-right">
            <img src={heroImage} alt="SmartStock dashboard preview" />
          </div>
        </section>

        {/* HOW IT WORKS SECTION WITH CLEAN CARDS */}
        <section className="how-it-works" id="how-it-works">
          <h2>How SmartStock Works</h2>
          <p className="how-subtitle">
            A simple onboarding flow designed for real businesses.
          </p>

          <div className="cards-container">

            <div className="work-card">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1040/1040230.png"
                alt="Register Business"
              />
              <h3>🏢 Register your business</h3>
              <p>
                Enter business name, email, password & address to create your organization.
              </p>
            </div>

            <div className="work-card">
              <img
                src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                alt="Verify Email"
              />
              <h3>📩 Verify your email</h3>
              <p>
                Receive an OTP in your inbox and confirm your account instantly.
              </p>
            </div>

            <div className="work-card">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
                alt="Login Dashboard"
              />
              <h3>🔐 Log in & access dashboard</h3>
              <p>
                Use your verified email & password to access your business workspace.
              </p>
            </div>

            <div className="work-card">
              <img
                src="https://cdn-icons-png.flaticon.com/512/679/679922.png"
                alt="Setup Inventory"
              />
              <h3>📦 Set up inventory</h3>
              <p>
                Add sections, suppliers & items with quantity and category details.
              </p>
            </div>

            <div className="work-card">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png"
                alt="Manage Stock"
              />
              <h3>📊 Manage stock</h3>
              <p>
                Track stock in real‑time and receive automatic low‑stock alerts.
              </p>
            </div>

          </div>
        </section>
        {/* FEATURES SECTION */}
        <section className="features" id="features">
          <h2>Powerful Features</h2>
          <p className="section-subtitle">
            Everything you need to manage inventory with confidence.
          </p>

          <div className="features-grid">

            <div className="feature-card">
              <span className="feature-icon">📦</span>
              <h3>Smart Stock Tracking</h3>
              <p>Track stock levels in real‑time with automatic updates.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🔔</span>
              <h3>Low‑Stock Alerts</h3>
              <p>Get instant alerts when items fall below safe quantity.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🤝</span>
              <h3>Supplier Management</h3>
              <p>Store supplier details and send automated restock emails.</p>
            </div>

          

            <div className="feature-card">
              <span className="feature-icon">🏷️</span>
              <h3>Category & Section Control</h3>
              <p>Organize items by sections for faster navigation.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">👥</span>
              <h3>Multi‑User Access</h3>
              <p>Invite team members with role‑based permissions.</p>
            </div>

          </div>
        </section>
        {/* SECURITY SECTION */}
        <section className="security" id="security">
          <h2>Security You Can Trust</h2>
          <p className="section-subtitle">
            Your business data is protected with enterprise‑grade security.
          </p>

          <div className="security-grid">

            <div className="security-card">
              <span className="security-icon">🔐</span>
              <h3>Encrypted Data</h3>
              <p>All sensitive data is encrypted at rest and in transit.</p>
            </div>

            <div className="security-card">
              <span className="security-icon">🛡️</span>
              <h3>Secure Authentication</h3>
              <p>OTP verification and hashed passwords ensure safe access.</p>
            </div>

            <div className="security-card">
              <span className="security-icon">🏢</span>
              <h3>Isolated Tenants</h3>
              <p>Each business has its own isolated database workspace.</p>
            </div>

            <div className="security-card">
              <span className="security-icon">📁</span>
              <h3>Daily Backups</h3>
              <p>Your data is backed up automatically every 24 hours.</p>
            </div>

          </div>
        </section>

      </div>
    </PublicLayout>
  );
}

export default Home;
