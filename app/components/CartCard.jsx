"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import styles from "@/app/style/cartCard.module.css";

import { IoAdd as AddIcon, IoRemove as RemoveIcon } from "react-icons/io5";
import { MdDeleteOutline as DeleteIcon } from "react-icons/md";

export default function CartCard({ data }) {
  const { updateCartItem, removeFromCart } = useEcommerceStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleIncreaseQuantity = async (e) => {
    e.stopPropagation();
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const result = await updateCartItem(data._id, data.quantity + 1);
      if (!result.success) {
        toast.error(result.message || 'Failed to update quantity');
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecreaseQuantity = async (e) => {
    e.stopPropagation();
    if (isUpdating || data.quantity <= 1) return;

    setIsUpdating(true);
    try {
      const result = await updateCartItem(data._id, data.quantity - 1);
      if (!result.success) {
        toast.error(result.message || 'Failed to update quantity');
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveFromCart = async (e) => {
    e.stopPropagation();
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const result = await removeFromCart(data._id);
      if (result.success) {
        toast.success('Item removed from cart');
      } else {
        toast.error(result.message || 'Failed to remove item');
      }
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.cartItemContainer}>
      <div className={styles.cartItemImageWrapper}>
        {data.product?.images?.[0] && (
          <Image
            src={data.product.images[0]}
            alt={data.product.name}
            width={120}
            height={120}
            className={styles.cartItemImage}
          />
        )}
      </div>

      <div className={styles.cartItemDetails}>
        <h1 className={styles.cartItemName}>{data.product?.name}</h1>
        {data.size && <p className={styles.cartItemVariant}>Size: {data.size}</p>}
        {data.color && <p className={styles.cartItemVariant}>Color: {data.color}</p>}
        <div className={styles.cartItemPricing}>
          <h3>Ksh {data.price}</h3>
        </div>
        <div className={styles.cartItemActions}>
          <div className={styles.quantityControls}>
            <button
              className={styles.quantityButton}
              onClick={handleDecreaseQuantity}
              disabled={data.quantity <= 1 || isUpdating}
              aria-label={`Decrease ${data.product?.name} quantity`}
            >
              <RemoveIcon className={styles.quantityIcon} />
            </button>

            <span className={styles.quantityDisplay}>{data.quantity}</span>

            <button
              className={styles.quantityButton}
              onClick={handleIncreaseQuantity}
              disabled={isUpdating}
              aria-label={`Increase ${data.product?.name} quantity`}
            >
              <AddIcon className={styles.quantityIcon} />
            </button>
          </div>
          <button
            className={styles.removeButton}
            onClick={handleRemoveFromCart}
            disabled={isUpdating}
            aria-label={`Remove ${data.product?.name} from cart`}
          >
            <DeleteIcon className={styles.removeIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}