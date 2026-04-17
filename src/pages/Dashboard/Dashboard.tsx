import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import "./Dashboard.css";

type DashboardStats = {
  totalSections: number;
  totalSuppliers: number;
  totalItems: number;
  lowStockItems: number;
};

type LowStockItem = {
  id: string;
  itemName: string;
  quantity: number;
  threshold: number;
};

type ActivityItem = {
  id: string;
  actionType: "IN" | "OUT" | "UPDATE";
  changedQuantity: number;
  previousQuantity: number;
  newQuantity: number;
  note?: string;
  createdAt: string;
  Item?: {
    id: string;
    itemName: string;
  };
};

type StoredUser = {
  businessName?: string;
  adminName?: string;
  email?: string;
};

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const user = useMemo(() => {
    try {
      const rawUser = localStorage.getItem("user");
      return rawUser ? (JSON.parse(rawUser) as StoredUser) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError("");
        setLoading(true);

        const [statsData, lowStockData, historyData] = await Promise.all([
          apiRequest("/dashboard/stats"),
          apiRequest("/dashboard/low-stock"),
          apiRequest("/stock-history/my-history"),
        ]);

        setStats(statsData.stats);
        setLowStockItems((lowStockData.items || []).slice(0, 5));
        setRecentActivity((historyData.history || []).slice(0, 5));
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

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading-card">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error-card">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero-left">
          <p className="dashboard-welcome">Welcome back</p>
          <h1>{user?.businessName || "SmartStock Dashboard"}</h1>
          <p className="dashboard-subtitle">
            Manage your inventory, suppliers, sections, and stock alerts from one
            professional dashboard.
          </p>

          <div className="dashboard-quick-buttons">
            <button
              type="button"
              onClick={() => navigate("/items")}
              className="hero-btn primary"
            >
              Manage Items
            </button>
            <button
              type="button"
              onClick={() => navigate("/low-stock")}
              className="hero-btn secondary"
            >
              View Low Stock
            </button>
          </div>
        </div>

        <div className="dashboard-hero-right">
          <div className="dashboard-user-card">
            <p className="dashboard-user-label">Admin Name</p>
            <h3>{user?.adminName || "Business Admin"}</h3>

            <p className="dashboard-user-label second-label">Business Email</p>
            <span>{user?.email || "No email found"}</span>
          </div>
        </div>
      </section>

      {stats && (
        <section className="stats-grid">
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

          <div className="stat-card danger-card">
            <div className="stat-icon">🚨</div>
            <div className="stat-content">
              <p>Low Stock Items</p>
              <h2>{stats.lowStockItems}</h2>
            </div>
          </div>
        </section>
      )}

      <section className="dashboard-content-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Jump quickly to the most important areas.</p>
            </div>
          </div>

          <div className="quick-action-grid">
            <button
              type="button"
              className="quick-action-card"
              onClick={() => navigate("/sections")}
            >
              <span>🗂️</span>
              <div>
                <h4>Sections</h4>
                <p>Create and manage item categories</p>
              </div>
            </button>

            <button
              type="button"
              className="quick-action-card"
              onClick={() => navigate("/suppliers")}
            >
              <span>🤝</span>
              <div>
                <h4>Suppliers</h4>
                <p>Manage supplier information and contacts</p>
              </div>
            </button>

            <button
              type="button"
              className="quick-action-card"
              onClick={() => navigate("/items")}
            >
              <span>📦</span>
              <div>
                <h4>Items</h4>
                <p>Add and monitor your inventory items</p>
              </div>
            </button>

            <button
              type="button"
              className="quick-action-card"
              onClick={() => navigate("/low-stock")}
            >
              <span>🚨</span>
              <div>
                <h4>Low Stock</h4>
                <p>Review urgent stock warnings instantly</p>
              </div>
            </button>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Low Stock Preview</h3>
              <p>Top low-stock items that may need attention.</p>
            </div>

            <button
              type="button"
              className="view-all-btn"
              onClick={() => navigate("/low-stock")}
            >
              View All
            </button>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="empty-preview">
              <div className="empty-preview-icon">✅</div>
              <h4>No low-stock items</h4>
              <p>Your inventory levels are looking healthy right now.</p>
            </div>
          ) : (
            <div className="preview-list">
              {lowStockItems.map((item) => (
                <div key={item.id} className="preview-item">
                  <div>
                    <h4>{item.itemName}</h4>
                    <p>
                      Quantity: <strong>{item.quantity}</strong> / Threshold:{" "}
                      <strong>{item.threshold}</strong>
                    </p>
                  </div>

                  <span className="preview-badge">Alert</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-activity-section">
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Activity</h3>
              <p>Latest inventory movements from your stock history.</p>
            </div>

            <button
              type="button"
              className="view-all-btn"
              onClick={() => navigate("/stock-history")}
            >
              View History
            </button>
          </div>

          {recentActivity.length === 0 ? (
            <div className="empty-preview">
              <div className="empty-preview-icon">🕘</div>
              <h4>No recent activity</h4>
              <p>Stock movement records will appear here once you start updating stock.</p>
            </div>
          ) : (
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-left">
                    <div className="activity-top-row">
                      <h4>{activity.Item?.itemName || "Unknown Item"}</h4>
                      <span
                        className={`activity-badge ${
                          activity.actionType === "OUT"
                            ? "activity-out"
                            : activity.actionType === "IN"
                            ? "activity-in"
                            : "activity-update"
                        }`}
                      >
                        {activity.actionType}
                      </span>
                    </div>

                    <p className="activity-note">
                      {activity.note || "Inventory updated"}
                    </p>

                    <div className="activity-meta">
                      <span>Changed: {activity.changedQuantity}</span>
                      <span>
                        {activity.previousQuantity} → {activity.newQuantity}
                      </span>
                    </div>
                  </div>

                  <div className="activity-right">
                    {new Date(activity.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;