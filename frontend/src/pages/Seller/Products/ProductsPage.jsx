import React, { useState, useEffect } from "react";
import CATEGORY_DATA from "../../../data/category";
import { useNavigate } from "react-router-dom";
import {
  getSellerProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../../api/sellerApi";
import "./ProductsPage.scss";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "electronics",
    subcategory: "",
    image: null, // file object
    quantity: "",
    actualPrice: "",
    discountedPrice: "",
    discount: "",
    details: "",
    link: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [subcategories, setSubcategories] = useState(
    CATEGORY_DATA["electronics"] || []
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getSellerProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(file ? URL.createObjectURL(file) : "");
    } else if (name === "category") {
      setFormData({ ...formData, category: value, subcategory: "" });
      setSubcategories(CATEGORY_DATA[value] || []);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert details string to array
      const productData = {
        ...formData,
        details: formData.details
          ? formData.details.split(",").map((d) => d.trim())
          : [],
      };

      // Handle image upload (convert to base64 for demo, or use FormData for real API)
      if (formData.image && typeof formData.image !== "string") {
        const reader = new FileReader();
        reader.onloadend = async () => {
          productData.image = reader.result;
          await submitProduct(productData);
        };
        reader.readAsDataURL(formData.image);
        return;
      } else {
        await submitProduct(productData);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const submitProduct = async (productData) => {
    if (editingProduct) {
      await updateProduct(editingProduct._id, productData);
      alert("✅ Product updated successfully!");
    } else {
      await addProduct(productData);
      alert("✅ Product added successfully!");
    }
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      image: product.image || null,
      quantity: product.quantity || "",
      actualPrice: product.actualPrice,
      discountedPrice: product.discountedPrice,
      discount: product.discount,
      details: product.details?.join(", ") || "",
      link: product.link || "",
    });
    setImagePreview(product.image || "");
    setSubcategories(CATEGORY_DATA[product.category] || []);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        alert("✅ Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        alert(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "electronics",
      subcategory: "",
      image: null,
      quantity: "",
      actualPrice: "",
      discountedPrice: "",
      discount: "",
      details: "",
      link: "",
    });
    setImagePreview("");
    setSubcategories(CATEGORY_DATA["electronics"] || []);
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>📦 Manage Products</h1>
        <button
          className="add-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
            resetForm();
          }}
        >
          {showForm ? "✕ Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity/Size</label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 1kg, 500g, 2L"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Image *</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required={!editingProduct}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: 120, marginTop: 8 }}
              />
            )}
          </div>

          <div className="form-group">
            <label>Product Details (comma-separated)</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="e.g., High quality, Long lasting, Best price"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Product Link (Optional)</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Link to product page or contact"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {Object.keys(CATEGORY_DATA)
                  .filter((cat) => cat !== "all")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subcategory *</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                required
                disabled={!subcategories.length}
              >
                <option value="">Select subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub.charAt(0).toUpperCase() + sub.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Actual Price (₹) *</label>
              <input
                type="text"
                name="actualPrice"
                value={formData.actualPrice}
                onChange={handleChange}
                placeholder="Original price"
                required
              />
            </div>

            <div className="form-group">
              <label>Discounted Price (₹) *</label>
              <input
                type="text"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                placeholder="Selling price"
                required
              />
            </div>

            <div className="form-group">
              <label>Discount *</label>
              <input
                type="text"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="e.g., 20% off"
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </form>
      )}

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products yet</h3>
            <p>Click "Add Product" to start selling</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ maxWidth: 120, maxHeight: 120 }}
                  />
                ) : (
                  <div className="no-image">📦</div>
                )}
              </div>

              <div className="product-header">
                <h3>{product.name}</h3>
              </div>

              {product.quantity && (
                <p className="quantity">Quantity: {product.quantity}</p>
              )}

              {product.details && product.details.length > 0 && (
                <div className="details">
                  {product.details.slice(0, 3).map((detail, idx) => (
                    <span key={idx} className="detail-tag">
                      {detail}
                    </span>
                  ))}
                </div>
              )}

              <div className="product-meta">
                <span className="category">{product.category}</span>
                <span className="subcategory">{product.subcategory}</span>
              </div>

              <div className="price-row">
                <span className="original-price">₹{product.actualPrice}</span>
                <span className="discounted-price">
                  ₹{product.discountedPrice}
                </span>
                <span className="discount-badge">{product.discount}</span>
              </div>

              <div className="stats-row">
                <div className="stat">
                  <span className="label">Actual Price:</span>
                  <span className="value">₹{product.actualPrice}</span>
                </div>
                <div className="stat">
                  <span className="label">Discount:</span>
                  <span className="value">{product.discount}</span>
                </div>
              </div>

              <div className="actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(product)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
