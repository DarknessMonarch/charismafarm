"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import styles from "@/app/style/delivery.module.css";
import Loading from "@/app/components/Loader";

import {
  IoLocationOutline as LocationIcon,
  IoCallOutline as PhoneIcon,
  IoPersonOutline as PersonIcon,
  IoCarOutline as CarIcon,
  IoCheckmarkCircle as CheckIcon,
  IoTimeOutline as TimeIcon,
  IoRefreshOutline as RefreshIcon,
  IoNavigateOutline as NavigateIcon,
  IoReceiptOutline as ReceiptIcon,
  IoPowerOutline as PowerIcon,
} from "react-icons/io5";
import {
  MdLocalShipping as TruckIcon,
  MdInventory2 as BoxIcon,
  MdDoneAll as DoneAllIcon,
} from "react-icons/md";
import { FaWhatsapp as WhatsappIcon } from "react-icons/fa";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "processing", label: "Ready to Pick" },
  { key: "shipped", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
];

const DRIVER_STATUS_CONFIG = {
  available: { label: "Available", color: "#16a34a", bg: "#dcfce7" },
  busy: { label: "On Delivery", color: "#d97706", bg: "#fef3c7" },
  offline: { label: "Offline", color: "#6b7280", bg: "#f3f4f6" },
};

