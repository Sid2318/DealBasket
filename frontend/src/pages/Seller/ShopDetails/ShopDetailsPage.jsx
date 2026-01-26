import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerSeller } from "../../../api/sellerApi";
import { useAuth } from "../../../hooks/useAuth";
import "./ShopDetailsPage.scss";

const ShopDetailsPage = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();
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
  const [formErrors, setFormErrors] = useState({});

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

  const validate = () => {
    const errors = {};
    if (!formData.shopName) errors.shopName = "Shop name is required";
    if (!formData.contactNumber) {
      errors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      errors.contactNumber = "Enter a valid 10-digit number";
    }
    if (!formData.address.street) errors.street = "Street is required";
    if (!formData.address.city) errors.city = "City is required";
    if (!formData.address.state) errors.state = "State is required";
    if (!formData.address.pincode) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.address.pincode)) {
      errors.pincode = "Enter a valid 6-digit pincode";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);

    try {
      await registerSeller(formData);

      // Refresh user data to get updated role
      await refreshUserData();

      alert("✅ Seller registration successful!");
      navigate("/");
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
            {formErrors.shopName && (
              <div className="error-message">{formErrors.shopName}</div>
            )}
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
            {formErrors.contactNumber && (
              <div className="error-message">{formErrors.contactNumber}</div>
            )}
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
            {formErrors.street && (
              <div className="error-message">{formErrors.street}</div>
            )}
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
              {formErrors.city && (
                <div className="error-message">{formErrors.city}</div>
              )}
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
              {formErrors.state && (
                <div className="error-message">{formErrors.state}</div>
              )}
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
              {formErrors.pincode && (
                <div className="error-message">{formErrors.pincode}</div>
              )}
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
