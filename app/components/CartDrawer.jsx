'use client'

import { toast } from 'sonner'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Loading from '@/app/components/Loader'
import Nothing from '@/app/components/Nothing'
import { useEcommerceStore } from '@/app/store/ecommerceStore'
import CartCard from '@/app/components/CartCard' 
import { useCartStore } from '@/app/store/Cart'
import EmptyCart from '@/public/assets/emptycart.png'
import styles from '@/app/style/cartdrawer.module.css'

import {
  IoCartOutline as CartIcon,
  IoClose as CloseIcon,
} from "react-icons/io5";

export default function CartComponent() {
  const router = useRouter()
  const {
    isAuth,
    cart,
    cartLoading,
    getCart,
    updateCartItem,
    removeFromCart,
  } = useEcommerceStore()

  const {
    isDrawerOpen,
    isLoading,
    toggleDrawer,
    closeDrawer,
    setLoading,
    getSubtotal,
    getDeliveryFee,
    getTotal
  } = useCartStore()

  useEffect(() => {
    if (isAuth) {
      getCart()
    }
  }, [isAuth, getCart])

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    setLoading(true)
    try {
      const result = await updateCartItem(itemId, newQuantity)
      if (result.success) {
        toast.success("Quantity updated")
      } else {
        toast.error(result.message || "Failed to update quantity")
      }
    } catch (error) {
      toast.error("Failed to update quantity")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (itemId) => {
    setLoading(true)
    try {
      const result = await removeFromCart(itemId)
      if (result.success) {
        toast.success("Item removed from cart")
      } else {
        toast.error(result.message || "Failed to remove item")
      }
    } catch (error) {
      toast.error("Failed to remove item")
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = () => {
    if (!isAuth) {
      router.push('/authentication/login')
      toast.error('Please login to proceed')
    } else {
      router.push('/payment')
      closeDrawer()
    }
  }

  const cartItems = cart?.items || []
  const subtotal = cart?.totalAmount || 0

  if (cartLoading && cartItems.length === 0) {
    return (
      <div className={`${styles.cartComponent} ${isDrawerOpen ? styles.slideIn : styles.slideOut}`}>
        <div className={styles.cartHeader}>
          <CloseIcon 
            className={styles.iconExit}
            onClick={toggleDrawer}
          />
          <h1>My Cart</h1>
          <CartIcon className={styles.iconCart} />
        </div>
        <div className={styles.cartContent}>
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.cartComponent} ${isDrawerOpen ? styles.slideIn : styles.slideOut}`}>
      <div className={styles.cartHeader}>
        <CloseIcon 
          className={styles.iconExit}
          onClick={toggleDrawer}
        />
        <h1>My Cart ({cartItems.length})</h1>
        <CartIcon className={styles.iconCart} />
      </div>
      
      <div className={styles.cartContent}>
        {cartItems.length === 0 ? (
          <Nothing NothingImage={EmptyCart} Text="Your cart is empty" Alt="Empty cart" />
        ) : (
          <div className={styles.cartItemsList}>
            {cartItems.map((item) => (
              <CartCard
                key={item._id}
                data={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>
        )}
      </div>
      
      {cartItems.length > 0 && (
        <div className={styles.checkoutContainer}>
          <div className={styles.checkoutSummary}>
            <div className={styles.checkinfo}>
              <h4>Items ({cartItems.length}):</h4>
              <span>Ksh {subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.checkinfo}>
              <h4>Delivery:</h4>
              <span>Calculated at checkout</span>
            </div>
            <div className={`${styles.checkinfo} ${styles.total}`}>
              <h3>Subtotal:</h3>
              <h3>Ksh {subtotal.toFixed(2)}</h3>
            </div>
          </div>
          
          <div className={styles.checkoutActions}>
            <button 
              className={styles.checkoutBtn} 
              onClick={handleCheckout}
              disabled={isLoading || cartLoading}
            >
              {(isLoading || cartLoading) ? <Loading /> : 'Checkout'}
            </button>
            <button 
              className={styles.continueShoppingBtn}
              onClick={closeDrawer}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}