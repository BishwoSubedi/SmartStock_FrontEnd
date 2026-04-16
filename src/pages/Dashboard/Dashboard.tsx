import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import "./Dashboard.css";

type DashboardStats = {
  totalSections: number;
  totalSuppliers: number;
  totalItems: number;
  lowStockItems: number;
};

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setError("");
        setLoading(true);

        const data = await apiRequest("/dashboard/stats");
        setStats(data.stats);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-welcome">Welcome back</p>
          <h1>{user?.businessName || "SmartStock Dashboard"}</h1>
          <p className="dashboard-subtitle">
            Monitor your business inventory, suppliers, and low-stock activity
            in one place.
          </p>
        </div>
      </div>

      {loading && <p className="dashboard-message">Loading dashboard...</p>}
      {error && <p className="dashboard-error">{error}</p>}

      {!loading && !error && stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🗂️</div>
              <div className="stat-content">
                <p>Total Sections</p>
                <h2>{stats.totalSections}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🤝</div>
              <div className="stat-content">
                <p>Total Suppliers</p>
                <h2>{stats.totalSuppliers}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <p>Total Items</p>
                <h2>{stats.totalItems}</h2>
              </div>
            </div>

            <div className="stat-card low-stock-card">
              <div className="stat-icon">🚨</div>
              <div className="stat-content">
                <p>Low Stock Items</p>
                <h2>{stats.lowStockItems}</h2>
              </div>
            </div>
          </div>

          <div className="dashboard-bottom-grid">
            <div className="dashboard-panel">
              <h3>Inventory Overview</h3>
              <p>
                Your SmartStock dashboard gives you a quick summary of sections,
                suppliers, total inventory items, and low-stock alerts so you
                can take action faster.
              </p>
            </div>

            <div className="dashboard-panel">
              <h3>Quick Insight</h3>
              <p>
                {stats.lowStockItems > 0
                  ? `You currently have ${stats.lowStockItems} low-stock item(s) that may need supplier attention.`
                  : "Great job! No low-stock items need attention right now."}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;