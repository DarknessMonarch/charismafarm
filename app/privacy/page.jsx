"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function PrivacyPolicy() {
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
        <h1>Privacy Policy</h1>
      </div>

      <div className={styles.section}>
        <h2>1. Introduction and Commitment to Privacy</h2>
        <p>
          CharismaFarm ("we," "us," "our," or "Company") is committed to protecting your privacy and ensuring transparency in our data practices. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, make purchases, or interact with our services. Please read this Privacy Policy carefully. If you do not agree with our data practices, please discontinue use of our website and services.
        </p>
      </div>

      <div className={styles.section}>
        <h2>2. Information We Collect</h2>
        <p>We collect information in the following categories:</p>
        <ul className={styles.bulletList}>
          <li><strong>Information You Provide Directly:</strong> Name, email address, phone number, billing and shipping information, and payment details when you create an account, place an order, subscribe to our newsletter, or contact customer support.</li>
          <li><strong>Transaction Information:</strong> Details about products purchased, order amounts, dates, and payment methods.</li>
          <li><strong>Account Information:</strong> Username, password, preferences, and communication history.</li>
          <li><strong>Automatically Collected Information:</strong> IP address, browser type, device identifiers, pages visited, time spent, referring URLs, and cookie data.</li>
          <li><strong>Location Data:</strong> Approximate location information based on IP to comply with legal obligations and improve services.</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>3. Legal Basis for Processing</h2>
        <p>We process personal data on the following legal bases:</p>
        <ul className={styles.bulletList}>
          <li>Performance of contract (fulfilling your purchase orders)</li>
          <li>Compliance with legal obligations</li>
          <li>Explicit consent (marketing communications)</li>
          <li>Legitimate business interests (fraud prevention, website improvement)</li>
          <li>Protection of vital interests (safety and security)</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>4. Use of Your Information</h2>
        <p>We use collected information for:</p>
        <ul className={styles.bulletList}>
          <li>Processing and fulfilling CharismaFarm orders and transactions</li>
          <li>Customer support and inquiries response</li>
          <li>Order confirmations, shipping notifications, and delivery updates</li>
          <li>Website functionality and user experience improvement</li>
          <li>Sending promotional emails, newsletters, and marketing communications (with consent)</li>
          <li>Fraud prevention and security measures</li>
          <li>Compliance with legal and regulatory requirements</li>
          <li>Statistical analysis and market research</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>5. Information Sharing and Disclosure</h2>
        <p>
          We do not sell or trade your personal information without consent, except in these cases:
        </p>
        <ul className={styles.bulletList}>
          <li><strong>Service Providers:</strong> Trusted third parties like payment processors, shipping partners, and email services who assist us under confidentiality obligations.</li>
          <li><strong>Legal Compliance:</strong> When required by law, court order, or government authority.</li>
          <li><strong>Business Transfers:</strong> In case of merger, acquisition, or bankruptcy.</li>
          <li><strong>Aggregate Data:</strong> Sharing anonymized, aggregated data that cannot identify individuals.</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>6. Data Security and Payment Processing</h2>
        <p>
          CharismaFarm does not directly handle payment card data. All payments are securely processed by Paystack using SSL/TLS encryption, PCI DSS compliance, and advanced fraud detection. Personal data (name, email, shipping address, order history) is securely stored. We recommend strong passwords and avoiding sharing sensitive information via unsecured channels. For Paystack's security practices, review www.paystack.com.
        </p>
      </div>

      <div className={styles.section}>
        <h2>7. Data Retention</h2>
        <p>
          Personal information is retained as long as necessary for business purposes, legal compliance, and dispute resolution. You may request deletion, subject to legal obligations.
        </p>
      </div>

      <div className={styles.section}>
        <h2>8. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies, pixels, and similar technologies to enhance browsing, analyze traffic, and remember preferences. Types: essential, analytical, and marketing cookies. You can control cookies via browser settings. Disabling cookies may affect functionality.
        </p>
      </div>

      <div className={styles.section}>
        <h2>9. Your Rights and Choices</h2>
        <p>
          Depending on jurisdiction, you may have rights such as:
        </p>
        <ul className={styles.bulletList}>
          <li>Right to Access</li>
          <li>Right to Rectification</li>
          <li>Right to Erasure</li>
          <li>Right to Restrict Processing</li>
          <li>Right to Data Portability</li>
          <li>Right to Object</li>
          <li>Right to Withdraw Consent</li>
        </ul>
        <p>
          Contact us to exercise these rights. We respond within 30 days or as legally required.
        </p>
      </div>

      <div className={styles.section}>
        <h2>10. Third-Party Links and Services</h2>
        <p>
          Our site may link to external services. We are not responsible for their privacy practices. Review third-party policies before sharing information.
        </p>
      </div>

      <div className={styles.section}>
        <h2>11. Children's Privacy</h2>
        <p>
          Services are not directed to individuals under 18. We do not knowingly collect data from children. If discovered, data will be deleted promptly.
        </p>
      </div>

      <div className={styles.section}>
        <h2>12. International Data Transfers</h2>
        <p>
          Your data may be processed in countries with different data laws. By using our services, you consent to such transfers, with safeguards in place.
        </p>
      </div>

      <div className={styles.section}>
        <h2>13. Changes to This Privacy Policy</h2>
        <p>
          We may update this policy periodically. Material changes will be posted on our website. Continued use after updates constitutes acceptance.
        </p>
      </div>

      <div className={styles.section}>
        <h2>14. Governing Law and Jurisdiction</h2>
        <p>
          This Privacy Policy is governed by the laws of the Republic of Kenya. All disputes are resolved exclusively in Kenyan courts, specifically in Nairobi County.
        </p>
      </div>

      <div className={styles.section}>
        <h2>15. Contact Information</h2>
        <p>
          For questions, exercising rights, or privacy concerns, contact us:
        </p>
        <ul className={styles.bulletList}>
          <li><strong>Email:</strong> info@charismafarm.com</li>
          <li><strong>Phone:</strong> (+254) 746-033-465</li>
          <li><strong>Business Address:</strong> CharismaFarm Ltd., Nairobi, Kenya 00100</li>
          <li><strong>Response Time:</strong> We respond within 30 days or as required by law</li>
        </ul>
      </div>

      <div className={styles.section}>
        <p>
          <strong>Last Updated:</strong> November 2025
        </p>
        <p>
          This Privacy Policy is effective immediately for new users. Continued use constitutes acceptance.
        </p>
      </div>
    </div>
  );
}
