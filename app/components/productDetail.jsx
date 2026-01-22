"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import styles from "@/app/style/productDetail.module.css";
import { IoCartOutline as CartIcon, IoHeartOutline as HeartIcon, IoAdd as PlusIcon, IoRemove as MinusIcon, IoExpandOutline as ExpandIcon } from "react-icons/io5";

export default function ProductDetail({ productData, loading = false }) {
  const { addToCart } = useEcommerceStore();
  
  const [selectedColor, setSelectedColor] = useState(productData?.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(productData?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (productData) {
      setSelectedColor(productData.colors?.[0] || '');
      setSelectedSize(productData.sizes?.[0] || '');
      setQuantity(1);
      setSelectedImage(0);
    }
  }, [productData]);

  const handleQuantityChange = (action) => {
    if (action === 'increase' && quantity < productData.stock) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (isAdding) return;
    
    if (!productData.inStock) {
      toast.error('This product is out of stock');
      return;
    }

    if (quantity > productData.stock) {
      toast.error(`Only ${productData.stock} items available`);
      return;
    }

    setIsAdding(true);
    try {
      const result = await addToCart(
        productData._id,
        quantity,
        selectedSize || undefined,
        selectedColor || undefined
      );

      if (result.success) {
        toast.success(`${quantity} ${productData.name} added to cart!`);
      } else {
        toast.error(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading || !productData) {
    return (
      <div className={styles.container}>
        <div className={styles.productDetailWrapper}>
          <div className={styles.imageSection}>
            <div className={`${styles.mainImageWrapper} skeleton`}></div>
            <div className={styles.thumbnailWrapper}>
              <div className={`${styles.thumbnail} skeleton`}></div>
              <div className={`${styles.thumbnail} skeleton`}></div>
            </div>
          </div>
          <div className={styles.detailSection}>
            <div className={`${styles.skeletonText}`} style={{width: '80%', height: '32px'}}></div>
            <div className={`${styles.skeletonText}`} style={{width: '60%', height: '20px', marginTop: '10px'}}></div>
            <div className={`${styles.skeletonText}`} style={{width: '40%', height: '28px', marginTop: '20px'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.productDetailWrapper}>
        {/* Image Section */}
        <div className={styles.imageSection}>
          <div className={styles.mainImageWrapper}>
            {productData.images?.[selectedImage] && (
              <Image 
                src={productData.images[selectedImage]} 
                alt={productData.name}
                width={400}
                height={400}
                className={styles.mainImage}
              />
            )}
            <button className={styles.expandButton} aria-label="Expand image">
              <ExpandIcon size={20} />
            </button>
          </div>
          
          {productData.images?.length > 1 && (
            <div className={styles.thumbnailWrapper}>
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailSelected : styles.thumbnailDefault}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image 
                    src={image} 
                    alt={`Product view ${index + 1}`} 
                    width={90}
                    height={70}
                    className={styles.thumbnailImage} 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail Section */}
        <div className={styles.detailSection}>
          <div className={styles.header}>
            <h1 className={styles.productTitle}>{productData.name}</h1>
          </div>

          <div className={styles.ratingWrapper}>
            <div className={styles.stars}>
              {[1,2,3,4,5].map(star => (
                <span 
                  key={star} 
                  className={styles.star}
                  style={{ color: star <= Math.round(productData.rating?.average || 0) ? '#ffc107' : '#ddd' }}
                >
                  ★
                </span>
              ))}
            </div>
            <span className={styles.reviewCount}>
              ({productData.rating?.count || 0} customer reviews)
            </span>
            <div className={styles.stockStatus}>
              <span 
                className={styles.stockDot}
                style={{ backgroundColor: productData.inStock ? '#4caf50' : '#f44336' }}
              ></span>
              <span className={styles.stockText}>
                {productData.inStock ? `In Stock (${productData.stock})` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className={styles.priceWrapper}>
            <span className={styles.label}>Price:</span>
            <div className={styles.priceContainer}>
              <span className={styles.currentPrice}>Ksh {productData.price}</span>
            </div>
          </div>

          {productData.colors && productData.colors.length > 0 && (
            <div className={styles.colorWrapper}>
              <span className={styles.label}>Color:</span>
              <div className={styles.colorOptions}>
                {productData.colors.map(color => (
                  <button
                    key={color}
                    className={`${styles.colorButton} ${selectedColor === color ? styles.colorButtonSelected : ''}`}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select ${color} color`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          )}

          {productData.sizes && productData.sizes.length > 0 && (
            <div className={styles.sizeWrapper}>
              <span className={styles.label}>Size:</span>
              <div className={styles.sizeOptions}>
                {productData.sizes.map(size => (
                  <button
                    key={size}
                    className={`${styles.sizeButton} ${selectedSize === size ? styles.sizeButtonSelected : ''}`}
                    onClick={() => setSelectedSize(size)}
                    aria-label={`Select ${size} size`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actionWrapper}>
            <div className={styles.quantityWrapper}>
              <button 
                className={styles.quantityButton}
                onClick={() => handleQuantityChange('decrease')}
                disabled={quantity <= 1}
              >
                <MinusIcon />
              </button>
              <span className={styles.quantityValue}>{quantity}</span>
              <button 
                className={styles.quantityButton}
                onClick={() => handleQuantityChange('increase')}
                disabled={quantity >= productData.stock}
              >
                <PlusIcon />
              </button>
            </div>

            <button 
              className={styles.purchaseButton}
              onClick={handleAddToCart}
              disabled={!productData.inStock || isAdding}
            >
              <CartIcon size={20} />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>

            <button className={styles.wishlistButton} aria-label="Add to wishlist">
              <HeartIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}