import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductsBySubcategory } from "../../api/productApi";
import "./SubcategoryPage.scss";

const SubcategoryPage = () => {
  const { subcategory } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Website icons mapping - using local images
  const websiteIcons = {
    amazon: "/images/websites/amazon.png",
    flipkart: "/images/websites/flipkart.png",
    bigbasket: "/images/websites/bigbasket.png",
  };

  useEffect(() => {
    fetchProducts();
  }, [subcategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsBySubcategory(subcategory);
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="subcategory-page">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subcategory-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="subcategory-page">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>{subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}</h1>
        <p>{products.length} products found</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div
            key={product._id}
            className="product-card"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              {product.discount !== "0%" && (
                <span className="discount-badge">{product.discount} OFF</span>
              )}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <div className="product-source">
                <img
                  src={
                    websiteIcons[product.website] ||
                    "https://img.icons8.com/color/48/globe.png"
                  }
                  alt={product.website}
                  className="website-icon"
                />
                <span className="website">{product.website}</span>
              </div>
              <div className="product-prices">
                <span className="discounted-price">
                  {product.discountedPrice}
                </span>
                {product.actualPrice !== product.discountedPrice && (
                  <span className="actual-price">{product.actualPrice}</span>
                )}
              </div>
              {product.details && product.details.length > 0 && (
                <div className="product-rating">
                  <span className="rating">{product.details[0]}</span>
                  <span className="reviews">({product.details[3]})</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubcategoryPage;
