"use client";

import { useEffect, useState } from "react";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import EmptyCart from "@/public/assets/emptycart.png";
import Nothing from "@/app/components/Nothing";
import styles from "@/app/style/product.module.css";
import ProductCard from "@/app/components/productCard";

export default function Product() {
  const { products, productsLoading, getAllProducts } = useEcommerceStore();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      if (!hasLoaded) {
        await getAllProducts({ limit: 8 });
        setHasLoaded(true);
      }
    };

    loadProducts();
  }, [getAllProducts, hasLoaded]);

  if (productsLoading) {
    return (
      <section className={styles.productWrapper}>
        <div className={styles.productHeader}>
          <h2>Best Sellers</h2>
        </div>
        <div className={styles.productGrid}>
          {[...Array(8)].map((_, index) => (
            <div key={index} className={styles.productCardContainer}>
              <div className={`${styles.productCardImageWrapper} skeleton`}></div>
              <div className={`${styles.productCardNameLoading} skeleton`}></div>
              <div className={`${styles.productCardPriceLoading} skeleton`}></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className={styles.emptyProductWrapper}>
        <Nothing
          NothingImage={EmptyCart}
          Text="No products available"
          Alt="No products available"
        />
      </section>
    );
  }

  return (
    <section className={styles.productWrapper}>
      <div className={styles.productHeader}>
        <h2>Best Sellers</h2>
        <button
          aria-label="View All Products"
          className={styles.viewAllButton}
          onClick={() => window.location.href = '/products'}
        >
          View All
        </button>
      </div>

      <div className={styles.productGrid}>
        {products.map((product) => (
          <ProductCard key={product._id} data={product} />
        ))}
      </div>
    </section>
  );
}