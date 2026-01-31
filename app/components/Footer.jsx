"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import VisaCard from "@/public/assets/visa.png";
import MpesaLogo from "@/public/assets/mpesa.png";
import styles from "@/app/style/footer.module.css";
import MasterCard from "@/public/assets/masterCard.png";
import AirtelMoney from "@/public/assets/airtelMoney.png";

import { MdEmail as EmailIcon, MdLocationOn as LocationIcon } from "react-icons/md";
import { IoCall as PhoneIcon } from "react-icons/io5";
import { FaApple as AppleIcon, FaWhatsapp as WhatsappIcon, FaFacebookF as FacebookIcon } from "react-icons/fa";
import { FaTiktok as TiktokIcon } from "react-icons/fa6";
import { BsInstagram as InstagramIcon } from "react-icons/bs";
import { IoLogoGooglePlaystore as PlaystoreIcon } from "react-icons/io5";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/charismafarm", "_blank");
  };

  const handleTiktokClick = () => {
    window.open("https://www.tiktok.com/@charismafarm", "_blank");
  };

  const handleFacebookClick = () => {
    window.open("https://www.facebook.com/charismafarm", "_blank");
  };

  const handleWhatsappClick = () => {
    const message = encodeURIComponent("Hello! I'd like to learn more about CharismaFarm products.");
    window.open(`https://wa.me/254746033465?text=${message}`, "_blank");
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSubscribing(true);
    // Newsletter subscription logic would go here
    setTimeout(() => {
      toast.success("Welcome to the Charisma family! Check your email for your 5% discount code.");
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.newsletter}>
        <div className={styles.newsletterText}>
          <h3>Get 5% Off Your First Order!</h3>
          <p>Join the Charisma family and receive exclusive discounts, fresh produce updates, and organic farming tips.</p>
        </div>
        <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
          <input
            type="email"
            placeholder="Enter your email"
            className={styles.newsletterInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className={styles.subscribeBtn}
            disabled={isSubscribing}
          >
            {isSubscribing ? "Joining..." : "Join Now"}
          </button>
        </form>
      </div>

      <div className={styles.footerContent}>
        <div className={styles.footerGrid}>
          <div className={styles.footerSection}>
            <h4>CharismaFarm</h4>
            <div className={styles.contactInfo}>
              <div className={styles.address}>
                <LocationIcon aria-label="Location Icon" className={styles.locationIcon} />
                <div>
                  <p><strong>Farm Location:</strong></p>
                  <p>Kiambu County, Kenya</p>
                  <p>Off Limuru Road, Near Banana Hill</p>
                </div>
              </div>
              <div className={styles.phone}>
                <PhoneIcon aria-label="Phone Icon" className={styles.phoneIcon} />
                <div>
                  <p><strong>Phone:</strong></p>
                  <p>(+254) 746-033-465</p>
                </div>
              </div>
              <div className={styles.email}>
                <EmailIcon aria-label="Email Icon" className={styles.emailIcon} />
                <div>
                  <p><strong>Email:</strong></p>
                  <p>info@charismafarm.com</p>
                </div>
              </div>
            </div>
            <div className={styles.socialIcons}>
              <button
                onClick={handleWhatsappClick}
                className={`${styles.socialIcon} ${styles.whatsappIcon}`}
                aria-label="WhatsApp"
              >
                <WhatsappIcon aria-label="WhatsApp Icon" />
              </button>
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
              <button
                onClick={handleFacebookClick}
                className={styles.socialIcon}
                aria-label="Facebook"
              >
                <FacebookIcon aria-label="Facebook Icon" />
              </button>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <div className={styles.footerLinksContainer}>
              <Link href="/" className={styles.footerLink}>Home</Link>
              <Link href="/products" className={styles.footerLink}>Shop</Link>
              <Link href="/about" className={styles.footerLink}>About Us</Link>
              <Link href="/blog" className={styles.footerLink}>Blog</Link>
              <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4>Legal</h4>
            <div className={styles.footerLinksContainer}>
              <Link href="/terms" className={styles.footerLink}>Terms & Conditions</Link>
              <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
              <Link href="/refund" className={styles.footerLink}>Refund Policy</Link>
              <Link href="/delivery" className={styles.footerLink}>Delivery Information</Link>
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
          <p>&copy; {new Date().getFullYear()} CharismaFarm. All rights reserved.</p>
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
