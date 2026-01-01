import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerSeller } from "../../../api/sellerApi";
import "./ShopDetailsPage.scss";

const ShopDetailsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    contactNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    businessType: "individual",
    gstNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerSeller(formData);

      // Update user role in localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      user.role = "seller";
      localStorage.setItem("user", JSON.stringify(user));

      alert("✅ Seller registration successful!");
      navigate("/");
      window.location.reload(); // Refresh to update nav
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shop-details-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1>🏪 Register as Seller</h1>
        <p className="subtitle">Fill in your shop details to start selling</p>
      </div>

      <form className="shop-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Shop Information</h2>

          <div className="form-group">
            <label>Shop Name *</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="Enter your shop name"
              required
            />
          </div>

          <div className="form-group">
            <label>Shop Description</label>
            <textarea
              name="shopDescription"
              value={formData.shopDescription}
              onChange={handleChange}
              placeholder="Describe your business"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Contact Number *</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
              required
            />
          </div>

          <div className="form-group">
            <label>Business Type</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
            >
              <option value="individual">Individual</option>
              <option value="company">Company</option>
            </select>
          </div>

          <div className="form-group">
            <label>GST Number (Optional)</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="Enter GST number"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Address</h2>

          <div className="form-group">
            <label>Street *</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="Street address"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Pincode *</label>
              <input
                type="text"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                required
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                placeholder="Country"
                disabled
              />
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Registering..." : "Register as Seller"}
        </button>
      </form>
    </div>
  );
};

export default ShopDetailsPage;
