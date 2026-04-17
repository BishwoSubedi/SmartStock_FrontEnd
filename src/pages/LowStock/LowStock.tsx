import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import "./LowStock.css";

type LowStockItem = {
  id: string;
  itemName: string;
  quantity: number;
  price: string;
  threshold: number;
  lowStockEmailSent?: boolean;
  createdAt: string;
  sectionId: string;
  supplierId: string;
};

function LowStock() {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sendingId, setSendingId] = useState<string | null>(null);

  const fetchLowStockItems = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const query = searchValue
        ? `/dashboard/low-stock?search=${encodeURIComponent(searchValue)}`
        : "/dashboard/low-stock";

      const data = await apiRequest(query);
      setItems(data.items || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load low stock items");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockItems();
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchLowStockItems(search);
  };

  const handleSendAlert = async (itemId: string) => {
    try {
      setSendingId(itemId);
      setError("");
      setSuccess("");

      await apiRequest(`/items/send-low-stock-alert/${itemId}`, {
        method: "POST",
      });

      setSuccess("Low stock alert email sent successfully");
      await fetchLowStockItems(search);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send alert");
      }
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="low-stock-page">
      <div className="low-stock-header">
        <div>
          <p className="low-stock-tag">Low Stock Monitor</p>
          <h1>Low Stock Items</h1>
          <p className="low-stock-subtitle">
            Track inventory items that are below their threshold and send manual
            supplier alerts when needed.
          </p>
        </div>
      </div>

      <div className="low-stock-card">
        <div className="low-stock-topbar">
          <div>
            <h2>Attention Required</h2>
            <p className="low-stock-info">
              These items have reached or fallen below the minimum stock threshold.
            </p>
          </div>

          <form onSubmit={handleSearch} className="low-stock-search-form">
            <input
              type="text"
              placeholder="Search low stock items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>

        {error && <p className="low-stock-error">{error}</p>}
        {success && <p className="low-stock-success">{success}</p>}

        {loading ? (
          <p className="low-stock-message">Loading low stock items...</p>
        ) : items.length === 0 ? (
          <div className="low-stock-empty">
            <div className="low-stock-empty-icon">✅</div>
            <h3>No low stock items</h3>
            <p>Everything looks good. Your stock levels are healthy right now.</p>
          </div>
        ) : (
          <div className="low-stock-list">
            {items.map((item) => (
              <div key={item.id} className="low-stock-item-card">
                <div className="low-stock-item-left">
                  <div className="low-stock-title-row">
                    <h3>{item.itemName}</h3>
                    <span className="danger-badge">Low Stock</span>
                  </div>

                  <div className="low-stock-meta-grid">
                    <p>
                      <strong>Current Quantity:</strong> {item.quantity}
                    </p>
                    <p>
                      <strong>Threshold:</strong> {item.threshold}
                    </p>
                    <p>
                      <strong>Price:</strong> £{item.price}
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="low-stock-item-right">
                  <button
                    type="button"
                    className="alert-btn"
                    onClick={() => handleSendAlert(item.id)}
                    disabled={sendingId === item.id}
                  >
                    {sendingId === item.id ? "Sending..." : "Send Alert"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LowStock;