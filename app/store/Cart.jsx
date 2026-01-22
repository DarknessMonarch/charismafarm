// Cart Store - Remove localStorage persistence
import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  isDrawerOpen: false,
  isLoading: false,

  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  setLoading: (loading) => set({ isLoading: loading }),

  getItemCount: () => {
    const { useEcommerceStore } = require('./ecommerceStore');
    const cart = useEcommerceStore.getState().cart;
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal: () => {
    const { useEcommerceStore } = require('./ecommerceStore');
    const cart = useEcommerceStore.getState().cart;
    return cart?.totalAmount || 0;
  },

  getTotal: (deliveryFee = 0) => {
    const subtotal = get().getSubtotal();
    return subtotal + (subtotal > 0 ? deliveryFee : 0);
  },

  getDeliveryFee: (deliveryFee = 0) => {
    const subtotal = get().getSubtotal();
    return subtotal > 0 ? deliveryFee : 0;
  },
}));