"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import styles from "@/app/style/testimonials.module.css";
import { MdOutlineKeyboardArrowLeft as LeftIcon } from "react-icons/md";
import { MdOutlineKeyboardArrowRight as RightIcon } from "react-icons/md";

const MOCK_FEEDBACKS = [
  {
    id: 1,
    text: "The delivery is amaizingly fast and realiable",
    user: {
      name: "Collins",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  },

];

export default function Feedback() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);

  const gridRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeedbacks(MOCK_FEEDBACKS);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      if (gridRef.current) {
        const container = gridRef.current;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        const overflow = scrollWidth > clientWidth;

        setHasOverflow(overflow);
        setMaxScroll(overflow ? scrollWidth - clientWidth : 0);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [feedbacks]);

  const handlePrevious = () => {
    if (!hasOverflow) return;
    const scrollAmount = 300;
    const newPosition = Math.max(0, scrollPosition - scrollAmount);
    setScrollPosition(newPosition);

    if (gridRef.current) {
      gridRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (!hasOverflow) return;
    const scrollAmount = 300;
    const newPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
    setScrollPosition(newPosition);

    if (gridRef.current) {
      gridRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
    }
  };

  const canGoPrevious = hasOverflow && scrollPosition > 0;
  const canGoNext = hasOverflow && scrollPosition < maxScroll;

  if (loading) {
    return (
      <section className={styles.testimonialsContainer}>
        <div className={styles.headerContainer}>
          <h1>User Feedbacks</h1>
          <div className={styles.testimonialsController}>
            <button
              className={`${styles.navButton} ${
                !canGoPrevious ? styles.disabled : ""
              }`}
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              aria-label="Previous feedbacks"
            >
              <LeftIcon className={styles.navBtnIcon} />
            </button>
            <button
              className={`${styles.navButton} ${
                !canGoNext ? styles.disabled : ""
              }`}
              onClick={handleNext}
              disabled={!canGoNext}
              aria-label="Next feedbacks"
            >
              <RightIcon className={styles.navBtnIcon} />
            </button>
          </div>
        </div>
        <div
          ref={gridRef}
          className={styles.testimonialsGrid}
          onScroll={() => {
            if (gridRef.current) setScrollPosition(gridRef.current.scrollLeft);
          }}
        >
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className={`${styles.testimonialCard} skeleton`}
            ></div>
          ))}
        </div>
      </section>
    );
  }

  if (!feedbacks.length) return null;

  return (
    <section className={styles.testimonialsContainer}>
      <div className={styles.headerContainer}>
        <h1>User Feedbacks</h1>
        <div className={styles.testimonialsController}>
          <button
            className={`${styles.navButton} ${
              !canGoPrevious ? styles.disabled : ""
            }`}
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            aria-label="Previous feedbacks"
          >
            <LeftIcon className={styles.navBtnIcon} />
          </button>
          <button
            className={`${styles.navButton} ${
              !canGoNext ? styles.disabled : ""
            }`}
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="Next feedbacks"
          >
            <RightIcon className={styles.navBtnIcon} />
          </button>
        </div>
      </div>

      <div
        ref={gridRef}
        className={styles.testimonialsGrid}
        onScroll={() => {
          if (gridRef.current) setScrollPosition(gridRef.current.scrollLeft);
        }}
      >
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className={styles.testimonialCard}>
            <p>{feedback.text}</p>
            <div className={styles.userInfo}>
              <Image
                src={feedback.user.avatar}
                alt={feedback.user.name}
                width={40}
                height={40}
                className={styles.avatarImage}
              />
              <div className={styles.userDetails}>
                <span>{feedback.user.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
