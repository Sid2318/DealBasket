import React from "react";
import PurchaseCard from "./PurchaseCard";
import EmptyState from "./EmptyState";

const HistoryGrid = ({ history, loading }) => {
  if (loading) {
    return (
      <div className="history-section">
        <div className="loading-state">Loading your purchase history...</div>
      </div>
    );
  }

  return (
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
        <EmptyState />
      ) : (
        <div className="history-grid">
          {history.map((purchase, index) => (
            <PurchaseCard
              key={purchase._id || index}
              purchase={purchase}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryGrid;
