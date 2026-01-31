import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import "./History.scss";

// Import components
import HistoryHeader from "./components/HistoryHeader";
import StatsGrid from "./components/StatsGrid";
import HistoryGrid from "./components/HistoryGrid";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

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

  const handleRetry = () => {
    setError("");
    setLoading(true);
    fetchHistory();
    fetchDashboardData();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="history-page">
      <HistoryHeader />

      <StatsGrid
        totalSavings={totalSavings}
        totalSpent={totalSpent}
        totalPurchases={totalPurchases}
        averageSavings={averageSavings}
      />

      <HistoryGrid history={history} loading={false} />
    </div>
  );
};

export default History;

// export default History;
