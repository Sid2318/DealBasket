import React, { useState, useEffect } from "react";
import { getSellerStats, getSellerSalesStats } from "../../../api/sellerApi";
import "./StatsPage.scss";

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [salesStats, setSalesStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [data, sales] = await Promise.all([
        getSellerStats(),
        getSellerSalesStats(),
      ]);
      setStats(data);
      setSalesStats(sales);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stats-page">
        <div className="loading">Loading stats...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-page">
        <div className="error">Failed to load stats</div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="page-header">
        <h1>📊 Seller Statistics</h1>
        <p className="subtitle">Track your performance and sales</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
            <p className="stat-label">Products listed</p>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="stat-label">Potential earnings</p>
          </div>
        </div>

        <div className="stat-card shop">
          <div className="stat-icon">🏪</div>
          <div className="stat-info">
            <h3>Shop Name</h3>
            <p className="stat-value">{stats.shopName}</p>
            <p className="stat-label">
              {stats.isVerified ? "✅ Verified" : "⏳ Pending"}
            </p>
          </div>
        </div>
      </div>

      <div className="top-products-section">
        <h2>🏆 Your Products</h2>

        {stats.topProducts.length === 0 ? (
          <div className="empty-state">
            <p>No products added yet</p>
          </div>
        ) : (
          <div className="top-products-list">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="rank">{index + 1}</div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <div className="product-stats">
                    <span className="stat">
                      <span className="label">Actual Price:</span>
                      <span className="value">₹{product.actualPrice}</span>
                    </span>
                    <span className="stat">
                      <span className="label">Selling Price:</span>
                      <span className="value">₹{product.discountedPrice}</span>
                    </span>
                    <span className="stat">
                      <span className="label">Discount:</span>
                      <span className="value">{product.discount}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {salesStats && (
        <div className="sales-stats-section">
          <h2>🛒 Sales Stats</h2>
          <div className="sales-summary-row">
            <div className="sales-summary-card">
              <div className="summary-label">Total Sold</div>
              <div className="summary-value">{salesStats.totalSold}</div>
            </div>
            <div className="sales-summary-card">
              <div className="summary-label">Total Earned</div>
              <div className="summary-value">₹{salesStats.totalEarned}</div>
            </div>
          </div>
          <div className="sales-product-list">
            <h3>Product-wise Sales</h3>
            {salesStats.productSales.length === 0 ? (
              <div className="empty-state">No sales yet</div>
            ) : (
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity Sold</th>
                    <th>Money Earned</th>
                    <th>Buyers (Email)</th>
                  </tr>
                </thead>
                <tbody>
                  {salesStats.productSales.map((prod, idx) => (
                    <tr key={idx}>
                      <td>{prod.name}</td>
                      <td>{prod.count}</td>
                      <td>₹{prod.earned}</td>
                      <td>
                        {Array.isArray(prod.buyers)
                          ? Array.from(
                              new Set(
                                prod.buyers.map((buyer) => buyer.email || buyer)
                              )
                            ).join(", ")
                          : prod.buyers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
