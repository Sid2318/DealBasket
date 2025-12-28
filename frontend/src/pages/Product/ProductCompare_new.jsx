import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./ProductCompare_new.scss";

const ProductCompare = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [similarProducts, setSimilarProducts] = useState({
    amazon: [],
    flipkart: [],
    myntra: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!product) {
      navigate("/");
      return;
    }
    fetchSimilarProducts();
  }, [product]);

  const fetchSimilarProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post("/api/scrape/similar-products", {
        productName: product.name,
      });

      if (response.data.success) {
        setSimilarProducts(response.data.data.stores);
      } else {
        setError("Failed to load similar products");
      }
    } catch (error) {
      console.error("Error fetching similar products:", error);
      setError("Failed to fetch similar products");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (selectedProduct) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !user.id) {
        alert("Please login to make a purchase");
        navigate("/login");
        return;
      }

      // Validate product URL
      if (!selectedProduct.productUrl || selectedProduct.productUrl === "") {
        alert("Product URL not available. Please try another product.");
        return;
      }

      const purchaseData = {
        userId: user.id,
        productName: selectedProduct.name,
        storeName: selectedProduct.store,
        storeId: selectedProduct.storeId,
        originalPrice: selectedProduct.originalPrice,
        finalPrice: selectedProduct.price,
        productUrl: selectedProduct.productUrl,
      };

      const response = await axios.post("/api/scrape/buy", purchaseData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const savedAmount = response.data.data.savedAmount;

        // First open the product URL
        const newWindow = window.open(selectedProduct.productUrl, "_blank");

        if (!newWindow) {
          alert(
            "Please allow pop-ups to view the product page. Purchase has been saved to your history."
          );
        } else {
          alert(
            `Purchase saved! You saved ₹${savedAmount.toFixed(
              2
            )}\n\nRedirecting to ${selectedProduct.store}...`
          );
        }

        // Then navigate to history after a short delay
        setTimeout(() => {
          navigate("/history");
        }, 1500);
      }
    } catch (error) {
      console.error("Error handling buy:", error);
      alert(
        error.response?.data?.message ||
          "Failed to save purchase. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="product-compare">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Finding top 3 similar products from all stores...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-compare">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || "Product not found"}</p>
          <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    );
  }

  const allProducts = [
    ...similarProducts.amazon,
    ...similarProducts.flipkart,
    ...similarProducts.myntra,
  ];

  const sortedProducts = allProducts.sort((a, b) => a.price - b.price);

  return (
    <div className="product-compare">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="header-section">
        <h1>Similar Products</h1>
        <p className="subtitle">Showing top 3 products from each store</p>
        <div className="selected-product">
          <h3>You searched for: {product.name}</h3>
          <p className="original-store">From {product.store}</p>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="no-products">
          <p>No similar products found</p>
          <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
      ) : (
        <>
          <div className="store-sections">
            {/* Amazon Section */}
            {similarProducts.amazon.length > 0 && (
              <div className="store-section">
                <h2 className="store-title amazon">
                  🛒 Amazon ({similarProducts.amazon.length})
                </h2>
                <div className="products-grid">
                  {similarProducts.amazon.map((prod, idx) => (
                    <ProductCard key={idx} product={prod} onBuy={handleBuy} />
                  ))}
                </div>
              </div>
            )}

            {/* Flipkart Section */}
            {similarProducts.flipkart.length > 0 && (
              <div className="store-section">
                <h2 className="store-title flipkart">
                  🛍️ Flipkart ({similarProducts.flipkart.length})
                </h2>
                <div className="products-grid">
                  {similarProducts.flipkart.map((prod, idx) => (
                    <ProductCard key={idx} product={prod} onBuy={handleBuy} />
                  ))}
                </div>
              </div>
            )}

            {/* Myntra Section */}
            {similarProducts.myntra.length > 0 && (
              <div className="store-section">
                <h2 className="store-title myntra">
                  👗 Myntra ({similarProducts.myntra.length})
                </h2>
                <div className="products-grid">
                  {similarProducts.myntra.map((prod, idx) => (
                    <ProductCard key={idx} product={prod} onBuy={handleBuy} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="best-deal-section">
            <h2>🏆 Best Deal</h2>
            <ProductCard
              product={sortedProducts[0]}
              onBuy={handleBuy}
              isBestDeal={true}
            />
          </div>
        </>
      )}
    </div>
  );
};

const ProductCard = ({ product, onBuy, isBestDeal = false }) => {
  return (
    <div className={`product-card ${isBestDeal ? "best-deal" : ""}`}>
      {isBestDeal && <div className="best-deal-badge">BEST DEAL</div>}

      <div className="product-image">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/300x300/667eea/white?text=${product.store}`;
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
              <span className="discount-badge">{product.discount}% OFF</span>
            )}
          </div>
          {product.originalPrice > product.price && (
            <div className="price-details">
              <span className="original-price">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="savings">
                Save ₹{(product.originalPrice - product.price).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <button className="buy-btn" onClick={() => onBuy(product)}>
          Buy Now from {product.store}
        </button>
      </div>
    </div>
  );
};

export default ProductCompare;
