"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import { useTestimonialStore } from "@/app/store/testimonialStore";
import styles from "@/app/style/account.module.css";
import Loading from "@/app/components/Loader";
import Nothing from "@/app/components/Nothing";
import EmptyCart from "@/public/assets/emptycart.png";

import {
  IoPersonOutline as PersonIcon,
  IoMailOutline as MailIcon,
  IoCallOutline as PhoneIcon,
  IoReceiptOutline as OrderIcon,
  IoCheckmarkCircle as DeliveredIcon,
  IoTimeOutline as PendingIcon,
  IoCloseCircle as CancelIcon,
  IoLocationOutline as LocationIcon,
  IoClose as CloseIcon,
  IoCameraOutline as CameraIcon,
  IoShieldCheckmarkOutline as ShieldIcon,
  IoTrashOutline as TrashIcon,
  IoChevronForward as ChevronIcon,
  IoLogOutOutline as LogoutIcon,
} from "react-icons/io5";
import {
  MdLocalShipping as ShippingIcon,
  MdStar as StarIcon,
  MdStorefront as StoreIcon,
  MdTrendingUp as TrendIcon,
} from "react-icons/md";
import { FaWhatsapp as WhatsappIcon } from "react-icons/fa";

const STATUS_COLORS = {
  pending: { bg: "#fef9c3", text: "#854d0e" },
  processing: { bg: "#dbeafe", text: "#1e40af" },
  shipped: { bg: "#e0e7ff", text: "#3730a3" },
  delivered: { bg: "#dcfce7", text: "#14532d" },
  cancelled: { bg: "#fee2e2", text: "#991b1b" },
};

const STATUS_ICONS = {
  pending: PendingIcon,
  processing: ShippingIcon,
  shipped: ShippingIcon,
  delivered: DeliveredIcon,
  cancelled: CancelIcon,
};

const TABS = ["overview", "orders", "reviews", "settings"];

