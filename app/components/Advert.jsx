"use client";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useAdvertStore } from "@/app/store/Advert";
import styles from "@/app/style/advert.module.css";

export default function Advert({ placement = "sidebar" }) {
  const { advertsByPlacement, loading, fetchAdverts } = useAdvertStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideTransition, setSlideTransition] = useState(false);

  useEffect(() => {
    fetchAdverts();
  }, []);

  const advert = advertsByPlacement[placement];
  const items = useMemo(() => advert?.items || [], [advert]);

  useEffect(() => {
    if (items.length > 1) {
      const interval = setInterval(() => {
        setSlideTransition(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % items.length);
          setSlideTransition(false);
        }, 250);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [items.length]);

  const handleSlideChange = (index) => {
    if (index !== currentSlide) {
      setSlideTransition(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setSlideTransition(false);
      }, 250);
    }
  };

  const handleShopNow = (link) => {
    if (link) {
      window.location.href = link;
    }
  };

  if (loading) {
    return <div className={`${styles.advertSkeleton} skeleton`}></div>;
  }

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[currentSlide];

  return (
    <div className={styles.advertHero}>
      <div className={styles.advertTextSection}>
        <span>{currentItem?.label || "Featured"}</span>
        <h1>{currentItem?.title || "Special Offer"}</h1>
        <p className={styles.advertDescription}>
          {currentItem?.description}
        </p>
        <button
          className={styles.advertButton}
          onClick={() => handleShopNow(currentItem?.buttonLink)}
        >
          {currentItem?.buttonText || "Buy Now"}
        </button>
      </div>

      <div className={styles.advertImageSection}>
        {currentItem?.image && (
          <Image
            src={currentItem.image}
            alt={currentItem.title || "Advertisement"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={100}
            priority={true}
            className={`${styles.advertImage} ${
              slideTransition ? styles.advertSlideTransition : ""
            }`}
          />
        )}
      </div>

      {items.length > 1 && (
        <div className={styles.advertPagination}>
          {items.map((_, index) => (
            <div
              key={index}
              className={`${styles.advertPaginationDot} ${
                index === currentSlide ? styles.active : ""
              }`}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
