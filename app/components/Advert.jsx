"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAdvertStore } from "@/app/store/Advert";
import styles from "@/app/style/advert.module.css";

export default function Advert() {
  const { adverts, loading, fetchAdverts } = useAdvertStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideTransition, setSlideTransition] = useState(false);

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

  useEffect(() => {
    if (adverts.length > 1) {
      const interval = setInterval(() => {
        setSlideTransition(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % adverts.length);
          setSlideTransition(false);
        }, 250);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [adverts.length]);

  const handleSlideChange = (index) => {
    if (index !== currentSlide) {
      setSlideTransition(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setSlideTransition(false);
      }, 250);
    }
  };

  const handleShopNow = (advertLink) => {
    if (advertLink) {
      window.location.href = advertLink;
    }
  };

  if (loading) {
    return <div className={`${styles.advertSkeleton} skeleton`}></div>;
  }

  if (adverts.length === 0) {
    return null;
  }

  const currentAdvert = adverts[currentSlide];

  return (
    <div className={styles.advertHero}>
      <div className={styles.advertTextSection}>
        <span>{currentAdvert?.location || "Featured"}</span>
        <h1>{currentAdvert?.title || "Special Offer"}</h1>
        <p className={styles.advertDescription}>
          {currentAdvert?.description}
        </p>
        <button
          className={styles.advertButton}
          onClick={() => handleShopNow(currentAdvert?.link)}
        >
          Buy Now
        </button>
      </div>

      <div className={styles.advertImageSection}>
        {currentAdvert?.image && (
          <Image
            src={currentAdvert.image}
            alt={currentAdvert.title || "Advertisement"}
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

      {adverts.length > 1 && (
        <div className={styles.advertPagination}>
          {adverts.map((_, index) => (
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