export default function AccountPage() {
  const router = useRouter();
  const {
    isAuth, emailVerified, username, email, phone, profileImage,
    accessToken, orders, ordersLoading, getOrders, updateProfile, logout,
    deleteAccount, requestPasswordReset,
  } = useEcommerceStore();
  const { canSubmitTestimonial, createTestimonial, loading: testimonialLoading } = useTestimonialStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [orderFilter, setOrderFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [profileForm, setProfileForm] = useState({ username: "", phone: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const [reviewModal, setReviewModal] = useState({ open: false, order: null });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [canReview, setCanReview] = useState({});

  useEffect(() => {
    if (!isAuth || !emailVerified) {
      router.push("/authentication/login");
      return;
    }
    setProfileForm({ username: username || "", phone: phone || "" });
    getOrders();
  }, [isAuth, emailVerified, router, username, phone, getOrders]);

  useEffect(() => {
    const checkReviews = async () => {
      if (!accessToken || !orders.length) return;
      const delivered = orders.filter((o) => o.orderStatus === "delivered");
      const eligibility = {};
      for (const order of delivered) {
        const r = await canSubmitTestimonial(order._id, accessToken);
        eligibility[order._id] = r.success && r.data?.canSubmit;
      }
      setCanReview(eligibility);
    };
    checkReviews();
  }, [orders, accessToken, canSubmitTestimonial]);

  const filteredOrders = orders.filter((o) =>
    orderFilter === "all" ? true : o.orderStatus === orderFilter
  );

  const stats = {
    total: orders.length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    pending: orders.filter((o) => ["pending", "processing", "shipped"].includes(o.orderStatus)).length,
    spent: orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.totalAmount, 0),
  };

  const deliveredOrdersWithReviews = orders.filter(
    (o) => o.orderStatus === "delivered"
  );

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.username.trim()) {
      toast.error("Username is required");
      return;
    }
    setSavingProfile(true);
    const result = await updateProfile({ username: profileForm.username, phone: profileForm.phone });
    if (result.success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(result.message || "Failed to update profile");
    }
    setSavingProfile(false);
  };

  const handlePasswordReset = async () => {
    setSendingReset(true);
    const result = await requestPasswordReset(email);
    if (result.success) {
      toast.success("Password reset link sent to your email");
    } else {
      toast.error(result.message || "Failed to send reset email");
    }
    setSendingReset(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== email) {
      toast.error("Email doesn't match");
      return;
    }
    setDeletingAccount(true);
    const result = await deleteAccount(email);
    if (result.success) {
      toast.success("Account deleted");
      router.push("/");
    } else {
      toast.error(result.message || "Failed to delete account");
      setDeletingAccount(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleOpenReview = (order) => {
    setReviewForm({ rating: 5, comment: "" });
    setReviewModal({ open: true, order });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    const result = await createTestimonial(
      { orderId: reviewModal.order._id, rating: reviewForm.rating, comment: reviewForm.comment },
      accessToken
    );
    if (result.success) {
      toast.success("Review submitted! It will appear after approval.");
      setCanReview((prev) => ({ ...prev, [reviewModal.order._id]: false }));
      setReviewModal({ open: false, order: null });
    } else {
      toast.error(result.message || "Failed to submit review");
    }
  };

  if (!isAuth) return null;

  return (
    <div className={styles.accountPage}>
      <div className={styles.accountContainer}>

        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            {profileImage ? (
              <Image src={profileImage} alt={username} width={80} height={80} className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h1>Hello, {username} 👋</h1>
            <p className={styles.profileEmail}>{email}</p>
            {phone && <p className={styles.profilePhone}>{phone}</p>}
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Strip */}
        <div className={styles.statsStrip}>
          <div className={styles.statCard}>
            <OrderIcon className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.total}</span>
              <span className={styles.statLabel}>Total Orders</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <DeliveredIcon className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.delivered}</span>
              <span className={styles.statLabel}>Delivered</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <PendingIcon className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.pending}</span>
              <span className={styles.statLabel}>In Progress</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <TrendIcon className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>Ksh {stats.spent.toLocaleString()}</span>
              <span className={styles.statLabel}>Total Spent</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNav}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className={styles.tabContent}>
            <div className={styles.overviewGrid}>
              <div className={styles.recentSection}>
                <div className={styles.sectionHeader}>
                  <h2>Recent Orders</h2>
                  <button className={styles.seeAllBtn} onClick={() => setActiveTab("orders")}>
                    See all <ChevronIcon />
                  </button>
                </div>
                {ordersLoading ? (
                  <div className={styles.loadingInline}><Loading /></div>
                ) : orders.length === 0 ? (
                  <div className={styles.emptyMini}>
                    <Nothing NothingImage={EmptyCart} Text="No orders yet" Alt="No orders" />
                    <Link href="/products" className={styles.shopNowBtn}>Start Shopping</Link>
                  </div>
                ) : (
                  orders.slice(0, 3).map((order) => {
                    const StatusIcon = STATUS_ICONS[order.orderStatus] || PendingIcon;
                    const colors = STATUS_COLORS[order.orderStatus] || { bg: "#f3f4f6", text: "#6b7280" };
                    return (
                      <div key={order._id} className={styles.recentOrderCard} onClick={() => { setActiveTab("orders"); setExpandedOrder(order._id); }}>
                        <div className={styles.recentOrderImages}>
                          {order.items.slice(0, 3).map((item, i) => (
                            <Image key={i} src={item.image || "/assets/emptycart.png"} alt={item.name} width={44} height={44} className={styles.recentItemImg} />
                          ))}
                        </div>
                        <div className={styles.recentOrderMeta}>
                          <span className={styles.recentOrderNum}>#{order.orderNumber}</span>
                          <span className={styles.recentOrderDate}>
                            {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <div className={styles.recentOrderRight}>
                          <div className={styles.miniStatus} style={{ backgroundColor: colors.bg, color: colors.text }}>
                            <StatusIcon />
                            <span>{order.orderStatus}</span>
                          </div>
                          <span className={styles.recentOrderTotal}>Ksh {order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className={styles.quickActions}>
                <h2>Quick Actions</h2>
                <div className={styles.actionsList}>
                  <Link href="/products" className={styles.actionItem}>
                    <StoreIcon className={styles.actionIcon} />
                    <span>Browse Products</span>
                    <ChevronIcon className={styles.actionChevron} />
                  </Link>
                  <Link href="/track" className={styles.actionItem}>
                    <LocationIcon className={styles.actionIcon} />
                    <span>Track an Order</span>
                    <ChevronIcon className={styles.actionChevron} />
                  </Link>
                  <button
                    className={styles.actionItem}
                    onClick={() => window.open("https://wa.me/254746033465", "_blank")}
                  >
                    <WhatsappIcon className={styles.actionIcon} />
                    <span>Contact Support</span>
                    <ChevronIcon className={styles.actionChevron} />
                  </button>
                  <button className={styles.actionItem} onClick={() => setActiveTab("settings")}>
                    <PersonIcon className={styles.actionIcon} />
                    <span>Edit Profile</span>
                    <ChevronIcon className={styles.actionChevron} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className={styles.tabContent}>
            <div className={styles.filterRow}>
              {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((f) => (
                <button
                  key={f}
                  className={`${styles.filterChip} ${orderFilter === f ? styles.activeChip : ""}`}
                  onClick={() => setOrderFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {ordersLoading ? (
              <div className={styles.loadingInline}><Loading /></div>
            ) : filteredOrders.length === 0 ? (
              <Nothing NothingImage={EmptyCart} Text={`No ${orderFilter === "all" ? "" : orderFilter} orders`} Alt="No orders" />
            ) : (
              <div className={styles.ordersList}>
                {filteredOrders.map((order) => {
                  const StatusIcon = STATUS_ICONS[order.orderStatus] || PendingIcon;
                  const colors = STATUS_COLORS[order.orderStatus] || { bg: "#f3f4f6", text: "#6b7280" };
                  const isExpanded = expandedOrder === order._id;
                  return (
                    <div key={order._id} className={styles.orderCard}>
                      <div className={styles.orderCardHeader} onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                        <div className={styles.orderCardLeft}>
                          <div className={styles.orderCardImages}>
                            {order.items.slice(0, 3).map((item, i) => (
                              <Image key={i} src={item.image || "/assets/emptycart.png"} alt={item.name} width={48} height={48} className={styles.orderThumb} />
                            ))}
                            {order.items.length > 3 && <div className={styles.moreThumb}>+{order.items.length - 3}</div>}
                          </div>
                          <div className={styles.orderCardMeta}>
                            <span className={styles.orderNum}>#{order.orderNumber}</span>
                            <span className={styles.orderDate}>
                              {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                          </div>
                        </div>
                        <div className={styles.orderCardRight}>
                          <div className={styles.statusPill} style={{ backgroundColor: colors.bg, color: colors.text }}>
                            <StatusIcon />
                            <span>{order.orderStatus}</span>
                          </div>
                          <strong className={styles.orderAmount}>Ksh {order.totalAmount.toLocaleString()}</strong>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className={styles.orderExpanded}>
                          <div className={styles.expandedItems}>
                            {order.items.map((item, i) => (
                              <div key={i} className={styles.expandedItem}>
                                <Image src={item.image || "/assets/emptycart.png"} alt={item.name} width={56} height={56} className={styles.expandedItemImg} />
                                <div className={styles.expandedItemInfo}>
                                  <p className={styles.expandedItemName}>{item.name}</p>
                                  <p className={styles.expandedItemMeta}>Qty: {item.quantity} × Ksh {item.price.toLocaleString()}</p>
                                </div>
                                <span className={styles.expandedItemTotal}>Ksh {(item.quantity * item.price).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          <div className={styles.expandedSummary}>
                            <div className={styles.summaryLine}><span>Subtotal</span><span>Ksh {order.subtotal.toLocaleString()}</span></div>
                            <div className={styles.summaryLine}><span>Delivery</span><span>Ksh {order.deliveryFee.toLocaleString()}</span></div>
                            <div className={`${styles.summaryLine} ${styles.summaryTotal}`}><span>Total</span><span>Ksh {order.totalAmount.toLocaleString()}</span></div>
                          </div>

                          {order.deliveryMethod === "delivery" && order.shippingAddress && (
                            <div className={styles.expandedAddress}>
                              <LocationIcon />
                              <span>{order.shippingAddress.address}, {order.shippingAddress.city}</span>
                            </div>
                          )}

                          {order.trackingNumber && (
                            <Link href={`/track?number=${order.trackingNumber}`} className={styles.trackLink}>
                              <LocationIcon />
                              Track: {order.trackingNumber}
                            </Link>
                          )}

                          <div className={styles.expandedActions}>
                            {order.orderStatus === "delivered" && canReview[order._id] && (
                              <button className={styles.reviewBtn} onClick={() => handleOpenReview(order)}>
                                <StarIcon /> Leave Review
                              </button>
                            )}
                            <button
                              className={styles.helpBtn}
                              onClick={() => window.open(`https://wa.me/254746033465?text=${encodeURIComponent(`Order #${order.orderNumber} inquiry`)}`, "_blank")}
                            >
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
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className={styles.tabContent}>
            <p className={styles.reviewsHint}>You can leave a review for delivered orders.</p>
            {deliveredOrdersWithReviews.length === 0 ? (
              <Nothing NothingImage={EmptyCart} Text="No delivered orders to review yet" Alt="No reviews" />
            ) : (
              <div className={styles.reviewList}>
                {deliveredOrdersWithReviews.map((order) => (
                  <div key={order._id} className={styles.reviewOrderCard}>
                    <div className={styles.reviewOrderInfo}>
                      <div className={styles.reviewOrderImages}>
                        {order.items.slice(0, 2).map((item, i) => (
                          <Image key={i} src={item.image || "/assets/emptycart.png"} alt={item.name} width={52} height={52} className={styles.reviewItemImg} />
                        ))}
                      </div>
                      <div>
                        <p className={styles.reviewOrderNum}>Order #{order.orderNumber}</p>
                        <p className={styles.reviewOrderDate}>
                          Delivered {new Date(order.deliveredAt || order.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        <p className={styles.reviewItemCount}>{order.items.length} item(s) · Ksh {order.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className={styles.reviewOrderAction}>
                      {canReview[order._id] ? (
                        <button className={styles.writeReviewBtn} onClick={() => handleOpenReview(order)}>
                          <StarIcon /> Write Review
                        </button>
                      ) : (
                        <span className={styles.reviewedBadge}>Reviewed ✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className={styles.tabContent}>
            <div className={styles.settingsGrid}>
              <div className={styles.settingsCard}>
                <h3><PersonIcon /> Profile Information</h3>
                <form className={styles.settingsForm} onSubmit={handleSaveProfile}>
                  <div className={styles.formField}>
                    <label>Username</label>
                    <input
                      type="text"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm((p) => ({ ...p, username: e.target.value }))}
                      placeholder="Enter username"
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="e.g. 0712345678"
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Email Address</label>
                    <input type="email" value={email} disabled className={styles.disabledInput} />
                    <span className={styles.fieldHint}>Email cannot be changed</span>
                  </div>
                  <button type="submit" className={styles.saveBtn} disabled={savingProfile}>
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>

              <div className={styles.settingsCard}>
                <h3><ShieldIcon /> Security</h3>
                <p className={styles.settingsDesc}>Change your password by requesting a reset link sent to your email.</p>
                <button className={styles.resetPwdBtn} onClick={handlePasswordReset} disabled={sendingReset}>
                  {sendingReset ? "Sending..." : "Send Password Reset Email"}
                </button>
              </div>

              <div className={`${styles.settingsCard} ${styles.dangerCard}`}>
                <h3><TrashIcon /> Delete Account</h3>
                <p className={styles.settingsDesc}>This action is permanent and cannot be undone. All your data will be removed.</p>
                <div className={styles.formField}>
                  <label>Type your email to confirm: <strong>{email}</strong></label>
                  <input
                    type="email"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="Enter your email to confirm"
                  />
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount || deleteConfirm !== email}
                >
                  {deletingAccount ? "Deleting..." : "Delete My Account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal.open && (
        <div className={styles.modalOverlay} onClick={() => setReviewModal({ open: false, order: null })}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setReviewModal({ open: false, order: null })}>
              <CloseIcon />
            </button>
            <h2>Leave a Review</h2>
            <p className={styles.modalSub}>Order #{reviewModal.order?.orderNumber}</p>
            <form className={styles.reviewForm} onSubmit={handleSubmitReview}>
              <div className={styles.starRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon
                    key={s}
                    className={`${styles.starIcon} ${s <= reviewForm.rating ? styles.starOn : styles.starOff}`}
                    onClick={() => setReviewForm((p) => ({ ...p, rating: s }))}
                  />
                ))}
              </div>
              <div className={styles.formField}>
                <label>Your Review</label>
                <textarea
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <button type="submit" className={styles.saveBtn} disabled={testimonialLoading}>
                {testimonialLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
