import React from "react";
import StatCard from "./StatCard";

const StatsGrid = ({
  totalSavings,
  totalSpent,
  totalPurchases,
  averageSavings,
}) => {
  return (
    <div className="stats-grid">
      <StatCard
        icon="💰"
        title="Total Savings"
        value={`₹${totalSavings.toLocaleString("en-IN")}`}
        label="Money saved on deals"
        className="total-savings"
      />

      <StatCard
        icon="🛒"
        title="Total Spent"
        value={`₹${totalSpent.toLocaleString("en-IN")}`}
        label="Amount spent shopping"
        className="total-spent"
      />

      <StatCard
        icon="📦"
        title="Total Purchases"
        value={totalPurchases}
        label="Items purchased"
      />

      <StatCard
        icon="📊"
        title="Average Savings"
        value={`₹${averageSavings.toLocaleString("en-IN")}`}
        label="Per purchase"
      />
    </div>
  );
};

export default StatsGrid;
