"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useTestimonialStore } from "@/app/store/testimonialStore";
import styles from "@/app/style/testimonials.module.css";
import { MdOutlineKeyboardArrowLeft as LeftIcon } from "react-icons/md";
import { MdOutlineKeyboardArrowRight as RightIcon } from "react-icons/md";
import { MdStar as StarIcon } from "react-icons/md";

export default function Feedback() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);

  const { testimonials, loading, fetchTestimonials } = useTestimonialStore();
  const gridRef = useRef(null);

  useEffect(() => {
    fetchTestimonials();
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
  }, [testimonials]);

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

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={index < rating ? styles.starFilled : styles.starEmpty}
      />
    ));
  };

  if (loading) {
    return (
      <section className={styles.testimonialsContainer}>
        <div className={styles.headerContainer}>
          <h1>Customer Reviews</h1>
          <div className={styles.testimonialsController}>
            <button
              className={`${styles.navButton} ${styles.disabled}`}
              disabled
              aria-label="Previous feedbacks"
            >
              <LeftIcon className={styles.navBtnIcon} />
            </button>
            <button
              className={`${styles.navButton} ${styles.disabled}`}
              disabled
              aria-label="Next feedbacks"
            >
              <RightIcon className={styles.navBtnIcon} />
            </button>
          </div>
        </div>
        <div ref={gridRef} className={styles.testimonialsGrid}>
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className={`${styles.testimonialCard} skeleton`}
            ></div>
          ))}
        </div>
      </section>
    );
  }

  // Don't render section if no testimonials
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className={styles.testimonialsContainer}>
      <div className={styles.headerContainer}>
        <h1>Customer Reviews</h1>
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
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className={styles.testimonialCard}>
            <div className={styles.ratingStars}>
              {renderStars(testimonial.rating || 5)}
            </div>
            <p>{testimonial.comment}</p>
            <div className={styles.userInfo}>
              {testimonial.image ? (
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {testimonial.name?.charAt(0) || "C"}
                </div>
              )}
              <div className={styles.userDetails}>
                <span className={styles.userName}>{testimonial.name}</span>
                <span className={styles.userRole}>{testimonial.role || "Customer"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
