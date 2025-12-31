import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/productApi";
import "./BestDeals.scss";

const BestDeals = () => {
  const navigate = useNavigate();
  const [bestDeals, setBestDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Website icons mapping
  const websiteIcons = {
    amazon: "/images/websites/amazon.png",
    flipkart: "/images/websites/flipkart.png",
    bigbasket: "/images/websites/bigbasket.png",
  };

  useEffect(() => {
    fetchBestDeals();
  }, []);

  const fetchBestDeals = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();

      // Filter products with valid discounts and sort by discount percentage
      const productsWithDiscounts = data
        .filter((product) => {
          const discount = product.discount;
          return discount && discount !== "0%" && discount !== "null";
        })
        .map((product) => ({
          ...product,
          discountValue: parseInt(product.discount.replace("%", "")) || 0,
        }))
        .sort((a, b) => b.discountValue - a.discountValue)
        .slice(0, 20); // Get top 20 deals

      setBestDeals(productsWithDiscounts);
    } catch (error) {
      console.error("Error fetching best deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    document.getElementById("deals-container").scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    document.getElementById("deals-container").scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="best-deals">
        <h2>🔥 Best Deals Today</h2>
        <div className="loading">Loading amazing deals...</div>
      </div>
    );
  }

  if (bestDeals.length === 0) {
    return null;
  }

  return (
    <div className="best-deals">
      <div className="deals-header">
        <h2>🔥 Best Deals Today</h2>
        <p>Save big with these incredible offers!</p>
      </div>

      <div className="deals-slider">
        <button className="scroll-btn left" onClick={scrollLeft}>
          ‹
        </button>

        <div className="deals-container" id="deals-container">
          {bestDeals.map((product) => (
            <div
              key={product._id}
              className="deal-card"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="deal-badge">{product.discount} OFF</div>

              <div className="deal-image">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="deal-info">
                <div className="deal-website">
                  <img
                    src={
                      websiteIcons[product.website] ||
                      "https://img.icons8.com/color/48/globe.png"
                    }
                    alt={product.website}
                    className="website-icon"
                  />
                  <span>{product.website}</span>
                </div>

                <h3>{product.name}</h3>

                <div className="deal-prices">
                  <span className="discounted-price">
                    {product.discountedPrice}
                  </span>
                  <span className="actual-price">{product.actualPrice}</span>
                </div>

                {product.details && product.details.length > 0 && (
                  <div className="deal-rating">
                    <span className="rating">★ {product.details[0]}</span>
                    <span className="reviews">({product.details[3]})</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="scroll-btn right" onClick={scrollRight}>
          ›
        </button>
      </div>
    </div>
  );
};

export default BestDeals;
