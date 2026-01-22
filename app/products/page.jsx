"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import LoadingLogo from "@/app/components/loadingLogo";
import styles from "@/app/style/product.module.css";
import ProductCard from "@/app/components/productCard";
import Nothing from "@/app/components/Nothing";
import EmptyCart from "@/public/assets/emptycart.png";

function ProductList() {
  const searchParams = useSearchParams();
  const productQuery = searchParams.get('product');
  const category = searchParams.get('category');
  
  const { products, productsLoading, getAllProducts } = useEcommerceStore();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      const filters = {};
      if (category) filters.category = category;
      if (productQuery) filters.search = productQuery;
      
      await getAllProducts(filters);
      setHasLoaded(true);
    };

    loadProducts();
  }, [getAllProducts, category, productQuery]);

  if (!hasLoaded || productsLoading) {
    return (
      <section className={styles.productWrapper}>
        <LoadingLogo />
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className={styles.emptyProductWrapper}>
        <Nothing
          NothingImage={EmptyCart}
          Text={
            productQuery 
              ? `No products found for "${productQuery}"` 
              : category
              ? `No products found in "${category}"`
              : "No products found"
          }
          Alt="Product not found"
        />
      </section>
    );
  }

  return (
    <section className={styles.productWrapper}>
      <div className={styles.productGrid}>
        {products.map((product) => (
          <ProductCard key={product._id} data={product} />
        ))}
      </div>
    </section>
  );
}

function ProductsLoading() {
  return (
    <section className={styles.productWrapper}>
      <LoadingLogo />
    </section>
  );
}

export default function Products() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductList />
    </Suspense>
  );
}