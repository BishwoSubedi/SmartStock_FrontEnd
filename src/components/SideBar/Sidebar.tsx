import { NavLink, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import "./Sidebar.css";

type StoredUser = {
  id: string;
  businessName: string;
  adminName: string;
  email: string;
  role: string;
};

type SidebarProps = {
  onClose?: () => void;
};

function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();

  const user: StoredUser | null = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });

      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleMobileClose = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-mobile-top">
          <div className="sidebar-logo-box">
            <div className="sidebar-logo-icon">S</div>
            <div>
              <h2 className="sidebar-logo-text">SmartStock</h2>
              <p className="sidebar-logo-subtext">Inventory SaaS</p>
            </div>
          </div>

          <button className="sidebar-close-btn" onClick={handleMobileClose}>
            ✕
          </button>
        </div>

        <div className="sidebar-business-card">
          <p className="sidebar-business-label">Business Account</p>
          <h3 className="sidebar-business-name">
            {user?.businessName || "SmartStock User"}
          </h3>
          <p className="sidebar-business-email">{user?.email || "No email"}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active-link" : "sidebar-link"
          }
          onClick={handleMobileClose}
        >
          <span className="sidebar-link-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/sections"
          className={({ isActive }) =>
            isActive ? "sidebar-link active-link" : "sidebar-link"
          }
          onClick={handleMobileClose}
        >
          <span className="sidebar-link-icon">🗂️</span>
          <span>Sections</span>
        </NavLink>

        <NavLink
          to="/suppliers"
          className={({ isActive }) =>
            isActive ? "sidebar-link active-link" : "sidebar-link"
          }
          onClick={handleMobileClose}
        >
          <span className="sidebar-link-icon">🤝</span>
          <span>Suppliers</span>
        </NavLink>

        <NavLink
          to="/items"
          className={({ isActive }) =>
            isActive ? "sidebar-link active-link" : "sidebar-link"
          }
          onClick={handleMobileClose}
        >
          <span className="sidebar-link-icon">📦</span>
          <span>Items</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;