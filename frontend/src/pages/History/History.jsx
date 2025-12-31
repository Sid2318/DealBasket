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
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <div className="header-content">
          <h2>📋 Purchase History</h2>
          <p className="subtitle">Track your smart shopping decisions</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛍️</div>
          <h3>No purchases yet!</h3>
          <p>Start shopping and save money with DealBasket</p>
          <button className="shop-btn" onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((purchase) => (
            <div key={purchase._id} className="purchase-card">
              <div className="card-image">
                {purchase.productImage ? (
                  <img src={purchase.productImage} alt={purchase.productName} />
                ) : (
                  <div className="no-image">📦</div>
                )}
                <div className="discount-badge">{purchase.discount}</div>
              </div>

              <div className="card-content">
                <div className="purchase-header">
                  <h3>{purchase.productName}</h3>
                  <span className="date">
                    {formatDate(purchase.purchasedAt)}
                  </span>
                </div>

                <div className="website-info">
                  <span className="website-badge">{purchase.website}</span>
                  <span className="category-badge">{purchase.category}</span>
                </div>

                <div className="purchase-details">
                  <div className="price-row">
                    <span className="original-price">
                      ₹{purchase.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="final-price">
                      ₹{purchase.finalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="savings-row">
                    <span className="savings-label">You Saved</span>
                    <span className="savings-amount">
                      ₹{purchase.savedAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
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
