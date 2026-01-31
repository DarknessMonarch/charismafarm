"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import styles from "@/app/style/orderconfirmation.module.css";
import Loading from "@/app/components/Loader";

import {
  IoCheckmarkCircle as SuccessIcon,
  IoCloseCircle as ErrorIcon,
  IoReceiptOutline as ReceiptIcon,
  IoHomeOutline as HomeIcon,
  IoListOutline as OrdersIcon,
} from "react-icons/io5";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const { isAuth, verifyPayment, getCart } = useEcommerceStore();

  const [status, setStatus] = useState("verifying");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuth) {
      router.push("/authentication/login");
      return;
    }

    if (!reference) {
      setStatus("error");
      setError("No payment reference found");
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyPayment(reference);

        if (result.success) {
          setStatus("success");
          setOrder(result.data);
          await getCart();
          toast.success("Payment successful!");
        } else {
          setStatus("error");
          setError(result.message || "Payment verification failed");
        }
      } catch (err) {
        setStatus("error");
        setError("An error occurred during verification");
      }
    };

    verify();
  }, [reference, isAuth, verifyPayment, getCart, router]);

  if (status === "verifying") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loadingState}>
            <Loading />
            <h2>Verifying your payment...</h2>
            <p>Please wait while we confirm your transaction</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.errorState}>
            <ErrorIcon className={styles.errorIcon} />
            <h2>Payment Failed</h2>
            <p>{error}</p>
            <div className={styles.actions}>
              <Link href="/payment" className={styles.primaryBtn}>
                Try Again
              </Link>
              <Link href="/" className={styles.secondaryBtn}>
                <HomeIcon /> Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.successState}>
          <SuccessIcon className={styles.successIcon} />
          <h2>Payment Successful!</h2>
          <p>Thank you for your order. We&apos;ve sent a confirmation email with your order details.</p>
        </div>

        {order && (
          <div className={styles.orderDetails}>
            <div className={styles.orderHeader}>
              <h3>Order Details</h3>
              <span className={styles.orderNumber}>#{order.orderNumber}</span>
            </div>

            <div className={styles.detailRow}>
              <span>Tracking Number:</span>
              <span className={styles.trackingNumber}>{order.trackingNumber}</span>
            </div>

            <div className={styles.detailRow}>
              <span>Status:</span>
              <span className={styles.status}>{order.orderStatus}</span>
            </div>

            <div className={styles.detailRow}>
              <span>Delivery Method:</span>
              <span>{order.deliveryMethod === "delivery" ? "Home Delivery" : "Pickup"}</span>
            </div>

            {order.deliveryMethod === "delivery" && order.shippingAddress && (
              <div className={styles.detailRow}>
                <span>Deliver to:</span>
                <span>{order.shippingAddress.address}, {order.shippingAddress.city}</span>
              </div>
            )}

            <div className={styles.orderSummary}>
              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>Ksh {order.subtotal?.toLocaleString()}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery:</span>
                <span>Ksh {order.deliveryFee?.toLocaleString()}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total Paid:</span>
                <span>Ksh {order.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            {order.receiptUrl && (
              <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" className={styles.receiptLink}>
                <ReceiptIcon /> Download Receipt
              </a>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <Link href="/orders" className={styles.primaryBtn}>
            <OrdersIcon /> View My Orders
          </Link>
          <Link href="/products" className={styles.secondaryBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
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
      <VerifyContent />
    </Suspense>
  );
}
