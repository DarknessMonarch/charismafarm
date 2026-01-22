"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function TermsOfUse() {
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
        <h1>Terms of Use</h1>
      </div>

      <div className={styles.section}>
        <h2>1. Acceptance of Terms and Agreement</h2>
        <p>
          By accessing, browsing, and using the CharismaFarm website (the "Website"), mobile application, and related services (collectively, the "Service"), you ("User," "you," or "your") agree to be fully bound by these Terms of Use ("Terms"). If you do not agree to all provisions of these Terms, you must immediately discontinue use of the Service. These Terms constitute a legally binding contract between you and CharismaFarm ("Company," "we," "us," or "our"). Your continued use of the Service following notice of changes to these Terms constitutes your acceptance of all modifications.
        </p>
      </div>

      <div className={styles.section}>
        <h2>2. Service Description and License Grant</h2>
        <p>
          CharismaFarm operates an e-commerce platform for the sale and distribution of organic farm products. We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for lawful, personal, non-commercial purposes. This license does not permit you to: (a) modify, copy, or reproduce materials without written authorization; (b) use materials for commercial purposes or public display; (c) reverse engineer, decompile, or disassemble any software or technology on our Website; (d) remove or alter copyright, trademark, or proprietary notices; (e) transfer, mirror, or resell materials; (f) use data mining, scraping, or similar technologies; or (g) use the Service for any unlawful purpose.
        </p>
      </div>

      <div className={styles.section}>
        <h2>3. User Accounts and Account Responsibilities</h2>
        <p>
          To access certain features of the Service, you must create an account. You agree to: (a) provide accurate, truthful, and current information at all times; (b) maintain and promptly update account information; (c) maintain strict confidentiality of your password and authentication credentials; (d) assume full responsibility for all activities and transactions occurring under your account; (e) immediately notify us of any unauthorized access or suspected security breach; and (f) be responsible for any damages resulting from failure to maintain account security. CharismaFarm reserves the right to suspend or terminate accounts that contain inaccurate information or violate these Terms.
        </p>
      </div>

      <div className={styles.section}>
        <h2>4. Products, Descriptions, and Pricing</h2>
        <p>
          We strive to provide accurate product descriptions, specifications, images, and pricing for all organic farm products offered on the Service. However, we do not warrant that product information is entirely accurate, complete, reliable, current, or error-free. We reserve the right, without prior notice, to: (a) correct any errors, inaccuracies, or omissions; (b) update product information and pricing; (c) change or remove products from inventory; and (d) refuse orders for any reason. All prices are subject to change without notice. We are not responsible for third-party price monitoring services or price comparison websites. Product images are for reference only and may not reflect exact color, size, or appearance.
        </p>
      </div>

      <div className={styles.section}>
        <h2>5. Orders, Payment, and Acceptance</h2>
        <p>
          By submitting an order through the Service, you make an offer to purchase products subject to these Terms and our then-current pricing. All orders are subject to verification, acceptance, and confirmation by CharismaFarm. We reserve the right to refuse, delay, or cancel any order for any reason, including: suspected fraudulent activity, payment issues, product unavailability, or violation of these Terms. No contract is formed until we send you an order confirmation via email. Payment must be received and cleared before processing and shipment of orders. All charges are final upon purchase completion unless otherwise specified.
        </p>
      </div>

      <div className={styles.section}>
        <h2>6. Payment Methods and Processing</h2>
        <p>
          We accept payments through Paystack, our integrated third-party payment processor, which supports M-Pesa, bank transfers, Visa, Mastercard, and Airtel Money. CharismaFarm does not directly store or process your payment card information. All payment data is securely transmitted to and processed by Paystack in accordance with PCI DSS compliance standards. By providing payment information, you warrant that you are authorized to use such payment methods and that the information is accurate. You authorize Paystack to charge your chosen payment method for the full purchase price, including any applicable taxes and shipping fees. For information about Paystack's security practices and data handling, please visit www.paystack.com. If payment is declined or fails, Paystack may attempt additional transactions or we may suspend your order. You are responsible for any fees charged by your financial institution related to failed payments.
        </p>
      </div>

      <div className={styles.section}>
        <h2>7. Prohibited Uses and Conduct</h2>
        <p>
          You agree not to use the Service for any unlawful, harmful, fraudulent, or prohibited purpose, including but not limited to:
        </p>
        <ul className={styles.bulletList}>
          <li>Violating any applicable federal, state, local, or international law or regulation</li>
          <li>Transmitting viruses, worms, malware, or any malicious code</li>
          <li>Attempting unauthorized access to our systems, networks, or databases</li>
          <li>Using the Service to commit identity theft, fraud, or impersonation</li>
          <li>Sending spam, phishing messages, or unsolicited communications</li>
          <li>Harvesting or collecting user information without consent</li>
          <li>Interfering with or disrupting the integrity or performance of the Service</li>
          <li>Creating multiple accounts for fraudulent purposes</li>
          <li>Reselling or redistributing Service access or products</li>
          <li>Circumventing security measures or authentication protocols</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>8. Intellectual Property Rights</h2>
        <p>
          The Website, Service, original content, materials, trademarks, logos, trade dress, and proprietary information are the exclusive property of CharismaFarm and its licensors. All intellectual property rights, including copyright, trademark, patent, and trade secret rights, are protected under applicable law. Your use of the Service does not grant you any ownership rights to our intellectual property. You may not use our trademarks, logos, or proprietary materials without prior written consent. All user-generated content submitted to the Service must not violate third-party intellectual property rights.
        </p>
      </div>

      <div className={styles.section}>
        <h2>9. User-Generated Content and Submissions</h2>
        <p>
          If you submit reviews, feedback, comments, or other content ("User Content") to the Service, you grant CharismaFarm a non-exclusive, worldwide, royalty-free, perpetual license to use, reproduce, distribute, and display such content. You represent and warrant that you own or have the right to submit User Content and that it does not infringe any third-party rights. You assume all liability for User Content you submit. We reserve the right to remove, modify, or refuse any User Content that is offensive, inaccurate, defamatory, or violates these Terms.
        </p>
      </div>

      <div className={styles.section}>
        <h2>10. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, RUKIHEALTH SHALL NOT BE LIABLE FOR: (A) ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES; (B) LOSS OF PROFITS, REVENUE, DATA, OR USE; (C) ANY DAMAGES RELATED TO SERVICE INTERRUPTIONS OR UNAVAILABILITY; OR (D) ANY CLAIM ARISING FROM YOUR USE OF OR RELIANCE ON THE SERVICE. THIS LIMITATION APPLIES EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME JURISDICTIONS DO NOT ALLOW LIMITATION OF LIABILITY, SO THIS PROVISION MAY NOT APPLY TO YOU.
        </p>
      </div>

      <div className={styles.section}>
        <h2>11. Disclaimer of Warranties</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, RUKIHEALTH DISCLAIMS ALL WARRANTIES, INCLUDING: (A) IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT; (B) WARRANTIES REGARDING ACCURACY, COMPLETENESS, OR RELIABILITY OF CONTENT; AND (C) WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. WE DO NOT WARRANT THAT DEFECTS WILL BE CORRECTED OR THAT THE SERVICE WILL MEET YOUR REQUIREMENTS.
        </p>
      </div>

      <div className={styles.section}>
        <h2>12. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless CharismaFarm and its officers, directors, employees, agents, and licensors from and against any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from: (a) your use of or conduct on the Service; (b) violation of these Terms; (c) violation of any third-party rights; or (d) any illegal or unauthorized activity related to your account or use of the Service.
        </p>
      </div>

      <div className={styles.section}>
        <h2>13. Privacy and Data Protection</h2>
        <p>
          Your use of the Service is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to our collection, use, and disclosure of personal information in accordance with our Privacy Policy. Please review the Privacy Policy to understand our data practices.
        </p>
      </div>

      <div className={styles.section}>
        <h2>14. Termination and Account Suspension</h2>
        <p>
          CharismaFarm may terminate, suspend, or restrict your account and access to the Service immediately, without prior notice or liability, at our sole discretion, for any reason, including: (a) violation of these Terms; (b) suspected fraudulent or illegal activity; (c) infringement of intellectual property rights; (d) conduct harmful to other users; or (e) non-payment of charges. Upon termination, your right to use the Service ceases immediately. You remain liable for any outstanding charges or damages resulting from your conduct.
        </p>
      </div>

      <div className={styles.section}>
        <h2>15. Modifications to Terms and Service</h2>
        <p>
          We reserve the right to modify, suspend, or discontinue the Service or these Terms at any time without prior notice. For material changes to these Terms, we will provide at least thirty (30) days' notice by posting updated Terms on our Website and updating the "Last Updated" date. Your continued use of the Service following notification of changes constitutes acceptance of the modified Terms. If you do not agree to modifications, you must discontinue use of the Service.
        </p>
      </div>

      <div className={styles.section}>
        <h2>16. Governing Law and Jurisdiction</h2>
        <p>
          These Terms of Use shall be governed by and construed in accordance with the laws of the Republic of Kenya, without regard to conflict of law principles. All disputes, claims, causes of action, or proceedings arising from or relating to these Terms, your use of the Service, or your relationship with CharismaFarm shall be exclusively resolved in the courts of Kenya, specifically the courts of competent jurisdiction in Nairobi County. You irrevocably consent to and submit to the jurisdiction and venue of these Kenyan courts. The governing law of Kenya shall apply regardless of whether you are accessing the Service from within Kenya or internationally.
        </p>
      </div>

      <div className={styles.section}>
        <h2>17. Compliance with Kenyan Law</h2>
        <p>
          CharismaFarm operates in compliance with all applicable laws of the Republic of Kenya, including but not limited to: the Consumer Protection Act, 2012; the Data Protection Act, 2019; the Computer Misuse and Cybercrimes Act, 2018; the Kenya Information and Communications Act, 1998; and the Constitution of Kenya, 2010. Your use of the Service constitutes acceptance of compliance with all Kenyan legal requirements. If any provision of these Terms conflicts with mandatory requirements of Kenyan law, the Kenyan legal requirement shall prevail, and the conflicting provision shall be modified to the minimum extent necessary.
        </p>
      </div>

      <div className={styles.section}>
        <h2>18. Severability and Waiver</h2>
        <p>
          If any provision of these Terms is held to be invalid, illegal, or unenforceable under Kenyan law, such provision shall be severed, and the remaining provisions shall continue in full force and effect. The failure of CharismaFarm to enforce any right or provision shall not constitute a waiver of that right or provision. Any waiver must be in writing and signed by an authorized representative of CharismaFarm.
        </p>
      </div>

      <div className={styles.section}>
        <h2>19. Entire Agreement</h2>
        <p>
          These Terms, together with our Privacy Policy, Return Policy, and any other posted policies, constitute the entire agreement between you and CharismaFarm regarding your use of the Service and supersede all prior and contemporaneous agreements, understandings, and communications. No course of dealing, course of performance, or trade usage shall be deemed to modify these Terms.
        </p>
      </div>

      <div className={styles.section}>
        <h2>20. Third-Party Links and Services</h2>
        <p>
          The Service may contain links to third-party websites, applications, and services that are not operated by CharismaFarm. We are not responsible for the content, accuracy, legality, or practices of third-party services. Your access to and use of third-party services is at your own risk and subject to their terms and conditions. We encourage you to review the terms and privacy policies of any third-party service before providing personal information.
        </p>
      </div>

      <div className={styles.section}>
        <h2>21. Export and Compliance</h2>
        <p>
          The Service and products sold through the Service are subject to Kenyan export control laws and applicable international trade regulations. You agree not to export or re-export any products, technology, or information without obtaining necessary government licenses or approvals from Kenyan authorities. You agree to comply with all applicable Kenyan laws regarding sanctions and trade restrictions.
        </p>
      </div>

      <div className={styles.section}>
        <h2>22. Accessibility and Accommodations</h2>
        <p>
          We are committed to ensuring the Service is accessible to all users in compliance with Kenyan accessibility standards and guidelines. If you experience accessibility issues or require specific accommodations, please contact us at info@charismafarm.com. We will work with you to provide reasonable accommodations within the scope of applicable Kenyan law.
        </p>
      </div>

      <div className={styles.section}>
        <h2>23. Contact Information and Legal Support</h2>
        <p>
          For questions, concerns, disputes, or legal matters regarding these Terms or the Service, please contact us:
        </p>
        <ul className={styles.bulletList}>
          <li><strong>Email:</strong> info@charismafarm.com</li>
          <li><strong>Phone:</strong> (+254) 700-000-000</li>
          <li><strong>Registered Address:</strong> CharismaFarm Ltd., Nairobi, Kenya 00100</li>
          <li><strong>Hours:</strong> Monday - Sunday, 8:00 AM - 6:00 PM EAT</li>
          <li><strong>Response Time:</strong> 24 business hours (as required by Kenyan standards)</li>
        </ul>
      </div>

      <div className={styles.section}>
        <p>
          <strong>Last Updated:</strong> November 2025
        </p>
        <p>
          These Terms of Use are effective immediately for new users and are subject to the laws of the Republic of Kenya. Existing users must accept these updated Terms within thirty (30) days of posting. Your continued use of the Service constitutes acceptance of these Terms as governed by Kenyan law. CharismaFarm reserves all rights not expressly granted in these Terms under Kenyan law.
        </p>
      </div>
    </div>
  );
}