export default function DeliveryDashboard() {
  const router = useRouter();
  const {
    isAuth, emailVerified, isDriver, isAdmin,
    username, driverStatus,
    getDriverOrders, driverUpdateOrder, driverRespondOrder, updateDriverStatus,
  } = useEcommerceStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [noteModal, setNoteModal] = useState({ open: false, order: null, action: null });
  const [noteText, setNoteText] = useState("");
  const [respondingOrder, setRespondingOrder] = useState(null);

  const canAccess = isAuth && emailVerified && (isDriver || isAdmin);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const result = await getDriverOrders();
    if (result.success) {
      setOrders(result.data.orders || []);
    } else {
      toast.error(result.message || "Failed to load orders");
    }
    setLoading(false);
  }, [getDriverOrders]);

  useEffect(() => {
    if (!isAuth || !emailVerified) {
      router.push("/authentication/login");
      return;
    }
    if (!isDriver && !isAdmin) {
      router.push("/");
      return;
    }
    loadOrders();
  }, [isAuth, emailVerified, isDriver, isAdmin, router, loadOrders]);

  const handleToggleStatus = async (newStatus) => {
    if (togglingStatus) return;
    setTogglingStatus(true);
    const result = await updateDriverStatus(newStatus);
    if (result.success) {
      toast.success(`Status set to ${DRIVER_STATUS_CONFIG[newStatus].label}`);
    } else {
      toast.error(result.message || "Failed to update status");
    }
    setTogglingStatus(false);
  };

  const openNoteModal = (order, action) => {
    setNoteText("");
    setNoteModal({ open: true, order, action });
  };

  const handleOrderAction = async () => {
    const { order, action } = noteModal;
    if (!order || !action) return;
    setUpdatingOrder(order._id);
    setNoteModal({ open: false, order: null, action: null });

    const result = await driverUpdateOrder(order._id, action, noteText);
    if (result.success) {
      const msg = action === "pickup" ? "Order marked as picked up!" : "Order marked as delivered!";
      toast.success(msg);
      await loadOrders();
    } else {
      toast.error(result.message || "Failed to update order");
    }
    setUpdatingOrder(null);
  };

  const handleRespond = async (order, action) => {
    setRespondingOrder(order._id);
    const result = await driverRespondOrder(order._id, action);
    if (result.success) {
      const msg = action === "accept" ? "Order accepted!" : "Order declined.";
      toast.success(msg);
      await loadOrders();
    } else {
      toast.error(result.message || "Failed to respond");
    }
    setRespondingOrder(null);
  };

  const openMaps = (address) => {
    const query = encodeURIComponent(`${address.address}, ${address.city}`);
    window.open(`https://maps.google.com/?q=${query}`, "_blank");
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "all") return true;
    return o.orderStatus === activeTab;
  });

  const stats = {
    assigned: orders.filter((o) => ["processing", "shipped"].includes(o.orderStatus)).length,
    inTransit: orders.filter((o) => o.orderStatus === "shipped").length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
  };

  const statusConfig = DRIVER_STATUS_CONFIG[driverStatus] || DRIVER_STATUS_CONFIG.offline;

  if (!canAccess) return null;

  return (
    <div className={styles.deliveryPage}>
      <div className={styles.deliveryContainer}>

        {/* Driver Status Hero */}
        <div className={styles.statusHero}>
          <div className={styles.driverInfo}>
            <div className={styles.driverAvatar}>
              <CarIcon />
            </div>
            <div>
              <h1>{username}</h1>
              <p className={styles.driverRole}>Delivery Driver</p>
            </div>
          </div>

          <div className={styles.statusControl}>
            <span className={styles.statusLabel}>Status</span>
            <div className={styles.statusToggleGroup}>
              {Object.entries(DRIVER_STATUS_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  className={`${styles.statusToggleBtn} ${driverStatus === key ? styles.statusActive : ""}`}
                  style={driverStatus === key ? { backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.color } : {}}
                  onClick={() => handleToggleStatus(key)}
                  disabled={togglingStatus || driverStatus === key}
                >
                  <span className={styles.statusDot} style={{ backgroundColor: cfg.color }} />
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className={styles.statsStrip}>
          <div className={styles.statCard}>
            <BoxIcon className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.assigned}</span>
              <span className={styles.statLabel}>Assigned</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <TruckIcon className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.inTransit}</span>
              <span className={styles.statLabel}>In Transit</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <DoneAllIcon className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.delivered}</span>
              <span className={styles.statLabel}>Delivered</span>
            </div>
          </div>
          <button
            className={`${styles.statCard} ${styles.refreshCard}`}
            onClick={loadOrders}
            disabled={loading}
          >
            <RefreshIcon className={`${styles.statIcon} ${loading ? styles.spinning : ""}`} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>Refresh</span>
              <span className={styles.statLabel}>Reload orders</span>
            </div>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNav}>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tabBtn} ${activeTab === tab.key ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.key !== "all" && (
                <span className={styles.tabCount}>
                  {orders.filter((o) => o.orderStatus === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className={styles.loadingContainer}><Loading /></div>
        ) : filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <TruckIcon className={styles.emptyIcon} />
            <h3>No orders here</h3>
            <p>
              {activeTab === "all"
                ? "You have no assigned orders yet."
                : `No orders with status "${activeTab}".`}
            </p>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order._id;
              const isUpdating = updatingOrder === order._id;
              const isResponding = respondingOrder === order._id;
              const isPendingResponse = order.driverAccepted === null || order.driverAccepted === undefined;
              const canPickup = !isPendingResponse && order.orderStatus === "processing";
              const canDeliver = !isPendingResponse && order.orderStatus === "shipped";

              return (
                <div key={order._id} className={`${styles.orderCard} ${isUpdating ? styles.orderUpdating : ""} ${isPendingResponse ? styles.pendingCard : ""}`}>
                  {/* Card Header */}
                  <div
                    className={styles.orderCardHeader}
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                  >
                    <div className={styles.orderHeaderLeft}>
                      <div className={styles.orderNumRow}>
                        <span className={styles.orderNum}>#{order.orderNumber}</span>
                        {isPendingResponse ? (
                          <span className={styles.pendingBadge}>Awaiting Response</span>
                        ) : (
                          <span className={`${styles.orderStatus} ${styles[order.orderStatus]}`}>
                            {order.orderStatus === "processing" ? "Ready to Pick" :
                             order.orderStatus === "shipped" ? "In Transit" :
                             order.orderStatus === "delivered" ? "Delivered" : order.orderStatus}
                          </span>
                        )}
                      </div>
                      <div className={styles.orderMeta}>
                        <span className={styles.metaChip}>
                          <ReceiptIcon /> {order.items?.length || 0} item(s)
                        </span>
                        <span className={styles.metaChip}>
                          <LocationIcon /> {order.shippingAddress?.city || "Pickup"}
                        </span>
                      </div>
                    </div>
                    <div className={styles.orderHeaderRight}>
                      <strong className={styles.orderAmount}>Ksh {order.totalAmount?.toLocaleString()}</strong>
                      <span className={styles.expandToggle}>{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {/* Accept / Decline for newly assigned orders */}
                  {isPendingResponse && (
                    <div className={styles.respondActions}>
                      <p className={styles.respondPrompt}>You have been assigned this order. Can you deliver it?</p>
                      <div className={styles.respondBtns}>
                        <button
                          className={styles.acceptBtn}
                          onClick={() => handleRespond(order, "accept")}
                          disabled={isResponding}
                        >
                          <CheckIcon />
                          {isResponding ? "Processing..." : "Accept"}
                        </button>
                        <button
                          className={styles.declineBtn}
                          onClick={() => handleRespond(order, "decline")}
                          disabled={isResponding}
                        >
                          {isResponding ? "Processing..." : "Decline"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons — visible only after accepting */}
                  {(canPickup || canDeliver) && (
                    <div className={styles.quickActions}>
                      {canPickup && (
                        <button
                          className={styles.pickupBtn}
                          onClick={() => openNoteModal(order, "pickup")}
                          disabled={isUpdating}
                        >
                          <BoxIcon />
                          {isUpdating ? "Updating..." : "Confirm Pickup"}
                        </button>
                      )}
                      {canDeliver && (
                        <button
                          className={styles.deliverBtn}
                          onClick={() => openNoteModal(order, "deliver")}
                          disabled={isUpdating}
                        >
                          <CheckIcon />
                          {isUpdating ? "Updating..." : "Mark Delivered"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className={styles.orderExpanded}>

                      {/* Customer Info */}
                      <div className={styles.customerSection}>
                        <h4><PersonIcon /> Customer</h4>
                        <div className={styles.customerDetails}>
                          <div className={styles.detailRow}>
                            <PersonIcon className={styles.detailIcon} />
                            <span>{order.customerName || order.shippingAddress?.name || "Customer"}</span>
                          </div>
                          {(order.customerPhone || order.shippingAddress?.phone) && (
                            <div className={styles.detailRow}>
                              <PhoneIcon className={styles.detailIcon} />
                              <a
                                href={`tel:${order.customerPhone || order.shippingAddress?.phone}`}
                                className={styles.phoneLink}
                              >
                                {order.customerPhone || order.shippingAddress?.phone}
                              </a>
                            </div>
                          )}
                          {order.shippingAddress && (
                            <div className={styles.detailRow}>
                              <LocationIcon className={styles.detailIcon} />
                              <span>
                                {order.shippingAddress.address}, {order.shippingAddress.city}
                                {order.shippingAddress.notes && (
                                  <span className={styles.addressNote}> · {order.shippingAddress.notes}</span>
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Contact Actions */}
                        <div className={styles.contactActions}>
                          {order.shippingAddress && (
                            <button
                              className={styles.mapsBtn}
                              onClick={() => openMaps(order.shippingAddress)}
                            >
                              <NavigateIcon /> Navigate
                            </button>
                          )}
                          {(order.customerPhone || order.shippingAddress?.phone) && (
                            <a
                              href={`https://wa.me/${(order.customerPhone || order.shippingAddress?.phone)?.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.whatsappBtn}
                            >
                              <WhatsappIcon /> WhatsApp
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className={styles.itemsSection}>
                        <h4><BoxIcon /> Order Items</h4>
                        <div className={styles.itemsList}>
                          {order.items?.map((item, i) => (
                            <div key={i} className={styles.itemRow}>
                              <Image
                                src={item.image || "/assets/emptycart.png"}
                                alt={item.name}
                                width={48}
                                height={48}
                                className={styles.itemImg}
                              />
                              <div className={styles.itemInfo}>
                                <p className={styles.itemName}>{item.name}</p>
                                <p className={styles.itemMeta}>Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Driver Notes */}
                      {order.driverNotes && (
                        <div className={styles.driverNotesSection}>
                          <h4><TimeIcon /> Notes</h4>
                          <p className={styles.driverNotesText}>{order.driverNotes}</p>
                        </div>
                      )}

                      {/* Tracking */}
                      {order.trackingNumber && (
                        <Link
                          href={`/track?number=${order.trackingNumber}`}
                          className={styles.trackingLink}
                        >
                          <LocationIcon />
                          {order.trackingNumber}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Note Modal */}
      {noteModal.open && (
        <div className={styles.modalOverlay} onClick={() => setNoteModal({ open: false, order: null, action: null })}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3>
              {noteModal.action === "pickup" ? "Confirm Pickup" : "Confirm Delivery"}
            </h3>
            <p className={styles.modalSub}>
              {noteModal.action === "pickup"
                ? `Confirm you have picked up order #${noteModal.order?.orderNumber} from the store.`
                : `Confirm you have delivered order #${noteModal.order?.orderNumber} to the customer.`}
            </p>
            <div className={styles.noteField}>
              <label>Note (optional)</label>
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={
                  noteModal.action === "pickup"
                    ? "e.g. All items verified and packed"
                    : "e.g. Left at reception, customer confirmed"
                }
                className={styles.noteTextarea}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setNoteModal({ open: false, order: null, action: null })}
              >
                Cancel
              </button>
              <button
                className={noteModal.action === "pickup" ? styles.modalPickupBtn : styles.modalDeliverBtn}
                onClick={handleOrderAction}
              >
                {noteModal.action === "pickup" ? "Confirm Pickup" : "Confirm Delivery"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
