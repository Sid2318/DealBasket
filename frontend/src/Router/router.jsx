import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/Login/LoginPage";
import SignUpPage from "../pages/Auth/SignUp/SignUpPage";
import ProductCompare from "../pages/Product/ProductCompare";
import History from "../pages/History/History";
import Dashboard from "../pages/Dashboard/Dashboard";
import SubcategoryPage from "../pages/Subcategory/SubcategoryPage";
import App from "../App";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="subcategory/:subcategory" element={<SubcategoryPage />} />
        <Route path="product/:productId" element={<ProductCompare />} />
        <Route path="history" element={<History />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRouter;
