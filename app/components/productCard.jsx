"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import { IoCartOutline as CartIcon } from "react-icons/io5";
import styles from "@/app/style/productCard.module.css";

export default function ProductCard({ data }) {
  const router = useRouter();
  const { addToCart } = useEcommerceStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleProductClick = () => {
    router.push(`/products/${data._id}`);
  };

  const handleAddtoCart = async (e) => {
    e.stopPropagation();
    
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      const result = await addToCart(
        data._id,
        1,
        data.sizes?.[0] || undefined,
        data.colors?.[0] || undefined
      );
      
      if (result.success) {
        toast.success(`${data.name} added to cart!`);
      } else {
        toast.error(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.productCardContainer} onClick={handleProductClick}>
      <div className={styles.productCardImageWrapper}>
        {data.images?.[0] && (
          <Image
            src={data.images[0]}
            alt={data.name}
            width={120}
            height={120}
            className={styles.productImage}
          />
        )}
        <div className={styles.cartIconContainer}>
          <CartIcon
            className={styles.cartIcon}
            onClick={handleAddtoCart}
            aria-label={`Add ${data.name} to cart`}
            style={{ opacity: isAdding ? 0.5 : 1 }}
          />
        </div>
      </div>
      <h1>{data.name}</h1>
      <div className={styles.productCardPrice}>
        <h3>Ksh {data.price}</h3>
        {data.originalPrice && data.originalPrice !== data.price && (
          <h4>Ksh {data.originalPrice}</h4>
        )}
      </div>
      {!data.inStock && (
        <span className={styles.outOfStock}>Out of Stock</span>
      )}
    </div>
  );
}