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

      </div>
    </PublicLayout>
  );
}

export default Home;
