"use client";

import Link from "next/link";
import Image from "next/image";
import VisaCard from "@/public/assets/visa.png";
import MpesaLogo from "@/public/assets/mpesa.png";
import styles from "@/app/style/footer.module.css";
import MasterCard from "@/public/assets/masterCard.png";
import AirtelMoney from "@/public/assets/airtelMoney.png";

import { MdEmail as EmailIcon } from "react-icons/md";
import { IoCall as PhoneIcon } from "react-icons/io5";
import { FaApple as AppleIcon } from "react-icons/fa";
import { FaTiktok as TiktokIcon } from "react-icons/fa6";
import { BsInstagram as InstagramIcon } from "react-icons/bs";
import { IoLogoGooglePlaystore as PlaystoreIcon } from "react-icons/io5";

export default function Footer() {
  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/charismafarm", "_blank");
  };

  const handleTiktokClick = () => {
    window.open("https://www.tiktok.com/@charismafarm", "_blank");
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.newsletter}>
        <div className={styles.newsletterText}>
          <h3>Subscribe to our newsletter</h3>
          <p>Get updates on fresh farm produce, seasonal offers, and organic farming tips</p>
        </div>
        <div className={styles.newsletterForm}>
          <input
            type="email"
            placeholder="Enter your email"
            className={styles.newsletterInput}
          />
          <button className={styles.subscribeBtn}>Subscribe</button>
        </div>
      </div>

      <div className={styles.footerContent}>
        <div className={styles.footerGrid}>
          <div className={styles.footerSection}>
            <h4>CharismaFarm</h4>
            <div className={styles.contactInfo}>
              <div className={styles.phone}>
                <PhoneIcon aria-label="Phone Icon" className={styles.phoneIcon} />
                <p>(+254) 746-033-465</p>
              </div>
              <div className={styles.email}>
                <EmailIcon aria-label="Email Icon" className={styles.emailIcon} />
                <p>info@charismafarm.com</p>
              </div>
            </div>
            <div className={styles.socialIcons}>
              <button
                onClick={handleInstagramClick}
                className={styles.socialIcon}
                aria-label="Instagram"
              >
                <InstagramIcon aria-label="Instagram Icon" />
              </button>
              <button
                onClick={handleTiktokClick}
                className={styles.socialIcon}
                aria-label="TikTok"
              >
                <TiktokIcon aria-label="Tiktok Icon" />
              </button>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <div className={styles.footerLinksContainer}>
              <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
              <Link href="/refund" className={styles.footerLink}>Refund Policy</Link>
              <Link href="/terms" className={styles.footerLink}>Terms of Use</Link>
              <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4>Download App</h4>
            <div className={styles.appButtons}>
              <button className={styles.appButton}>
                <AppleIcon aria-label="Apple Icon" className={styles.appIcon} />
                <div>
                  <span>Coming soon on </span>
                  <strong>App Store</strong>
                </div>
              </button>
              <button className={styles.appButton}>
                <PlaystoreIcon aria-label="Playstore Icon" className={styles.appIcon} />
                <div>
                  <span>Coming soon on </span>
                  <strong>Google Play</strong>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.footerBottomContent}>
          <p>&copy; 2025. All rights reserved. CharismaFarm.</p>
          <div className={styles.paymentMethods}>
            <div className={styles.paymentIcons}>
              <Image
                src={MasterCard}
                alt="Mastercard"
                height={40}
                width={40}
                className={styles.paymentIcon}
              />
              <Image src={VisaCard} alt="Visa" height={40} width={40} className={styles.paymentIcon} />
              <Image
                src={MpesaLogo}
                alt="M-Pesa"
                height={40}
                width={40}
                className={styles.paymentIcon}
              />
              <Image
                src={AirtelMoney}
                alt="Airtel Money"
                height={40}
                width={40}
                className={styles.paymentIcon}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}