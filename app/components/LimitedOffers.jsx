"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import styles from "@/app/style/limitedOffers.module.css";

export default function LimitedOffers() {
  const { products, getAllProducts } = useEcommerceStore();
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const loadFeaturedProduct = async () => {
      setLoading(true);
      const result = await getAllProducts({ limit: 1, sort: 'newest' });
      
      if (result.success && result.data.products.length > 0) {
        setFeaturedProduct(result.data.products[0]);
      }
      setLoading(false);
    };

    loadFeaturedProduct();
  }, [getAllProducts]);

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 6);
    targetDate.setHours(21, 20, 23, 0);

    const updateCountdown = () => {
      const now = new Date();
      const timeDiff = targetDate.getTime() - now.getTime();

      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleShopNow = (productId) => {
    window.location.href = `/products/${productId}`;
  };

  const formatNumber = (num) => {
    return num.toString().padStart(2, "0");
  };

  if (loading) {
    return (
      <div className={`${styles.limitedOffersHeroLoading} skeleton`}></div>
    );
  }

  if (!featuredProduct) {
    return (
      <div className={`${styles.limitedOffersHero} ${styles.limitedOffersHeroNothing}`}>
        <div className={styles.limitedOffersTextSection}>
          <div className={styles.limitedOffersBadge}>Limited Offer</div>
          <h1>Discover Wellness Essentials</h1>
          <p>No featured product available at the moment</p>

          <div className={styles.limitedOffersCountdown}>
            <div className={styles.limitedOffersCountdownItem}>
              <h3>00</h3>
              <span>Days</span>
            </div>
            <div className={styles.limitedOffersCountdownItem}>
              <h3>00</h3>
              <span>Hours</span>
            </div>
            <div className={styles.limitedOffersCountdownItem}>
              <h3>00</h3>
              <span>Minutes</span>
            </div>
            <div className={styles.limitedOffersCountdownItem}>
              <h3>00</h3>
              <span>Seconds</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.limitedOffersHero}>
      <div className={styles.limitedOffersTextSection}>
        <div className={styles.limitedOffersBadge}>Limited Offer</div>
        <h1>{featuredProduct.name}</h1>
        <p>{featuredProduct.description}</p>

        <div className={styles.limitedOffersCountdown}>
          <div className={styles.limitedOffersCountdownItem}>
            <h3>{formatNumber(countdown.days)}</h3>
            <span>Days</span>
          </div>
          <div className={styles.limitedOffersCountdownItem}>
            <h3>{formatNumber(countdown.hours)}</h3>
            <span>Hours</span>
          </div>
          <div className={styles.limitedOffersCountdownItem}>
            <h3>{formatNumber(countdown.minutes)}</h3>
            <span>Minutes</span>
          </div>
          <div className={styles.limitedOffersCountdownItem}>
            <h3>{formatNumber(countdown.seconds)}</h3>
            <span>Seconds</span>
          </div>
        </div>

        <button
          className={styles.limitedOffersButton}
          onClick={() => handleShopNow(featuredProduct._id)}
        >
          Shop Now
        </button>
      </div>

      <div className={styles.limitedOffersImageSection}>
        {featuredProduct.images?.[0] && (
          <Image
            src={featuredProduct.images[0]}
            alt={featuredProduct.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={100}
            priority={true}
            className={styles.limitedOffersImage}
          />
        )}
      </div>
    </div>
  );
}
