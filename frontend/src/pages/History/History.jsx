import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./History.scss";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [averageSavings, setAverageSavings] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const savingsResponse = await api.get("/myhistory/total-savings");
      setTotalSavings(savingsResponse.data.totalSavings);
      setTotalSpent(savingsResponse.data.totalSpent);
      setTotalPurchases(savingsResponse.data.totalPurchases);
      setAverageSavings(savingsResponse.data.averageSavings);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

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
        <Loader />
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
          <h2> My Savings & Purchase History</h2>
          <p className="subtitle">
            Track your smart shopping decisions and savings
          </p>
        </div>
      </div>

      {/* Stats Grid - Savings Features */}
      <div className="stats-grid">
        <div className="stat-card total-savings">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Savings</h3>
            <p className="stat-value">
              ₹{totalSavings.toLocaleString("en-IN")}
            </p>
            <p className="stat-label">Money saved</p>
          </div>
        </div>

        <div className="stat-card total-spent">
          <div className="stat-icon">💳</div>
          <div className="stat-info">
            <h3>Total Spent</h3>
            <p className="stat-value">₹{totalSpent.toLocaleString("en-IN")}</p>
            <p className="stat-label">Amount paid</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-info">
            <h3>Total Purchases</h3>
            <p className="stat-value">{totalPurchases}</p>
            <p className="stat-label">Items bought</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Average Savings</h3>
            <p className="stat-value">
              ₹{averageSavings.toLocaleString("en-IN")}
            </p>
            <p className="stat-label">Per purchase</p>
          </div>
        </div>
      </div>

      {/* Purchase History Section */}
      <div className="history-section">
        <div className="section-header">
          <h3>🎉 All Purchases</h3>
          <span className="count-badge">{history.length} items</span>
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
                    <img
                      src={purchase.productImage}
                      alt={purchase.productName}
                    />
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
                    {/* Show logo if known website, else fallback to badge */}
                    {["Amazon", "amazon"].includes(purchase.website) && (
                      <img
                        src="/images/websites/amazon.png"
                        alt="Amazon"
                        className="website-logo"
                        title="Amazon"
                      />
                    )}
                    {["Flipkart", "flipkart"].includes(purchase.website) && (
                      <img
                        src="/images/websites/flipkart.png"
                        alt="Flipkart"
                        className="website-logo"
                        title="Flipkart"
                      />
                    )}
                    {["BigBasket", "bigbasket"].includes(purchase.website) && (
                      <img
                        src="/images/websites/bigbasket.png"
                        alt="BigBasket"
                        className="website-logo"
                        title="BigBasket"
                      />
                    )}
                    <span className="website-badge" title={purchase.website}>
                      {purchase.website}
                    </span>
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
                  <div className="divider"></div>
                  <div className="review-row">
                    <button
                      className="review-btn"
                      title="Share your feedback about this product"
                      onClick={() => alert("Review feature coming soon!")}
                    >
                      <span className="review-icon">⭐</span> Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
