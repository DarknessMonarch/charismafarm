"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function About() {
  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.section}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";
      section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.info}>
      <div className={styles.infoHeader}>
        <h1>About CharismaFarm</h1>
      </div>
      <div className={styles.section}>
        <h2>
          CharismaFarm is your trusted source for fresh, organic farm products directly from our fields to your table.
        </h2>
        <p>
          At CharismaFarm, we are passionate about sustainable farming and providing families with the freshest,
          most nutritious produce available. Our farm is nestled in the fertile highlands of Kenya, where we
          cultivate a wide variety of organic products including pure honey, free-range poultry, fresh vegetables,
          and premium goat products. Every item we offer is grown and raised with care, ensuring you receive
          nothing but the best nature has to offer.
        </p>
      </div>
      <div className={styles.section}>
        <h2>Our Story</h2>
        <p>
          CharismaFarm was founded with a simple vision: to reconnect people with real, wholesome food.
          What started as a small family farm has grown into a thriving agricultural enterprise dedicated
          to organic farming practices. We believe that healthy soil produces healthy food, which in turn
          creates healthy communities. Our journey has been one of learning, growing, and constantly
          improving our methods to bring you the finest farm products.
        </p>
      </div>
      <div className={styles.section}>
        <h2>Why Choose CharismaFarm?</h2>
        <p>
          We stand out for our commitment to quality, sustainability, and customer satisfaction.
          Every product that leaves our farm has been carefully tended, harvested at peak freshness,
          and delivered with care. We practice organic farming without harmful pesticides or chemicals,
          ensuring that what reaches your kitchen is pure and natural. Our free-range poultry and goats
          are raised humanely with natural feeds, resulting in superior taste and nutritional value.
        </p>
      </div>
      <div className={styles.section}>
        <h2>Our Commitment to Organic Farming</h2>
        <p>
          Organic farming is at the heart of everything we do at CharismaFarm. We believe in working
          with nature, not against it. Our farming practices include:
        </p>
        <ul className={styles.bulletList}>
          <li>
            <strong>No Synthetic Pesticides:</strong> We use natural pest control methods to protect
            our crops while keeping them chemical-free.
          </li>
          <li>
            <strong>Composting & Natural Fertilizers:</strong> Rich, organic compost nourishes our soil,
            producing nutrient-dense vegetables and fruits.
          </li>
          <li>
            <strong>Free-Range Animal Husbandry:</strong> Our chickens and goats roam freely,
            enjoying natural diets and stress-free environments.
          </li>
          <li>
            <strong>Sustainable Beekeeping:</strong> Our honey is harvested responsibly, supporting
            healthy bee populations and producing pure, raw honey.
          </li>
          <li>
            <strong>Water Conservation:</strong> We implement smart irrigation systems to minimize
            water waste while maximizing crop health.
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2>Our Products</h2>
        <p>Discover the natural goodness from CharismaFarm:</p>
        <ul className={styles.bulletList}>
          <li><strong>Pure Organic Honey:</strong> Raw, unprocessed honey from our apiaries - nature's perfect sweetener with numerous health benefits.</li>
          <li><strong>Free-Range Poultry:</strong> Fresh eggs and chicken from hens that roam freely and eat natural feeds.</li>
          <li><strong>Fresh Vegetables:</strong> Seasonal, organically grown vegetables picked at peak ripeness for maximum nutrition and flavor.</li>
          <li><strong>Premium Goat Products:</strong> Quality goat meat and fresh goat milk from our healthy, well-cared-for herd.</li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2>From Our Farm to Your Home</h2>
        <p>
          We take pride in our farm-to-table approach. When you order from CharismaFarm, you're getting
          products that were harvested just hours before delivery. Our efficient logistics ensure that
          the freshness you deserve reaches your doorstep promptly. We deliver across Kenya, bringing
          the taste of the countryside to urban homes.
        </p>
      </div>
      <div className={styles.section}>
        <p>
          CharismaFarm is more than a farm - we're a community of people who believe in eating well
          and living sustainably. Join us in embracing the natural goodness of organic farming.
          Together, we can make healthier choices for our families and our planet.
        </p>
      </div>
    </div>
  );
}
