import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/Login/LoginPage";
import SignUpPage from "../pages/Auth/SignUp/SignUpPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPassword/ResetPasswordPage";
import History from "../pages/History/History";
import SubcategoryPage from "../pages/Subcategory/SubcategoryPage";
import ShopDetailsPage from "../pages/Seller/ShopDetails/ShopDetailsPage";
import ShopOrder from "../pages/Seller/ShopOrder/ShopOrder";
import ProductsPage from "../pages/Seller/Products/ProductsPage";
import StatsPage from "../pages/Seller/Stats/StatsPage";
import App from "../App";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="subcategory/:subcategory" element={<SubcategoryPage />} />
        <Route path="history" element={<History />} />

        {/* Seller Routes */}
        <Route path="seller/register" element={<ShopDetailsPage />} />
        <Route path="seller/products" element={<ProductsPage />} />
        <Route path="seller/stats" element={<StatsPage />} />
        <Route path="shoporder/:productId" element={<ShopOrder />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRouter;
