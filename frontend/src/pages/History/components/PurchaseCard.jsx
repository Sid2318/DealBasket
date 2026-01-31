import React from "react";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const PurchaseCard = ({ purchase, index }) => {
  return (
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
          <div className="discount-badge">Save ₹{purchase.savingsAmount}</div>
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
            <span className="category-badge">{purchase.category}</span>
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
              {(purchase.finalPrice || purchase.price || 0).toLocaleString(
                "en-IN",
              )}
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
  );
};

export default PurchaseCard;
