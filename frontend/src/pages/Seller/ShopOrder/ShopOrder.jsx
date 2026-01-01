import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../../api/productApi";
import axios from "../../../api/axios";
import "./ShopOrder.scss";

const ShopOrder = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching product with ID:", productId);

        if (!productId) {
          setError("No product ID provided");
          setLoading(false);
          return;
        }

        const prod = await getProductById(productId);
        console.log("Product fetched:", prod);

        if (!prod) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        setProduct(prod);

        // Check if sellerId exists (for SellerProduct)
        if (prod.sellerId) {
          console.log("Product has sellerId:", prod.sellerId);

          // If sellerId is already populated with shop data
          if (typeof prod.sellerId === "object" && prod.sellerId.shopName) {
            console.log("Shop data already populated:", prod.sellerId);
            setShop(prod.sellerId);
          } else {
            // Otherwise fetch shop details
            console.log("Fetching shop details for sellerId:", prod.sellerId);
            const response = await axios.get(`/products/shop/${prod.sellerId}`);
            console.log("Shop data fetched:", response.data);
            setShop(response.data);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  if (loading) {
    return (
      <div className="shop-order-page">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-order-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="shop-order-page">
        <div className="error">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="shop-order-page">
      <h2>📦 Order Product</h2>
      return (
      <div className="shop-order-page pro-ui">
        <div className="order-main-card">
          <div className="order-product-section">
            <div className="product-image-main">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-main-info">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-pricing-row">
                <span className="product-price">
                  ₹{product.discountedPrice}
                </span>
                {product.actualPrice &&
                  product.actualPrice !== product.discountedPrice && (
                    <span className="product-original-price">
                      ₹{product.actualPrice}
                    </span>
                  )}
                {product.discount && (
                  <span className="product-discount">
                    {product.discount} OFF
                  </span>
                )}
              </div>
              <div className="product-meta-row">
                <span className="meta">
                  Category: <b>{product.category}</b>
                </span>
                <span className="meta">
                  Subcategory: <b>{product.subcategory}</b>
                </span>
                {product.quantity && (
                  <span className="meta">
                    Quantity: <b>{product.quantity}</b>
                  </span>
                )}
              </div>
              {product.details && product.details.length > 0 && (
                <div className="product-details-list">
                  <b>Details:</b>
                  <ul>
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.link && (
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-link-btn"
                >
                  Visit Product Page
                </a>
              )}
              <div className="order-actions-pro">
                <button className="order-btn-pro">Place Order</button>
                <button className="contact-btn-pro">Contact Seller</button>
              </div>
            </div>
          </div>
          <div className="order-shop-sidebar">
            <div className="shop-card">
              <h2>Shop Information</h2>
              {shop ? (
                <>
                  <div className="shop-row">
                    <span className="label">Name:</span>{" "}
                    <span>{shop.shopName}</span>
                  </div>
                  <div className="shop-row">
                    <span className="label">Contact:</span>{" "}
                    <span>{shop.contactNumber || "-"}</span>
                  </div>
                  <div className="shop-row">
                    <span className="label">Location:</span>{" "}
                    <span>
                      {shop.address?.street || ""} {shop.address?.city || "-"},{" "}
                      {shop.address?.state || "-"},{" "}
                      {shop.address?.pincode || ""}
                    </span>
                  </div>
                  {shop.shopDescription && (
                    <div className="shop-row">
                      <span className="label">Description:</span>{" "}
                      <span>{shop.shopDescription}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="shop-row">
                  <span className="label">Website:</span>{" "}
                  <span>{product.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOrder;
