import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./HomePage.scss";

const HomePage = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [categories, setCategories] = useState([
    "Electronics",
    "Fashion",
    "Grocery",
    "Beauty",
    "Lifestyle",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [lastScraped, setLastScraped] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeProducts();

    // Refresh every 5 minutes
    const interval = setInterval(fetchHomeProducts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchHomeProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/scrape/home/products");

      if (response.data.success && response.data.data.categories) {
        setProductsByCategory(response.data.data.categories);
        setLastScraped(response.data.data.lastScraped);
      }
    } catch (error) {
      console.error("Failed to fetch home products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    navigate("/product/compare", { state: { product } });
  };

  const handleCategoryClick = (category) => {
    if (category === "All") {
      setSelectedCategory("All");
    } else {
      // Navigate to category page for detailed view
      navigate(`/category/${category}`);
    }
  };

  const getAllProducts = () => {
    const allProducts = [];
    Object.keys(productsByCategory).forEach((category) => {
      if (productsByCategory[category]) {
        productsByCategory[category].forEach((product) => {
          allProducts.push({ ...product, category });
        });
      }
    });
    return allProducts;
  };

  const getFilteredProducts = () => {
    let products =
      selectedCategory === "All"
        ? getAllProducts()
        : (productsByCategory[selectedCategory] || []).map((p) => ({
            ...p,
            category: selectedCategory,
          }));

    if (searchTerm) {
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return products;
  };

  const filteredProducts = getFilteredProducts();

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to DealBasket</h1>
        <p>Compare prices and save money on your favorite products!</p>
        {lastScraped && (
          <p className="last-updated">
            Last updated: {new Date(lastScraped).toLocaleString()}
          </p>
        )}
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="categories-section">
        <div className="categories-container">
          <button
            className={`category-btn ${
              selectedCategory === "All" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("All")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>
              No products available yet. The scraper will populate products
              automatically.
            </p>
            <p className="hint">Products are scraped every 6 hours.</p>
          </div>
        ) : (
          filteredProducts.map((product, index) => (
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
                      e.target.src = `https://placehold.co/300x300/667eea/white?text=${product.category}`;
                    }}
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <span className="store-badge">{product.store}</span>
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="category-tag">{product.category}</p>

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

                <button className="compare-btn">Compare Prices</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
