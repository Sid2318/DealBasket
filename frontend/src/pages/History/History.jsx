import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./History.scss";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/myhistory");
      setHistory(response.data);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="history-page">
        <div className="loading">Loading purchase history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page">
        <div className="error">{error}</div>
        <button onClick={() => navigate("/login")}>Please Login</button>
      </div>
    );
  }

  return (
    <div className="history-page">
      <button className="back-btn" onClick={() => navigate("/")}>
        Back to Home
      </button>

      <h2>Purchase History</h2>
      <p className="subtitle">Your savings journey</p>

      {history.length === 0 ? (
        <div className="empty-state">
          <p>No purchases yet!</p>
          <button onClick={() => navigate("/")}>Start Shopping</button>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((purchase) => (
            <div key={purchase._id} className="purchase-card">
              <div className="purchase-header">
                <h3>{purchase.productName}</h3>
                <span className="date">{formatDate(purchase.purchasedAt)}</span>
              </div>

              <div className="purchase-details">
                <div className="detail-row">
                  <span className="label">Store:</span>
                  <span className="value">{purchase.storeName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Original Price:</span>
                  <span className="value original">
                    ₹{purchase.originalPrice}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Final Price:</span>
                  <span className="value final">₹{purchase.finalPrice}</span>
                </div>
                <div className="detail-row savings">
                  <span className="label">You Saved:</span>
                  <span className="value">₹{purchase.savedAmount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
