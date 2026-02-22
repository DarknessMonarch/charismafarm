"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import styles from "@/app/style/track.module.css";
import Loading from "@/app/components/Loader";

import {
  IoSearchOutline as SearchIcon,
  IoCheckmarkCircle as CheckIcon,
  IoTimeOutline as PendingIcon,
  IoCloseCircle as CancelIcon,
  IoReceiptOutline as OrderIcon,
  IoCalendarOutline as CalendarIcon,
  IoLocationOutline as LocationIcon,
} from "react-icons/io5";
import {
  MdLocalShipping as ShippingIcon,
  MdStorefront as ProcessingIcon,
  MdInventory as PackageIcon,
} from "react-icons/md";

const ORDER_STEPS = [
  { key: "pending", label: "Order Placed", icon: PendingIcon },
  { key: "processing", label: "Processing", icon: ProcessingIcon },
  { key: "shipped", label: "Shipped", icon: ShippingIcon },
  { key: "delivered", label: "Delivered", icon: CheckIcon },
];

const STATUS_ORDER = ["pending", "processing", "shipped", "delivered"];

function TrackingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { trackOrder } = useEcommerceStore();

  const [trackingInput, setTrackingInput] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const numberParam = searchParams.get("number");

  useEffect(() => {
    if (numberParam) {
      setTrackingInput(numberParam);
      handleSearch(numberParam);
    }
  }, [numberParam]);

  const handleSearch = async (number) => {
    const query = (number || trackingInput).trim();
    if (!query) return;

    setSearching(true);
    setError(null);
    setTrackingData(null);
    setHasSearched(true);

    const result = await trackOrder(query);

    if (result.success) {
      setTrackingData(result.data);
    } else {
      setError(result.message || "Order not found. Please check your tracking number.");
    }

    setSearching(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    router.replace(`/track?number=${trackingInput.trim()}`);
    handleSearch(trackingInput.trim());
  };

  const getStepStatus = (stepKey) => {
    if (!trackingData) return "upcoming";
    if (trackingData.orderStatus === "cancelled") return "cancelled";

    const currentIndex = STATUS_ORDER.indexOf(trackingData.orderStatus);
    const stepIndex = STATUS_ORDER.indexOf(stepKey);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "upcoming";
  };

  const getStepTimestamp = (stepKey) => {
    if (!trackingData?.statusHistory) return null;
    const entry = [...trackingData.statusHistory]
      .reverse()
      .find((h) => h.status === stepKey);
    return entry ? new Date(entry.timestamp) : null;
  };

  const isCancelled = trackingData?.orderStatus === "cancelled";

  return (
    <div className={styles.trackPage}>
      <div className={styles.trackContainer}>
        <div className={styles.pageHeader}>
          <PackageIcon className={styles.headerIcon} />
          <h1>Track Your Order</h1>
          <p>Enter your tracking number to get real-time updates</p>
        </div>

        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <div className={styles.searchBox}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="Enter tracking number (e.g. TRK-XXXXXX-XXXXXXXX)"
              className={styles.searchInput}
            />
          </div>
          <button type="submit" className={styles.searchBtn} disabled={searching || !trackingInput.trim()}>
            {searching ? "Searching..." : "Track"}
          </button>
        </form>

        {searching && (
          <div className={styles.loadingContainer}>
            <Loading />
          </div>
        )}

        {!searching && error && hasSearched && (
          <div className={styles.errorCard}>
            <CancelIcon className={styles.errorIcon} />
            <h3>Order Not Found</h3>
            <p>{error}</p>
            <p className={styles.errorHint}>
              Check your tracking number from your{" "}
              <Link href="/orders" className={styles.link}>
                orders page
              </Link>{" "}
              or confirmation email.
            </p>
          </div>
        )}

        {!searching && trackingData && (
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <div className={styles.orderMeta}>
                <div className={styles.metaItem}>
                  <OrderIcon className={styles.metaIcon} />
                  <div>
                    <span className={styles.metaLabel}>Order Number</span>
                    <span className={styles.metaValue}>#{trackingData.orderNumber}</span>
                  </div>
                </div>
                <div className={styles.metaItem}>
                  <LocationIcon className={styles.metaIcon} />
                  <div>
                    <span className={styles.metaLabel}>Tracking Number</span>
                    <span className={styles.metaValue}>{trackingData.trackingNumber}</span>
                  </div>
                </div>
                {trackingData.estimatedDelivery && (
                  <div className={styles.metaItem}>
                    <CalendarIcon className={styles.metaIcon} />
                    <div>
                      <span className={styles.metaLabel}>Estimated Delivery</span>
                      <span className={styles.metaValue}>
                        {new Date(trackingData.estimatedDelivery).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className={`${styles.statusBadge} ${styles[trackingData.orderStatus]}`}>
                {trackingData.orderStatus === "delivered" && <CheckIcon />}
                {trackingData.orderStatus === "cancelled" && <CancelIcon />}
                {trackingData.orderStatus === "shipped" && <ShippingIcon />}
                {(trackingData.orderStatus === "pending" || trackingData.orderStatus === "processing") && <PendingIcon />}
                <span>{trackingData.orderStatus}</span>
              </div>
            </div>

            {!isCancelled && (
              <div className={styles.stepperSection}>
                <div className={styles.stepper}>
                  {ORDER_STEPS.map((step, index) => {
                    const stepStatus = getStepStatus(step.key);
                    const timestamp = getStepTimestamp(step.key);
                    const IconComponent = step.icon;
                    const isLast = index === ORDER_STEPS.length - 1;

                    return (
                      <div key={step.key} className={styles.stepWrapper}>
                        <div className={`${styles.step} ${styles[stepStatus]}`}>
                          <div className={styles.stepIconWrapper}>
                            <IconComponent className={styles.stepIcon} />
                          </div>
                          <div className={styles.stepInfo}>
                            <span className={styles.stepLabel}>{step.label}</span>
                            {timestamp && (
                              <span className={styles.stepTime}>
                                {timestamp.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}{" "}
                                {timestamp.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        {!isLast && (
                          <div
                            className={`${styles.stepConnector} ${
                              getStepStatus(ORDER_STEPS[index + 1].key) !== "upcoming" ||
                              getStepStatus(step.key) === "completed"
                                ? styles.connectorFilled
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {isCancelled && (
              <div className={styles.cancelledBanner}>
                <CancelIcon className={styles.cancelledIcon} />
                <div>
                  <h4>Order Cancelled</h4>
                  <p>This order has been cancelled. Contact support if you need assistance.</p>
                </div>
              </div>
            )}

            <div className={styles.historySection}>
              <h3>Status History</h3>
              <div className={styles.historyList}>
                {[...trackingData.statusHistory].reverse().map((entry, index) => (
                  <div key={index} className={styles.historyItem}>
                    <div className={styles.historyDot} />
                    <div className={styles.historyContent}>
                      <span className={styles.historyStatus}>{entry.status}</span>
                      {entry.note && <p className={styles.historyNote}>{entry.note}</p>}
                      <span className={styles.historyTime}>
                        {new Date(entry.timestamp).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at{" "}
                        {new Date(entry.timestamp).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.resultActions}>
              <Link href="/orders" className={styles.ordersLink}>
                View All Orders
              </Link>
              <a
                href={`https://wa.me/254746033465?text=${encodeURIComponent(`Hello! I have a question about my order #${trackingData.orderNumber} (Tracking: ${trackingData.trackingNumber}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.supportLink}
              >
                Need Help?
              </a>
            </div>
          </div>
        )}

        {!searching && !hasSearched && (
          <div className={styles.placeholder}>
            <ShippingIcon className={styles.placeholderIcon} />
            <p>Your tracking information will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TrackingFallback() {
  return (
    <div className={styles.trackPage}>
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<TrackingFallback />}>
      <TrackingContent />
    </Suspense>
  );
}
