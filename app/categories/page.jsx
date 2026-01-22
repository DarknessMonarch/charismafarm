"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";
import LoadingLogo from "@/app/components/loadingLogo";
import styles from "@/app/style/product.module.css";
import ProductCard from "@/app/components/productCard";
import Nothing from "@/app/components/Nothing";
import EmptyCart from "@/public/assets/emptycart.png";
import { useEcommerceStore } from "@/app/store/ecommerceStore";

// Separate component that uses useSearchParams
function CategoryContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const { 
    products, 
    productsLoading, 
    getAllProducts 
  } = useEcommerceStore();

  useEffect(() => {
    // Fetch all products on mount
    getAllProducts();
  }, [getAllProducts]);

  // Filter products by category from the fetched data
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    if (category) {
      return products.filter(product => product.category === category);
    }
    
    return products;
  }, [products, category]);

  // Show loading state
  if (productsLoading) {
    return (
      <section className={styles.productWrapper}>
        <LoadingLogo />
      </section>
    );
  }

  // Show empty state
  if (filteredProducts.length === 0) {
    return (
      <section className={styles.emptyProductWrapper}>
        <Nothing
          NothingImage={EmptyCart}
          Text={category ? `No products found in "${category}" category` : "No products found"}
          Alt="Category not found"
        />
      </section>
    );
  }

  return (
    <section className={styles.productWrapper}>
      <div className={styles.productGrid}>
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product._id || product.id} 
            data={product} 
          />
        ))}
      </div>
    </section>
  );
}

// Loading fallback component
function CategoryFallback() {
  return (
    <section className={styles.productWrapper}>
      <LoadingLogo />
    </section>
  );
}

export default function Category() {
  return (
    <Suspense fallback={<CategoryFallback />}>
      <CategoryContent />
    </Suspense>
  );
}