"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import { useTestimonialStore } from "@/app/store/testimonialStore";
import styles from "@/app/style/orders.module.css";
import Loading from "@/app/components/Loader";
import Nothing from "@/app/components/Nothing";
import EmptyCart from "@/public/assets/emptycart.png";

import {
  IoReceiptOutline as OrderIcon,
  IoCheckmarkCircle as SuccessIcon,
  IoTimeOutline as PendingIcon,
  IoCloseCircle as FailedIcon,
  IoLocationOutline as LocationIcon,
  IoCallOutline as PhoneIcon,
  IoClose as CloseIcon,
} from "react-icons/io5";
import { MdLocalShipping as ShippingIcon, MdStar as StarIcon } from "react-icons/md";
import { FaWhatsapp as WhatsappIcon } from "react-icons/fa";

const STATUS_ICONS = {
  pending: PendingIcon,
  processing: ShippingIcon,
  shipped: ShippingIcon,
  delivered: SuccessIcon,
  cancelled: FailedIcon,
};

const STATUS_COLORS = {
  pending: "#ffc107",
  processing: "#17a2b8",
  shipped: "#007bff",
  delivered: "#28a745",
  cancelled: "#dc3545",
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuth, emailVerified, accessToken, orders, ordersLoading, getOrders } = useEcommerceStore();
  const { canSubmitTestimonial, createTestimonial, loading: testimonialLoading } = useTestimonialStore();
  const [filter, setFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [reviewModal, setReviewModal] = useState({ open: false, order: null });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [canReview, setCanReview] = useState({});

  useEffect(() => {
    if (!isAuth || !emailVerified) {
      router.push("/authentication/login");
      return;
    }
    getOrders();
  }, [isAuth, emailVerified, router, getOrders]);

  // Check which delivered orders can have reviews
  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!accessToken || orders.length === 0) return;

      const deliveredOrders = orders.filter(o => o.orderStatus === "delivered");
      const eligibility = {};

      for (const order of deliveredOrders) {
        const result = await canSubmitTestimonial(order._id, accessToken);
        eligibility[order._id] = result.success && result.data?.canSubmit;
      }

      setCanReview(eligibility);
    };

    checkReviewEligibility();
  }, [orders, accessToken, canSubmitTestimonial]);

  const handleOpenReview = (order) => {
    setReviewForm({ rating: 5, comment: "" });
    setReviewModal({ open: true, order });
  };

  const handleCloseReview = () => {
    setReviewModal({ open: false, order: null });
    setReviewForm({ rating: 5, comment: "" });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    const result = await createTestimonial({
      orderId: reviewModal.order._id,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    }, accessToken);

    if (result.success) {
      toast.success("Thank you for your review! It will be visible after approval.");
      setCanReview(prev => ({ ...prev, [reviewModal.order._id]: false }));
      handleCloseReview();
    } else {
      toast.error(result.message || "Failed to submit review");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.orderStatus === filter;
  });

  const handleWhatsAppInquiry = (order) => {
    const message = encodeURIComponent(
      `Hello! I have a question about my order #${order.orderNumber}. Order Status: ${order.orderStatus}`
    );
    window.open(`https://wa.me/254746033465?text=${message}`, "_blank");
  };

  if (ordersLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.ordersPage}>
      <div className={styles.ordersContainer}>
        <div className={styles.pageHeader}>
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        <div className={styles.filterTabs}>
          {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              className={`${styles.filterTab} ${filter === status ? styles.active : ""}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <Nothing NothingImage={EmptyCart} Text={`No ${filter === "all" ? "" : filter} orders yet`} Alt="No orders" />
            <Link href="/products" className={styles.shopBtn}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => {
              const StatusIcon = STATUS_ICONS[order.orderStatus] || PendingIcon;
              const statusColor = STATUS_COLORS[order.orderStatus] || "#6c757d";
              const isExpanded = expandedOrder === order._id;

              return (
                <div key={order._id} className={styles.orderCard}>
                  <div className={styles.orderHeader} onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                    <div className={styles.orderInfo}>
                      <div className={styles.orderNumber}>
                        <OrderIcon />
                        <span>#{order.orderNumber}</span>
                      </div>
                      <span className={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className={styles.orderStatus} style={{ backgroundColor: `${statusColor}20`, color: statusColor }}>
                      <StatusIcon />
                      <span>{order.orderStatus}</span>
                    </div>
                  </div>

                  <div className={styles.orderSummary}>
                    <div className={styles.orderItems}>
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className={styles.orderItem}>
                          <Image
                            src={item.image || "/assets/images/product-placeholder.jpg"}
                            alt={item.name}
                            width={50}
                            height={50}
                            className={styles.itemImage}
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className={styles.moreItems}>+{order.items.length - 3}</div>
                      )}
                    </div>
                    <div className={styles.orderTotal}>
                      <span>Total:</span>
                      <strong>Ksh {order.totalAmount.toLocaleString()}</strong>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={styles.orderDetails}>
                      <div className={styles.detailSection}>
                        <h4>Items</h4>
                        {order.items.map((item, idx) => (
                          <div key={idx} className={styles.detailItem}>
                            <Image
                              src={item.image || "/assets/images/product-placeholder.jpg"}
                              alt={item.name}
                              width={60}
                              height={60}
                            />
                            <div className={styles.detailItemInfo}>
                              <p className={styles.itemName}>{item.name}</p>
                              <p className={styles.itemMeta}>
                                Qty: {item.quantity} × Ksh {item.price.toLocaleString()}
                              </p>
                            </div>
                            <span className={styles.itemTotal}>
                              Ksh {(item.quantity * item.price).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className={styles.detailSection}>
                        <h4>Order Summary</h4>
                        <div className={styles.summaryRow}>
                          <span>Subtotal:</span>
                          <span>Ksh {order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryRow}>
                          <span>Delivery:</span>
                          <span>Ksh {order.deliveryFee.toLocaleString()}</span>
                        </div>
                        <div className={`${styles.summaryRow} ${styles.total}`}>
                          <span>Total:</span>
                          <span>Ksh {order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      {order.deliveryMethod === "delivery" && order.shippingAddress && (
                        <div className={styles.detailSection}>
                          <h4>Delivery Address</h4>
                          <div className={styles.addressInfo}>
                            <p><LocationIcon /> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                            <p><PhoneIcon /> {order.shippingAddress.phone}</p>
                          </div>
                        </div>
                      )}

                      {order.trackingNumber && (
                        <div className={styles.trackingSection}>
                          <span>Tracking: </span>
                          <Link href={`/track?number=${order.trackingNumber}`} className={styles.trackingNumber}>
                            {order.trackingNumber}
                          </Link>
                        </div>
                      )}

                      <div className={styles.orderActions}>
                        {order.paymentStatus === "pending" && (
                          <Link href={`/payment?retry=${order._id}`} className={styles.payBtn}>
                            Complete Payment
                          </Link>
                        )}
                        {order.orderStatus === "delivered" && canReview[order._id] && (
                          <button className={styles.reviewBtn} onClick={() => handleOpenReview(order)}>
                            <StarIcon /> Leave a Review
                          </button>
                        )}
                        <button className={styles.supportBtn} onClick={() => handleWhatsAppInquiry(order)}>
                          <WhatsappIcon /> Get Help
                        </button>
                        {order.receiptUrl && (
                          <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" className={styles.receiptBtn}>
                            Download Receipt
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal.open && (
        <div className={styles.modalOverlay} onClick={handleCloseReview}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={handleCloseReview}>
              <CloseIcon />
            </button>
            <h2>Leave a Review</h2>
            <p className={styles.modalSubtitle}>Order #{reviewModal.order?.orderNumber}</p>

            <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
              <div className={styles.ratingField}>
                <label>Rating</label>
                <div className={styles.starRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`${styles.ratingStar} ${star <= reviewForm.rating ? styles.starFilled : styles.starEmpty}`}
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.commentField}>
                <label>Your Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with this order..."
                  rows={4}
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.submitReviewBtn}
                disabled={testimonialLoading}
              >
                {testimonialLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
