"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/style/quickview.module.css";
import { IoClose as CloseIcon } from "react-icons/io5";
import { FiShoppingCart as CartIcon, FiPlus, FiMinus } from "react-icons/fi";
import { MdStar as StarIcon, MdStarHalf as StarHalfIcon } from "react-icons/md";
import { FaWhatsapp as WhatsappIcon } from "react-icons/fa";

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart, isAuth }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    setIsAdding(true);
    await onAddToCart(product, quantity);
    setIsAdding(false);
  };

  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in ${product.name} (Ksh ${product.price}). Is it available?`
    );
    window.open(`https://wa.me/254746033465?text=${message}`, "_blank");
  };

  const incrementQuantity = () => {
    if (quantity < (product.stock || 99)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`} className={styles.starFilled} />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half" className={styles.starFilled} />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className={styles.starEmpty} />);
    }
    return stars;
  };

  const images = product.images && product.images.length > 0
    ? product.images
    : ["/assets/images/product-placeholder.jpg"];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <div className={styles.modalBody}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                sizes="400px"
                className={styles.productImage}
              />
            </div>
            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${selectedImage === index ? styles.activeThumbnail : ""}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      sizes="60px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.detailsSection}>
            <span className={styles.category}>{product.category}</span>
            <h2 className={styles.productName}>{product.name}</h2>

            <div className={styles.rating}>
              {renderStars(product.rating?.average || 0)}
              <span className={styles.reviewCount}>
                ({product.rating?.count || 0} reviews)
              </span>
            </div>

            <div className={styles.price}>
              <span className={styles.currentPrice}>Ksh {product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className={styles.originalPrice}>Ksh {product.originalPrice}</span>
              )}
            </div>

            {product.description && (
              <p className={styles.description}>
                {product.description.length > 200
                  ? `${product.description.substring(0, 200)}...`
                  : product.description}
              </p>
            )}

            <div className={styles.stockInfo}>
              {product.stock > 0 ? (
                <span className={styles.inStock}>In Stock ({product.stock} available)</span>
              ) : (
                <span className={styles.outOfStock}>Out of Stock</span>
              )}
            </div>

            <div className={styles.quantitySection}>
              <span className={styles.quantityLabel}>Quantity:</span>
              <div className={styles.quantityControls}>
                <button
                  className={styles.quantityBtn}
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <FiMinus />
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button
                  className={styles.quantityBtn}
                  onClick={incrementQuantity}
                  disabled={quantity >= (product.stock || 99)}
                  aria-label="Increase quantity"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
              >
                <CartIcon />
                {isAdding ? "Adding..." : "Add to Cart"}
              </button>
              <button
                className={styles.whatsappBtn}
                onClick={handleWhatsAppInquiry}
                aria-label="Ask on WhatsApp"
              >
                <WhatsappIcon />
                Ask on WhatsApp
              </button>
            </div>

            <Link href={`/products/${product._id}`} className={styles.viewDetailsLink}>
              View Full Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
