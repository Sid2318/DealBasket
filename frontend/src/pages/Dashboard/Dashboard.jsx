import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./Dashboard.scss";

const Dashboard = () => {
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [averageSavings, setAverageSavings] = useState(0);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total savings
      const savingsResponse = await api.get("/myhistory/total-savings");
      setTotalSavings(savingsResponse.data.totalSavings);
      setTotalSpent(savingsResponse.data.totalSpent);
      setTotalPurchases(savingsResponse.data.totalPurchases);
      setAverageSavings(savingsResponse.data.averageSavings);

      // Fetch recent purchases
      const historyResponse = await api.get("/myhistory");
      setRecentPurchases(historyResponse.data.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <div className="header-content">
          <h2>📊 Savings Dashboard</h2>
          <p className="subtitle">
            Track your smart shopping decisions and savings
          </p>
        </div>
      </div>

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

      <div className="recent-savings">
        <div className="section-header">
          <h3>🎉 Recent Purchases</h3>
          <button className="view-all-btn" onClick={() => navigate("/history")}>
            View All →
          </button>
        </div>
        {recentPurchases.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <p>No purchases yet! Start shopping to see your savings.</p>
          </div>
        ) : (
          <div className="savings-list">
            {recentPurchases.map((purchase) => (
              <div key={purchase._id} className="savings-item">
                <div className="item-image">
                  {purchase.productImage ? (
                    <img
                      src={purchase.productImage}
                      alt={purchase.productName}
                    />
                  ) : (
                    <div className="no-image">📦</div>
                  )}
                </div>
                <div className="item-info">
                  <h4>{purchase.productName}</h4>
                  <div className="item-meta">
                    <span className="website">{purchase.website}</span>
                    <span className="date">
                      {new Date(purchase.purchasedAt).toLocaleDateString(
                        "en-IN",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
                <div className="item-savings">
                  <span className="discount">{purchase.discount} OFF</span>
                  <span className="saved">
                    ₹{purchase.savedAmount.toLocaleString("en-IN")} saved
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
