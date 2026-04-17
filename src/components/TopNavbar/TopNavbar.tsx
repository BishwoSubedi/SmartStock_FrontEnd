import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import "./TopNavbar.css";

type StoredUser = {
  id: string;
  businessName: string;
  adminName: string;
  email: string;
  role: string;
};

function TopNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  let user: StoredUser | null = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    user = null;
  }

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      localStorage.removeItem("user");
      closeMenu();
      navigate("/login");
    }
  };

  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        <div
          className="top-navbar-brand"
          onClick={() => {
            navigate("/dashboard");
            closeMenu();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/dashboard");
              closeMenu();
            }
          }}
        >
          <div className="brand-icon">S</div>

          <div className="brand-text-wrap">
            <h2>SmartStock</h2>
            <p>{user?.businessName || "Business Account"}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`top-navbar-toggle ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`top-navbar-right ${menuOpen ? "show-menu" : ""}`}>
        <nav className="top-navbar-links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "top-link active-top-link" : "top-link"
            }
            onClick={closeMenu}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/sections"
            className={({ isActive }) =>
              isActive ? "top-link active-top-link" : "top-link"
            }
            onClick={closeMenu}
          >
            Sections
          </NavLink>

          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              isActive ? "top-link active-top-link" : "top-link"
            }
            onClick={closeMenu}
          >
            Suppliers
          </NavLink>

          <NavLink
            to="/items"
            className={({ isActive }) =>
              isActive ? "top-link active-top-link" : "top-link"
            }
            onClick={closeMenu}
          >
            Items
          </NavLink>

          <NavLink
            to="/low-stock"
            className={({ isActive }) =>
              isActive ? "top-link active-top-link" : "top-link"
            }
            onClick={closeMenu}
          >
            Low Stock
          </NavLink>

          <NavLink
            to="/stock-history"
            className={({ isActive }) =>
              isActive ? "top-link active-top-link" : "top-link"
            }
            onClick={closeMenu}
          >
            Stock History
          </NavLink>
        </nav>

        <div className="top-navbar-user-actions">
          <div className="top-user-info">
            <span className="top-user-name">{user?.adminName || "Admin"}</span>
            <span className="top-user-email">{user?.email || "No email"}</span>
          </div>

          <button
            type="button"
            className="top-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;