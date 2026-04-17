import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import "./stockHistory.css";

type HistoryItem = {
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

function StockHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/stock-history/my-history");
      setHistory(data.history || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load stock history");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="stock-history-page">
      <div className="stock-history-header">
        <div>
          <p className="stock-history-tag">Inventory Activity</p>
          <h1>Stock History</h1>
          <p className="stock-history-subtitle">
            Track inventory changes, stock removal activity, and quantity updates over time.
          </p>
        </div>
      </div>

      <div className="stock-history-card">
        <div className="stock-history-topbar">
          <div>
            <h2>Recent Activity</h2>
            <p className="stock-history-info">
              This shows the latest stock changes recorded in your business account.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="stock-history-message">Loading stock history...</p>
        ) : error ? (
          <p className="stock-history-error">{error}</p>
        ) : history.length === 0 ? (
          <div className="stock-history-empty">
            <div className="stock-history-empty-icon">📭</div>
            <h3>No stock history yet</h3>
            <p>
              Once you remove or update stock, your activity records will appear here.
            </p>
          </div>
        ) : (
          <div className="stock-history-list">
            {history.map((record) => (
              <div key={record.id} className="stock-history-item">
                <div className="stock-history-item-left">
                  <div className="stock-history-title-row">
                    <h3>{record.Item?.itemName || "Unknown Item"}</h3>
                    <span
                      className={`history-badge ${
                        record.actionType === "OUT"
                          ? "out-badge"
                          : record.actionType === "IN"
                          ? "in-badge"
                          : "update-badge"
                      }`}
                    >
                      {record.actionType}
                    </span>
                  </div>

                  <div className="stock-history-meta-grid">
                    <p>
                      <strong>Changed Quantity:</strong> {record.changedQuantity}
                    </p>
                    <p>
                      <strong>Previous Quantity:</strong> {record.previousQuantity}
                    </p>
                    <p>
                      <strong>New Quantity:</strong> {record.newQuantity}
                    </p>
                    <p>
                      <strong>Note:</strong> {record.note || "No note"}
                    </p>
                  </div>
                </div>

                <div className="stock-history-item-right">
                  <span className="history-date">
                    {new Date(record.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StockHistory;