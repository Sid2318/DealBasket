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
      <h1>Purchase History</h1>
      <p>Debug: Component is rendering</p>
      <p>History length: {history.length}</p>
      <p>Total Savings: ₹{totalSavings}</p>

      {history.length === 0 ? (
        <p>No purchase history found</p>
      ) : (
        <div>
          <p>Found {history.length} purchases</p>
        </div>
      )}
    </div>
  );
};

export default History;
