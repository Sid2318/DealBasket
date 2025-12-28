import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPricesForProduct, products } from "../../data/dummyData";
import api from "../../api/axios";
import "./ProductCompare.scss";

const ProductCompare = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrices();
  }, [productId]);

  const fetchPrices = () => {
    try {
      // Get product details
      const foundProduct = products.find((p) => p._id === productId);
      if (!foundProduct) {
        setError("Product not found");
        setLoading(false);
        return;
      }

      setProduct(foundProduct);

      // Get prices for this product
      const priceData = getPricesForProduct(productId);

      if (!priceData.allPrices || priceData.allPrices.length === 0) {
        setError("No prices available for this product");
        setLoading(false);
        return;
      }

      setData(priceData);
    } catch (error) {
      setError("Failed to load prices");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const buy = async (priceItem) => {
    try {
      const savedAmount = priceItem.originalPrice - priceItem.discountedPrice;

      const purchaseData = {
        productId: productId,
        productName: product.name,
        storeId: priceItem.storeId._id,
        storeName: priceItem.storeId.name,
        originalPrice: priceItem.originalPrice,
        finalPrice: priceItem.discountedPrice,
        savedAmount: savedAmount,
      };

      // Save to backend
      await api.post("/myhistory/save", purchaseData);

      alert(`Purchase confirmed! You saved ₹${savedAmount}`);
      navigate("/history");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to save purchase. Please login first."
      );
    }
  };

  if (loading) {
    return (
      <div className="product-compare">
        <div className="loading">Loading prices...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="product-compare">
        <div className="error">{error || "No data available"}</div>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="product-compare">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Products
      </button>

      <h2>Compare Prices</h2>
      <p className="subtitle">Find the best deal for your purchase</p>

      <div className="prices-container">
        {data.allPrices.map((priceItem) => {
          const isBestDeal = priceItem._id === data.bestDeal._id;
          const savedAmount =
            priceItem.originalPrice - priceItem.discountedPrice;
          const discountPercent = Math.round(
            (savedAmount / priceItem.originalPrice) * 100
          );

          return (
            <div key={priceItem._id} className="price-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="store-info">
                <h3>{priceItem.storeId.name}</h3>
                <a
                  href={priceItem.storeId.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-link"
                >
                  Visit Website →
                </a>
              </div>

              <div className="price-info">
                <div className="original-price">₹{priceItem.originalPrice}</div>
                <div className="discounted-price">
                  ₹{priceItem.discountedPrice}
                </div>
                <div className="savings">
                  Save ₹{savedAmount} ({discountPercent}% OFF)
                </div>
              </div>

              <button className="buy-btn" onClick={() => buy(priceItem)}>
                Buy from {priceItem.storeId.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCompare;
