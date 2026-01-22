"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import Nothing from "@/app/components/Nothing";
import EmptyCart from "@/public/assets/emptycart.png";
import LoadingLogo from "@/app/components/loadingLogo";
import styles from "@/app/style/productInfo.module.css";
import ProductDetail from "@/app/components/productDetail";

export default function ProductSpecific() {
  const params = useParams();
  const productId = params.slug;

  const { getProduct } = useEcommerceStore();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await getProduct(productId);

        if (result.success) {
          setProductData(result.data);
          setError(null);
        } else {
          setError("Product not found");
          setProductData(null);
        }
      } catch (err) {
        setError("Failed to load product");
        setProductData(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, getProduct]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingLogo />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className={styles.productEmptyInfo}>
        <Nothing
          NothingImage={EmptyCart}
          Text="Product not found"
          Alt="Product not found"
        />
      </div>
    );
  }

  return (
    <div className={styles.productinfo}>
      <ProductDetail productData={productData} loading={false} />
      
      <div className={styles.productnavinfo}>
        <button 
          className={`${styles.productNavButton} ${activeTab === "description" ? styles.active : ""}`}
          onClick={() => handleTabClick("description")}
        >
          Description
        </button>
        <button 
          className={`${styles.productNavButton} ${activeTab === "reviews" ? styles.active : ""}`}
          onClick={() => handleTabClick("reviews")}
        >
          Reviews ({productData.rating?.count || 0})
        </button>
      </div>

      <div className={styles.productContent}>
        {activeTab === "description" && (
          <div className={styles.productDescription}>
            <p>{productData.description}</p>
            {productData.weight > 0 && (
              <p><strong>Weight:</strong> {productData.weight}g</p>
            )}
            {productData.dimensions && (
              <p><strong>Dimensions:</strong> {productData.dimensions.length} x {productData.dimensions.width} x {productData.dimensions.height} cm</p>
            )}
          </div>
        )}
        
        {activeTab === "reviews" && (
          <div className={styles.productReviews}>
            {productData.rating?.count > 0 ? (
              <div>
                <h3>Customer Reviews ({productData.rating.count})</h3>
                <p>Average Rating: {productData.rating.average.toFixed(1)} / 5</p>
                <p>Detailed reviews coming soon...</p>
              </div>
            ) : (
              <div>
                <h3>No Reviews Yet</h3>
                <p>Be the first to review this product!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}