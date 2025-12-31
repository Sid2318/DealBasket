import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductsBySubcategory, getAllProducts } from "../../api/productApi";
import { savePurchase } from "../../api/historyApi";
import LoginModal from "../../components/LoginModal/LoginModal";
import "./SubcategoryPage.scss";

const SubcategoryPage = () => {
  const { subcategory } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Filter and sort states
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sortOrder, setSortOrder] = useState("none");

  // Website icons mapping - using local images
  const websiteIcons = {
    amazon: "/images/websites/amazon.png",
    flipkart: "/images/websites/flipkart.png",
    bigbasket: "/images/websites/bigbasket.png",
  };

  // Parse price string to number
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    return parseInt(priceString.replace(/[₹,]/g, ""));
  };

  useEffect(() => {
    fetchProducts();
  }, [subcategory]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, priceRange, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let data;
      if (subcategory === "bestDeals") {
        // Fetch all products for best deals
        const allProducts = await getAllProducts();

        // Filter products with valid discounts and sort by discount percentage
        data = allProducts
          .filter((product) => {
            const discount = product.discount;
            return discount && discount !== "0%" && discount !== "null";
          })
          .map((product) => ({
            ...product,
            discountValue: parseInt(product.discount.replace("%", "")) || 0,
          }))
          .sort((a, b) => b.discountValue - a.discountValue);
      } else {
        // Normal subcategory fetch
        data = await getProductsBySubcategory(subcategory);
      }

      setProducts(data);

      // Calculate max price from products
      if (data.length > 0) {
        const prices = data.map((p) => parsePrice(p.discountedPrice));
        const max = Math.max(...prices);
        setMaxPrice(max);
        setPriceRange([0, max]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Filter by price range
    filtered = filtered.filter((product) => {
      const price = parsePrice(product.discountedPrice);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort by price
    if (sortOrder === "lowToHigh") {
      filtered.sort(
        (a, b) => parsePrice(a.discountedPrice) - parsePrice(b.discountedPrice)
      );
    } else if (sortOrder === "highToLow") {
      filtered.sort(
        (a, b) => parsePrice(b.discountedPrice) - parsePrice(a.discountedPrice)
      );
    }

    setFilteredProducts(filtered);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([0, value]);
  };

  const handleBuyNow = async (e, product) => {
    e.stopPropagation(); // Prevent navigation to product details

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    try {
      const originalPrice = parsePrice(product.actualPrice);
      const finalPrice = parsePrice(product.discountedPrice);
      const savedAmount = originalPrice - finalPrice;

      const purchaseData = {
        productId: product._id,
        productName: product.name,
        productImage: product.image,
        website: product.website,
        category: product.category,
        subcategory: product.subcategory,
        originalPrice,
        finalPrice,
        savedAmount,
        discount: product.discount,
      };

      console.log("Sending purchase data:", purchaseData);
      const response = await savePurchase(purchaseData);
      console.log("Purchase response:", response);

      alert(
        `✅ Purchase saved! You saved ₹${savedAmount.toLocaleString("en-IN")}!`
      );
    } catch (error) {
      console.error("Error saving purchase:", error);
      console.error("Error response:", error.response?.data);
      alert(
        `Failed to save purchase: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleProductClick = (product) => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    if (product.link) {
      window.open(product.link, "_blank");
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
        <h1>
          {subcategory === "bestDeals"
            ? "🔥 Best Deals"
            : subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
        </h1>
        <p>{filteredProducts.length} products found</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>
            Price Range: ₹0 - ₹{priceRange[1].toLocaleString("en-IN")}
          </label>
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="price-slider"
          />
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="none">None</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="product-card"
            onClick={() => handleProductClick(product)}
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
              <button
                className="buy-btn"
                onClick={(e) => handleBuyNow(e, product)}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default SubcategoryPage;
