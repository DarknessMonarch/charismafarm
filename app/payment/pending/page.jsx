"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "@/app/style/orderconfirmation.module.css";
import Loading from "@/app/components/Loader";

import {
  IoTimeOutline as PendingIcon,
  IoHomeOutline as HomeIcon,
  IoCardOutline as PayIcon,
} from "react-icons/io5";
import { FaWhatsapp as WhatsappIcon } from "react-icons/fa";

function PendingContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hello! I have a pending order ${orderNumber ? `#${orderNumber}` : ""} and would like to complete the payment.`
    );
    window.open(`https://wa.me/254746033465?text=${message}`, "_blank");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.loadingState}>
          <PendingIcon style={{ fontSize: "80px", color: "#ffc107" }} />
          <h2>Payment Not Completed</h2>
          <p>Your payment was not completed. No charge was made and no order was placed.</p>
          <p>You can go back and try again, or contact us if you need help.</p>
        </div>

        <div className={styles.actions}>
          <Link href="/payment" className={styles.primaryBtn}>
            <PayIcon /> Try Again
          </Link>
          <button onClick={handleWhatsAppContact} className={styles.secondaryBtn} style={{ backgroundColor: "#25D366", color: "#fff" }}>
            <WhatsappIcon /> Contact Support
          </button>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Link href="/" style={{ color: "var(--secondary-color)", fontSize: "14px" }}>
            <HomeIcon style={{ marginRight: "5px" }} /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loadingState}>
            <Loading />
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    }>
      <PendingContent />
    </Suspense>
  );
}
