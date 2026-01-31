"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import styles from "@/app/style/checkout.module.css";
import Loading from "@/app/components/Loader";

import {
  IoLocationOutline as LocationIcon,
  IoCallOutline as PhoneIcon,
  IoPersonOutline as PersonIcon,
  IoHomeOutline as HomeIcon,
  IoCartOutline as CartIcon,
  IoCheckmarkCircle as CheckIcon,
  IoWarning as WarningIcon,
} from "react-icons/io5";
import { MdLocalShipping as DeliveryIcon, MdStorefront as PickupIcon } from "react-icons/md";
import { FaCreditCard as CardIcon, FaMobileAlt as MpesaIcon } from "react-icons/fa";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuth, emailVerified, cart, getCart, createOrder, email, phone, username } = useEcommerceStore();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  const [deliverySettings, setDeliverySettings] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [distance, setDistance] = useState(null);
  const [calculatingFee, setCalculatingFee] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Kenya",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (!isAuth || !emailVerified) {
      router.push("/authentication/login");
      return;
    }

    const initCheckout = async () => {
      setLoading(true);
      await getCart();
      await fetchDeliverySettings();

      setShippingAddress((prev) => ({
        ...prev,
        fullName: username || "",
        phone: phone || "",
      }));

      setLoading(false);
    };

    initCheckout();
  }, [isAuth, emailVerified, router, getCart, username, phone]);

  const fetchDeliverySettings = async () => {
    try {
      const response = await fetch(`${SERVER_API}/delivery-settings`);
      const data = await response.json();
      if (data.status === "success") {
        setDeliverySettings(data.data.settings);
      }
    } catch (error) {
      console.error("Failed to fetch delivery settings:", error);
    }
  };

  const calculateDeliveryFee = useCallback(async (lat, lng) => {
    if (!lat || !lng) return;

    setCalculatingFee(true);
    setLocationError(null);

    try {
      const response = await fetch(`${SERVER_API}/delivery-settings/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          orderAmount: cart?.totalAmount || 0,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setDeliveryFee(data.data.deliveryFee);
        setDistance(data.data.distance);
        if (data.data.isFreeDelivery) {
          toast.success("You qualify for free delivery!");
        }
      } else {
        setLocationError(data.message);
        setDeliveryFee(0);
      }
    } catch (error) {
      setLocationError("Failed to calculate delivery fee");
    } finally {
      setCalculatingFee(false);
    }
  }, [cart?.totalAmount]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setCalculatingFee(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setShippingAddress((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
        await calculateDeliveryFee(latitude, longitude);
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        setCalculatingFee(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location access denied. Please enter your address manually.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location unavailable. Please enter your address manually.");
            break;
          default:
            toast.error("Could not get your location. Please enter address manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (data.address) {
        setShippingAddress((prev) => ({
          ...prev,
          address: data.display_name?.split(",").slice(0, 3).join(", ") || prev.address,
          city: data.address.city || data.address.town || data.address.county || prev.city,
          postalCode: data.address.postcode || prev.postalCode,
        }));
      }
    } catch (error) {
      console.error("Reverse geocode failed:", error);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (deliveryMethod === "delivery") {
      if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city) {
        toast.error("Please fill in all required delivery details");
        return false;
      }
      if (locationError) {
        toast.error("Your location is outside our delivery area");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmitOrder = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        deliveryMethod,
        paymentMethod,
        calculatedDeliveryFee: deliveryMethod === "delivery" ? deliveryFee : 0,
        customerLocation: deliveryMethod === "delivery" && shippingAddress.latitude ? {
          latitude: shippingAddress.latitude,
          longitude: shippingAddress.longitude,
        } : null,
      };

      if (deliveryMethod === "delivery") {
        orderData.shippingAddress = {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode || "",
          country: shippingAddress.country,
        };
      }

      const result = await createOrder(orderData);

      if (result.success) {
        if (typeof window !== "undefined" && window.PaystackPop) {
          const handler = window.PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: email,
            amount: Math.round(result.data.order.totalAmount * 100),
            currency: "KES",
            ref: result.data.reference,
            callback: function (response) {
              router.push(`/payment/verify?reference=${response.reference}`);
            },
            onClose: function () {
              toast.info("Payment cancelled. Your order has been saved.");
              router.push(`/payment/pending?order=${result.data.order.orderNumber}`);
            },
          });
          handler.openIframe();
        } else {
          window.location.href = result.data.paymentUrl;
        }
      } else {
        toast.error(result.message || "Failed to create order");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cartItems = cart?.items || [];
  const subtotal = cart?.totalAmount || 0;
  const total = subtotal + (deliveryMethod === "delivery" ? deliveryFee : 0);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <CartIcon className={styles.emptyIcon} />
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart to checkout</p>
        <Link href="/products" className={styles.shopBtn}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutHeader}>
          <h1>Checkout</h1>
          <div className={styles.steps}>
            <div className={`${styles.step} ${step >= 1 ? styles.active : ""}`}>
              <span className={styles.stepNumber}>1</span>
              <span className={styles.stepLabel}>Delivery</span>
            </div>
            <div className={styles.stepLine}></div>
            <div className={`${styles.step} ${step >= 2 ? styles.active : ""}`}>
              <span className={styles.stepNumber}>2</span>
              <span className={styles.stepLabel}>Payment</span>
            </div>
          </div>
        </div>

        <div className={styles.checkoutContent}>
          <div className={styles.checkoutMain}>
            {step === 1 && (
              <div className={styles.deliverySection}>
                <h2>Delivery Method</h2>
                <div className={styles.deliveryOptions}>
                  <button
                    className={`${styles.deliveryOption} ${deliveryMethod === "delivery" ? styles.selected : ""}`}
                    onClick={() => setDeliveryMethod("delivery")}
                  >
                    <DeliveryIcon className={styles.optionIcon} />
                    <div className={styles.optionInfo}>
                      <h4>Delivery</h4>
                      <p>We deliver to your location</p>
                    </div>
                    {deliveryMethod === "delivery" && <CheckIcon className={styles.checkIcon} />}
                  </button>

                  {deliverySettings?.pickupEnabled && (
                    <button
                      className={`${styles.deliveryOption} ${deliveryMethod === "pickup" ? styles.selected : ""}`}
                      onClick={() => {
                        setDeliveryMethod("pickup");
                        setDeliveryFee(0);
                      }}
                    >
                      <PickupIcon className={styles.optionIcon} />
                      <div className={styles.optionInfo}>
                        <h4>Pickup</h4>
                        <p>Collect from our farm</p>
                      </div>
                      {deliveryMethod === "pickup" && <CheckIcon className={styles.checkIcon} />}
                    </button>
                  )}
                </div>

                {deliveryMethod === "delivery" && (
                  <div className={styles.addressSection}>
                    <div className={styles.addressHeader}>
                      <h3>Delivery Address</h3>
                      <button className={styles.locationBtn} onClick={requestLocation} disabled={calculatingFee}>
                        <LocationIcon />
                        {calculatingFee ? "Getting location..." : "Use my location"}
                      </button>
                    </div>

                    {locationError && (
                      <div className={styles.locationError}>
                        <WarningIcon />
                        <span>{locationError}</span>
                      </div>
                    )}

                    {distance && !locationError && (
                      <div className={styles.distanceInfo}>
                        <CheckIcon />
                        <span>Distance: {distance}km | Delivery Fee: Ksh {deliveryFee}</span>
                      </div>
                    )}

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>
                          <PersonIcon /> Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={shippingAddress.fullName}
                          onChange={handleAddressChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>
                          <PhoneIcon /> Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingAddress.phone}
                          onChange={handleAddressChange}
                          placeholder="e.g., 0712345678"
                          required
                        />
                      </div>

                      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label>
                          <HomeIcon /> Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={shippingAddress.address}
                          onChange={handleAddressChange}
                          placeholder="Street address, building, apt"
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>City *</label>
                        <input
                          type="text"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleAddressChange}
                          placeholder="City / Town"
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={shippingAddress.postalCode}
                          onChange={handleAddressChange}
                          placeholder="Postal code (optional)"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {deliveryMethod === "pickup" && deliverySettings && (
                  <div className={styles.pickupInfo}>
                    <h3>Pickup Location</h3>
                    <div className={styles.pickupDetails}>
                      <p><strong>Address:</strong> {deliverySettings.pickupAddress}</p>
                      <p><strong>Instructions:</strong> {deliverySettings.pickupInstructions}</p>
                    </div>
                  </div>
                )}

                <button
                  className={styles.continueBtn}
                  onClick={handleNextStep}
                  disabled={deliveryMethod === "delivery" && locationError}
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className={styles.paymentSection}>
                <button className={styles.backBtn} onClick={() => setStep(1)}>
                  ← Back to Delivery
                </button>

                <h2>Payment Method</h2>
                <div className={styles.paymentOptions}>
                  <button
                    className={`${styles.paymentOption} ${paymentMethod === "mpesa" ? styles.selected : ""}`}
                    onClick={() => setPaymentMethod("mpesa")}
                  >
                    <MpesaIcon className={styles.optionIcon} />
                    <div className={styles.optionInfo}>
                      <h4>M-Pesa</h4>
                      <p>Pay with M-Pesa mobile money</p>
                    </div>
                    {paymentMethod === "mpesa" && <CheckIcon className={styles.checkIcon} />}
                  </button>

                  <button
                    className={`${styles.paymentOption} ${paymentMethod === "card" ? styles.selected : ""}`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <CardIcon className={styles.optionIcon} />
                    <div className={styles.optionInfo}>
                      <h4>Card Payment</h4>
                      <p>Visa, Mastercard, etc.</p>
                    </div>
                    {paymentMethod === "card" && <CheckIcon className={styles.checkIcon} />}
                  </button>
                </div>

                <div className={styles.orderReview}>
                  <h3>Order Review</h3>
                  <div className={styles.reviewItem}>
                    <span>Delivery Method:</span>
                    <span>{deliveryMethod === "delivery" ? "Home Delivery" : "Pickup"}</span>
                  </div>
                  {deliveryMethod === "delivery" && (
                    <div className={styles.reviewItem}>
                      <span>Deliver to:</span>
                      <span>{shippingAddress.address}, {shippingAddress.city}</span>
                    </div>
                  )}
                  <div className={styles.reviewItem}>
                    <span>Payment:</span>
                    <span>{paymentMethod === "mpesa" ? "M-Pesa" : "Card Payment"}</span>
                  </div>
                </div>

                <button
                  className={styles.payBtn}
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                >
                  {submitting ? <Loading /> : `Pay Ksh ${total.toLocaleString()}`}
                </button>
              </div>
            )}
          </div>

          <div className={styles.orderSummary}>
            <h3>Order Summary</h3>
            <div className={styles.summaryItems}>
              {cartItems.map((item) => (
                <div key={item._id} className={styles.summaryItem}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.product?.images?.[0] || "/assets/images/product-placeholder.jpg"}
                      alt={item.product?.name || "Product"}
                      width={60}
                      height={60}
                    />
                    <span className={styles.itemQty}>{item.quantity}</span>
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.product?.name || "Product"}</p>
                    {item.size && <span className={styles.itemVariant}>Size: {item.size}</span>}
                  </div>
                  <span className={styles.itemPrice}>Ksh {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>Ksh {subtotal.toLocaleString()}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Delivery</span>
                <span>
                  {deliveryMethod === "pickup"
                    ? "Free (Pickup)"
                    : calculatingFee
                    ? "Calculating..."
                    : `Ksh ${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              {deliverySettings?.freeDeliveryThreshold && subtotal < deliverySettings.freeDeliveryThreshold && deliveryMethod === "delivery" && (
                <div className={styles.freeDeliveryNote}>
                  Add Ksh {(deliverySettings.freeDeliveryThreshold - subtotal).toLocaleString()} more for free delivery!
                </div>
              )}
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>Ksh {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
