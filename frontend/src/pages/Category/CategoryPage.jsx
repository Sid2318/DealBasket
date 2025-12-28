import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import "./CategoryPage.scss";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategoryProducts();
  }, [category]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`/api/scrape/category/${category}`);

      if (response.data.success) {
        setProducts(response.data.data.products);
      } else {
        setError("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching category products:", error);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    navigate("/product/compare", { state: { product } });
  };

  if (loading) {
    return (
      <div className="category-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Scraping top products from Amazon, Flipkart, and Myntra...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1>{category} Products</h1>
        <p className="product-count">{products.length} products found</p>
      </div>

      <div className="products-grid">
        {products.map((product, index) => (
          <div
            key={`${product.storeId}-${index}`}
            className="product-card"
            onClick={() => handleProductClick(product)}
          >
            <div className="product-image">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/300x300/667eea/white?text=${category}`;
                  }}
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
              <span className="store-badge">{product.store}</span>
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>

              <div className="price-section">
                <div className="price-row">
                  <span className="current-price">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.discount > 0 && (
                    <span className="discount-badge">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                {product.originalPrice > product.price && (
                  <span className="original-price">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-products">
          <p>No products found in this category</p>
          <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
