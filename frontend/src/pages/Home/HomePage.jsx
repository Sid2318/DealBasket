import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.scss";

import CATEGORY_DATA from "../../data/category.js";
import SUBCATEGORY_IMAGES from "../../data/subcategoryImages.js";
import { searchProducts } from "../../api/productApi.js";

const HomePage = () => {
  const navigate = useNavigate();
  // 'all' is the default selected tab
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mainCategory, setMainCategory] = useState(null); // for when inside 'all'
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setMainCategory(null);
  };

  const handleMainCategoryClick = (cat) => {
    setMainCategory(cat);
  };

  const handleSubcategoryClick = (subcategory) => {
    navigate(`/subcategory/${subcategory}`);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();

    setSearchPerformed(true);
    if (!query) {
      setSearchResults([]);
      setSearchError("Please enter something to search.");
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");
      const response = await searchProducts(query, 1, 12);
      setSearchResults(response.products || []);
    } catch (error) {
      setSearchError(error.response?.data?.message || "Search failed.");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchResultClick = (product) => {
    const productId = product.productId || product._id;
    const isSellerProduct =
      product.sourceType === "seller" || product.website === "Seller";

    if (isSellerProduct && productId) {
      navigate(`/shoporder/${productId}`);
      return;
    }

    if (product.link) {
      window.open(product.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>🛍️ Welcome to DealBasket</h1>
          <p className="hero-subtitle">
            Compare prices and save money on your favorite products!
          </p>
        </div>
      </div>

      <section className="search-section">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search products, categories, websites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" disabled={searchLoading}>
            {searchLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {searchError && <p className="search-error">{searchError}</p>}

        {searchPerformed && !searchLoading && !searchError && (
          <div className="search-results">
            <h3>Search Results</h3>

            {searchResults.length === 0 ? (
              <p className="no-results">No matching products found.</p>
            ) : (
              <div className="search-results-grid">
                {searchResults.map((product) => (
                  <article
                    key={`${product.sourceType || "product"}-${product.productId || product._id}`}
                    className="search-result-card"
                    onClick={() => handleSearchResultClick(product)}
                  >
                    <img src={product.image} alt={product.name} />
                    <div className="result-content">
                      <h4>{product.name}</h4>
                      <p className="result-meta">
                        {product.shopName && product.sourceType === "seller"
                          ? product.shopName
                          : product.website}
                      </p>
                      <p className="result-price">{product.discountedPrice}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <div className="categories-section">
        <h2 className="section-title">Category</h2>
        <div className="categories-container">
          {Object.keys(CATEGORY_DATA).map((cat) => (
            <button
              key={cat}
              className={`category-btn${
                selectedCategory === cat ? " active" : ""
              }`}
              onClick={() => handleCategoryClick(cat)}
            >
              <span className="category-icon">
                {cat === "all" && "🌐"}
                {cat === "electronics" && "📱"}
                {cat === "fashion" && "👗"}
                {cat === "lifestyle" && "🏠"}
                {cat === "bestDeals" && "🔥"}
              </span>
              <span className="category-text">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* If 'all' is selected, show main categories as boxes */}

      {selectedCategory === "all" && !mainCategory && (
        <div className="subcategory-block">
          {/* <h2 className="block-title">Explore All Categories</h2> */}
          <div className="subcategories-container">
            {CATEGORY_DATA.all.map((cat) => (
              <div
                className="subcategory-box"
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setMainCategory(null);
                }}
              >
                <div className="subcategory-image-wrapper">
                  <img
                    src={
                      SUBCATEGORY_IMAGES[cat] ||
                      "https://img.icons8.com/fluency/96/image.png"
                    }
                    alt={cat}
                    onError={(e) => {
                      e.target.src =
                        "https://img.icons8.com/fluency/96/image.png";
                    }}
                  />
                  <div className="image-overlay"></div>
                </div>
                <span className="subcategory-name">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If a main category is selected from 'all', show its subcategories */}
      {selectedCategory === "all" && mainCategory && (
        <div className="subcategory-block">
          <button className="back-btn" onClick={() => setMainCategory(null)}>
            ← Back to Categories
          </button>
          <h2 className="block-title">
            {mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1)}{" "}
            Collection
          </h2>
          <div className="subcategories-container">
            {CATEGORY_DATA[mainCategory].map((subcat) => (
              <div
                className="subcategory-box"
                key={subcat}
                onClick={() => handleSubcategoryClick(subcat)}
              >
                <div className="subcategory-image-wrapper">
                  <img
                    src={
                      SUBCATEGORY_IMAGES[subcat] ||
                      "https://img.icons8.com/fluency/96/image.png"
                    }
                    alt={subcat}
                    onError={(e) => {
                      e.target.src =
                        "https://img.icons8.com/fluency/96/image.png";
                    }}
                  />
                  <div className="image-overlay"></div>
                </div>
                <span className="subcategory-name">
                  {subcat.charAt(0).toUpperCase() + subcat.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If a specific category tab is selected (not 'all'), show its subcategories */}
      {selectedCategory !== "all" && (
        <div className="subcategory-block">
          {/* <h2 className="block-title">
            {selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)}{" "}
            Collection
          </h2> */}
          <div className="subcategories-container">
            {CATEGORY_DATA[selectedCategory].map((subcat) => (
              <div
                className="subcategory-box"
                key={subcat}
                onClick={() => handleSubcategoryClick(subcat)}
              >
                <div className="subcategory-image-wrapper">
                  <img
                    src={
                      SUBCATEGORY_IMAGES[subcat] ||
                      "https://img.icons8.com/fluency/96/image.png"
                    }
                    alt={subcat}
                    onError={(e) => {
                      e.target.src =
                        "https://img.icons8.com/fluency/96/image.png";
                    }}
                  />
                  <div className="image-overlay"></div>
                </div>
                <span className="subcategory-name">
                  {subcat.charAt(0).toUpperCase() + subcat.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
