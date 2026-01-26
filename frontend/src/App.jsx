import Navbar from "./components/Navbar/Navbar";
import "./App.scss";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
    </AuthProvider>
  );
}

export default App;
