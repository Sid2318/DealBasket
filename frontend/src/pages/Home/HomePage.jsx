import React, { useState } from "react";
import "./HomePage.scss";

import CATEGORY_DATA from "../../data/category.js";
import SUBCATEGORY_IMAGES from "../../data/subcategoryImages.js";

const HomePage = () => {
  // 'all' is the default selected tab
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mainCategory, setMainCategory] = useState(null); // for when inside 'all'

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setMainCategory(null);
  };

  const handleMainCategoryClick = (cat) => {
    setMainCategory(cat);
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to DealBasket</h1>
        <p>Compare prices and save money on your favorite products!</p>
      </div>

      <div className="categories-section">
        <div className="categories-container">
          {Object.keys(CATEGORY_DATA).map((cat) => (
            <button
              key={cat}
              className={`category-btn${
                selectedCategory === cat ? " active" : ""
              }`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* If 'all' is selected, show main categories as boxes */}

      {selectedCategory === "all" && !mainCategory && (
        <div className="subcategory-block">
          <h2>All Categories</h2>
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
          <button
            className="category-btn"
            style={{ marginBottom: 16 }}
            onClick={() => setMainCategory(null)}
          >
            ← Back
          </button>
          <h2>
            {mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1)}{" "}
            Subcategories
          </h2>
          <div className="subcategories-container">
            {CATEGORY_DATA[mainCategory].map((subcat) => (
              <div className="subcategory-box" key={subcat}>
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
          <h2>
            {selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)}{" "}
            Subcategories
          </h2>
          <div className="subcategories-container">
            {CATEGORY_DATA[selectedCategory].map((subcat) => (
              <div className="subcategory-box" key={subcat}>
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
