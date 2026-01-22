"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function RefundPolicy() {
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
        <h1>Refund and Return Policy</h1>
      </div>

      <div className={styles.section}>
        <h2>1. Our Return Guarantee</h2>
        <p>
          CharismaFarm ("we," "us," "our," or "Company") is committed to customer satisfaction. We offer a thirty (30) calendar day return policy from the date of delivery to ensure your complete satisfaction with your organic farm products. If you are not entirely satisfied with your purchase, you may return eligible items within this period for a full refund, replacement, or exchange at our sole discretion.
        </p>
      </div>

      <div className={styles.section}>
        <h2>2. Eligibility Requirements for Returns</h2>
        <p>
          To be eligible for a return, refund, or exchange, items must meet all of the following conditions:
        </p>
        <ul className={styles.bulletList}>
          <li>Items must be returned within thirty (30) calendar days from the date of delivery as shown on your receipt or shipping confirmation</li>
          <li>Products must be in original, unused, unopened condition with all accessories, components, and documentation included</li>
          <li>Original packaging, labels, and all manufacturer materials must be intact and included with the return</li>
          <li>Items must not show evidence of wear, damage, misuse, or unauthorized modification</li>
          <li>Receipt or proof of purchase must be provided with the return</li>
          <li>For items used for trial purposes, the return is at our discretion following product inspection</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>3. Non-Returnable Items</h2>
        <p>
          The following items cannot be returned for health, safety, sanitary, or other regulatory reasons:
        </p>
        <ul className={styles.bulletList}>
          <li>Perishable goods, food items, and beverages that have been opened or stored</li>
          <li>Personal care and health items that have been opened, used, or exposed to environmental contaminants</li>
          <li>Custom-manufactured, personalized, or specially ordered items</li>
          <li>Items damaged by misuse, neglect, accident, or normal wear and tear</li>
          <li>Products purchased at special promotional prices or with limited-time discount codes (at Company discretion, case-by-case basis)</li>
          <li>Items returned without proper documentation or proof of purchase</li>
          <li>Consumable products that have been partially used or consumed</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>4. Return Authorization and Initiation Process</h2>
        <p>
          To initiate a return, you must contact our customer service team within thirty (30) calendar days of receiving your order. You may contact us via:
        </p>
        <ul className={styles.bulletList}>
          <li>Email: info@charismafarm.com</li>
          <li>Phone: (+254) 746-033-465</li>
          <li>Hours: Monday-Friday, 8:00 AM - 6:00 PM EAT</li>
        </ul>
        <p>
          You must provide your order number, reason for return, and photographs of any damage (if applicable). Upon approval, we will issue a Return Authorization Number (RAN) and provide detailed return shipping instructions. All returns must include the RAN on the package exterior. Returns without a RAN may be refused or delayed in processing.
        </p>
      </div>

      <div className={styles.section}>
        <h2>5. Return Shipping and Packaging</h2>
        <p>
          Upon receipt of your Return Authorization Number, package items securely using original materials or equivalent protective packaging. Include the RAN, original receipt, and a detailed explanation of the reason for return inside the package. Ship using a trackable method to the address provided with your return authorization. Keep your tracking number for verification purposes until the return is processed.
        </p>
      </div>

      <div className={styles.section}>
        <h2>6. Inspection and Refund Processing</h2>
        <p>
          Upon receipt of your returned item(s), we will inspect the package contents for compliance with our return eligibility requirements. This inspection process typically requires five (5) to seven (7) business days. If items meet all return requirements, we will process your refund and apply it to the original payment method within the same timeframe. Please note that additional processing time of three (3) to five (5) business days may be required by your financial institution before the refund is reflected in your account. CharismaFarm is not responsible for delays caused by financial institutions.
        </p>
      </div>

      <div className={styles.section}>
        <h2>7. Refund Amount</h2>
        <p>
          Refunds will be issued in the amount of the product purchase price. Refunds do not include original shipping charges, return shipping charges, or applicable transaction fees paid at the time of purchase. If you received a special promotional discount, the refund will reflect the discounted price paid, not the regular retail price. Gift cards used for purchase will be refunded as store credit.
        </p>
      </div>

      <div className={styles.section}>
        <h2>8. Exchanges</h2>
        <p>
          We are pleased to offer exchanges for items of equal or greater value. Exchanges are available within the same thirty (30) day return window and are subject to the same eligibility requirements as returns. If exchanging for an item of greater value, you will be responsible for payment of the difference. If exchanging for an item of lesser value, we will issue a refund for the difference. Exchanges will be shipped at Company expense; however, customers are responsible for return shipping costs of the original item.
        </p>
      </div>

      <div className={styles.section}>
        <h2>9. Damaged, Defective, or Incorrect Items</h2>
        <p>
          If you receive a damaged, defective, or incorrect item, please contact our customer service team immediately with photographic evidence. We will arrange for a full refund, replacement, or exchange at no cost to you, including return shipping at Company expense. You may be required to retain the damaged item or original packaging for our inspection. We reserve the right to collect information regarding the damage to prevent future occurrences.
        </p>
      </div>

      <div className={styles.section}>
        <h2>10. Return Shipping Costs</h2>
        <p>
          <strong>For Defective Items:</strong> We will cover all return shipping costs, including the cost of the return shipping label and any tracking services.
        </p>
        <p>
          <strong>For Customer Returns:</strong> Customers are responsible for return shipping costs unless the return results from Company error or defect. We do not offer prepaid return labels for standard returns; however, we may offer free return shipping promotions at our discretion during specified periods.
        </p>
      </div>

      <div className={styles.section}>
        <h2>11. International Returns</h2>
        <p>
          International customers may return items following the same thirty (30) day return policy. International customers are responsible for all return shipping costs, import/export charges, and applicable customs duties or taxes. We strongly recommend using insured, trackable shipping methods for items valued above KSh 10,000. Delivery timeframes and costs for international returns vary significantly and are the customer's responsibility.
        </p>
      </div>

      <div className={styles.section}>
        <h2>12. Restrictions on Returns</h2>
        <p>
          We reserve the right to refuse returns or refunds if: (a) the return period has expired; (b) the item does not meet eligibility requirements; (c) the item appears to be a counterfeit or unauthorized product; (d) the return is submitted without proper documentation; or (e) we determine the request is fraudulent or abusive. We also reserve the right to charge a restocking fee of up to 20% of the purchase price for items returned in less than pristine condition due to customer mishandling.
        </p>
      </div>

      <div className={styles.section}>
        <h2>13. Warranty and Manufacturer Coverage</h2>
        <p>
          Many of our farm products include manufacturer warranties separate from this return policy. Warranty coverage is determined by the manufacturer and may cover defects in materials and workmanship for specified periods. Please retain manufacturer documentation for warranty claims. Returns made outside the thirty (30) day window may be eligible for repair or replacement under applicable manufacturer warranties.
        </p>
      </div>

      <div className={styles.section}>
        <h2>14. Policy Exceptions</h2>
        <p>
          CharismaFarm reserves the right to make exceptions to this return policy on a case-by-case basis at our sole discretion. Such exceptions do not constitute a waiver of this policy or create any obligation for future exceptions. Any exceptions must be approved in writing by Company management.
        </p>
      </div>

      <div className={styles.section}>
        <h2>15. Governing Law and Dispute Resolution</h2>
        <p>
          This Refund and Return Policy shall be governed by and construed in accordance with the laws of the Republic of Kenya, without regard to conflict of law principles. All disputes, claims, or disagreements relating to refunds, returns, exchanges, or products shall be resolved exclusively in the courts of Kenya, specifically the courts of competent jurisdiction in Nairobi County. You irrevocably submit to the jurisdiction of Kenyan courts and agree that Kenyan law shall apply to all matters arising from this policy.
        </p>
      </div>

      <div className={styles.section}>
        <h2>16. Compliance with Kenyan Consumer Protection Laws</h2>
        <p>
          This policy is designed to comply with the Consumer Protection Act, 2012 of Kenya and other applicable Kenyan consumer protection legislation. Your rights under this policy are in addition to any statutory rights you may have under Kenyan law. If any provision of this policy conflicts with mandatory provisions of Kenyan law, the Kenyan legal requirement shall prevail.
        </p>
      </div>

      <div className={styles.section}>
        <h2>17. Contact Information and Dispute Resolution</h2>
        <p>
          For questions regarding this return policy, to initiate a return, or to file a complaint:
        </p>
        <ul className={styles.bulletList}>
          <li><strong>Email:</strong> info@charismafarm.com</li>
          <li><strong>Phone:</strong> (+254) 746-033-465</li>
          <li><strong>Physical Address:</strong> CharismaFarm Ltd., Nairobi, Kenya 00100</li>
          <li><strong>Hours:</strong> Monday - Friday, 8:00 AM - 6:00 PM EAT</li>
          <li><strong>Response Time:</strong> 24 business hours (as required by Kenyan consumer protection standards)</li>
        </ul>
      </div>

      <div className={styles.section}>
        <p>
          <strong>Last Updated:</strong> November 2025
        </p>
        <p>
          This Refund and Return Policy is effective immediately. CharismaFarm reserves the right to modify this policy at any time. Material changes will be posted on our website with updated effective dates. Continued use of our services following policy modifications constitutes acceptance of the updated policy.
        </p>
      </div>
    </div>
  );
}
