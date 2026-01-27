import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
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
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      setError("Please login to view your history");
      navigate("/login");
      return;
    }

    console.log("History component mounted, starting fetch...");
    fetchHistory();
    fetchDashboardData();
  }, [isLoggedIn, authLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      const savingsResponse = await api.get("/myhistory/total-savings");
      setTotalSavings(savingsResponse.data.totalSavings);
      setTotalSpent(savingsResponse.data.totalSpent);
      setTotalPurchases(savingsResponse.data.totalPurchases);
      setAverageSavings(savingsResponse.data.averageSavings);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      if (error.response?.status === 401) {
        setError("Please login to view your history");
        navigate("/login");
      }
    }
  };

  const fetchHistory = async (page = 1) => {
    try {
      const response = await api.get(`/myhistory?page=${page}&limit=10`);
      if (response.data.history) {
        // Handle paginated response
        setHistory(response.data.history);
      } else {
        // Handle direct array response (fallback)
        setHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      setError(error.response?.data?.message || "Failed to load history");
      if (error.response?.status === 401) {
        navigate("/login");
      }
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
        <h2>Loading History...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page">
        <div className="error">Error: {error}</div>
        <button onClick={() => navigate("/login")}>Please Login</button>
      </div>
    );
  }

  return (
    <div className="history-page">
      {/* Page Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="header-content">
          <h2>Purchase History</h2>
          <p className="subtitle">Track your savings and previous purchases</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card total-savings">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Savings</h3>
            <div className="stat-value">
              ₹{totalSavings.toLocaleString("en-IN")}
            </div>
            <p className="stat-label">Money saved on deals</p>
          </div>
        </div>

        <div className="stat-card total-spent">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <h3>Total Spent</h3>
            <div className="stat-value">
              ₹{totalSpent.toLocaleString("en-IN")}
            </div>
            <p className="stat-label">Amount spent shopping</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Purchases</h3>
            <div className="stat-value">{totalPurchases}</div>
            <p className="stat-label">Items purchased</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Average Savings</h3>
            <div className="stat-value">
              ₹{averageSavings.toLocaleString("en-IN")}
            </div>
            <p className="stat-label">Per purchase</p>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="history-section">
        <div className="section-header">
          <h3>Your Purchase History</h3>
          {history.length > 0 && (
            <div className="count-badge">
              {history.length} Purchase{history.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛍️</div>
            <h3>No Purchase History</h3>
            <p>Start shopping to see your purchase history and savings!</p>
            <button className="shop-btn" onClick={() => navigate("/")}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="history-grid">
            {history.map((purchase, index) => (
              <div key={purchase._id || index} className="purchase-card">
                {/* Product Image */}
                <div className="card-image">
                  {purchase.productImage ? (
                    <img
                      src={purchase.productImage}
                      alt={purchase.productName}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <div className="no-image">📷</div>
                  )}
                  <div className="no-image" style={{ display: "none" }}>
                    📷
                  </div>

                  {purchase.savingsAmount > 0 && (
                    <div className="discount-badge">
                      Save ₹{purchase.savingsAmount}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="card-content">
                  {/* Product Info */}
                  <div className="purchase-header">
                    <h3>{purchase.productName || "Product Name"}</h3>
                    <div className="date">
                      {formatDate(purchase.purchaseDate || purchase.createdAt)}
                    </div>
                  </div>

                  {/* Website & Category Info */}
                  <div className="website-info">
                    <span className="website-badge">
                      {purchase.website || "Online Store"}
                    </span>
                    {purchase.category && (
                      <span className="category-badge">
                        {purchase.category}
                      </span>
                    )}
                  </div>

                  {/* Price Details */}
                  <div className="purchase-details">
                    <div className="price-row">
                      {purchase.originalPrice &&
                        purchase.originalPrice > purchase.finalPrice && (
                          <span className="original-price">
                            ₹{purchase.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      <span className="final-price">
                        ₹
                        {(
                          purchase.finalPrice ||
                          purchase.price ||
                          0
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {purchase.savingsAmount > 0 && (
                      <div className="savings-row">
                        <span className="savings-label">You Saved:</span>
                        <span className="savings-amount">
                          ₹{purchase.savingsAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="review-row">
                    <button
                      className="review-btn"
                      onClick={() => {
                        if (purchase.productUrl) {
                          window.open(purchase.productUrl, "_blank");
                        }
                      }}
                    >
                      <span className="review-icon">⭐</span>
                      View Product
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
