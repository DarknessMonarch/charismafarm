import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000;

export const useEcommerceStore = create(
  persist(
    (set, get) => ({
      // Auth State
      isAuth: false,
      userId: "",
      username: "",
      email: "",
      phone: "",
      profileImage: "",
      isAdmin: false,
      accessToken: "",
      refreshToken: "",
      emailVerified: false,
      tokenExpirationTime: null,
      refreshTimeoutId: null,
      isInitialized: false,

      // Cart State
      cart: null,
      cartLoading: false,

      // Products State
      products: [],
      productsLoading: false,
      productsPagination: null,

      // Orders State
      orders: [],
      ordersLoading: false,
      ordersPagination: null,

      // Initialize Auth
      initializeAuth: async () => {
        const state = get();
        if (state.isInitialized) return;
        set({ isInitialized: true });

        if (!state.isAuth || !state.accessToken || !state.refreshToken) {
          return;
        }

        const now = Date.now();
        const tokenExpired = !state.tokenExpirationTime || state.tokenExpirationTime <= now;
        const tokenExpiringSoon = state.tokenExpirationTime && state.tokenExpirationTime - now < 300000;

        if (tokenExpired || tokenExpiringSoon) {
          const refreshSuccess = await get().refreshAccessToken();
          if (!refreshSuccess) {
            get().clearUser();
            return;
          }
        }

        get().scheduleTokenRefresh();
        
        // Load cart if authenticated
        if (state.emailVerified) {
          get().getCart();
        }
      },

      // Auth Actions
      setUser: (userData) => {
        const tokenExpirationTime = Date.now() + 60 * 60 * 1000;
        set({
          isAuth: true,
          userId: userData.id,
          username: userData.username,
          email: userData.email,
          phone: userData.phone || "",
          profileImage: userData.profileImage || "",
          isAdmin: userData.isAdmin || false,
          emailVerified: userData.emailVerified || false,
          accessToken: userData.tokens.accessToken,
          refreshToken: userData.tokens.refreshToken,
          tokenExpirationTime,
          isInitialized: true,
        });
        get().scheduleTokenRefresh();
      },

      updateUser: (userData) => {
        set((state) => ({ ...state, ...userData }));
      },

      clearUser: () => {
        get().cancelTokenRefresh();
        set({
          isAuth: false,
          userId: "",
          username: "",
          email: "",
          phone: "",
          profileImage: "",
          isAdmin: false,
          accessToken: "",
          refreshToken: "",
          emailVerified: false,
          tokenExpirationTime: null,
          isInitialized: false,
          cart: null,
          orders: [],
        });
      },

      register: async (userData) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });

          const data = await response.json();
          if (data.status === "success") {
            const userWithTokens = { ...data.data.user, tokens: data.data.tokens };
            get().setUser(userWithTokens);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Registration failed" };
        }
      },

      verifyEmail: async (email, verificationCode) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/verify-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, verificationCode }),
          });

          const data = await response.json();
          if (data.status === "success") {
            set({ emailVerified: true });
            // Load cart after email verification
            setTimeout(() => get().getCart(), 500);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Email verification failed" };
        }
      },

      resendVerificationCode: async (email) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/resend-verification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();
          return { 
            success: data.status === "success", 
            message: data.message 
          };
        } catch (error) {
          return { 
            success: false, 
            message: "Failed to resend verification code" 
          };
        }
      },

      login: async (email, password) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (data.data?.user?.emailVerified === false) {
            return {
              success: false,
              message: "Please verify your email to log in.",
              requiresVerification: true,
              email: data.data.user.email,
            };
          }

          if (data.status === "success" && data.data?.user && data.data?.tokens) {
            const userWithTokens = { ...data.data.user, tokens: data.data.tokens };
            get().setUser(userWithTokens);
            
            // Load cart after login
            setTimeout(() => get().getCart(), 500);
            
            return { success: true, message: data.message };
          }

          return { success: false, message: data.message || "Login failed" };
        } catch (error) {
          return { success: false, message: "Login failed" };
        }
      },

      logout: async () => {
        get().clearUser();
        return { success: true, message: "Logout successful" };
      },

      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            get().clearUser();
            return false;
          }

          const response = await fetch(`${SERVER_API}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          const data = await response.json();
          if (data.status === "success") {
            const newTokenExpirationTime = Date.now() + 60 * 60 * 1000;
            set({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              tokenExpirationTime: newTokenExpirationTime,
            });
            get().scheduleTokenRefresh();
            return true;
          } else {
            get().clearUser();
            return false;
          }
        } catch (error) {
          get().clearUser();
          return false;
        }
      },

      scheduleTokenRefresh: () => {
        const { tokenExpirationTime, refreshTimeoutId, isAuth, accessToken } = get();
        
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
          set({ refreshTimeoutId: null });
        }

        if (!isAuth || !accessToken) return;

        const now = Date.now();
        const timeUntilExpiration = tokenExpirationTime - now;

        if (timeUntilExpiration <= 300000) {
          get().refreshAccessToken();
          return;
        }

        const timeUntilRefresh = timeUntilExpiration - 300000;
        const newTimeoutId = setTimeout(() => {
          get().refreshAccessToken();
        }, timeUntilRefresh);

        set({ refreshTimeoutId: newTimeoutId });
      },

      cancelTokenRefresh: () => {
        const { refreshTimeoutId } = get();
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
          set({ refreshTimeoutId: null });
        }
      },

      requestPasswordReset: async (email) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/reset-password-request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Password reset request failed" };
        }
      },

      resetPassword: async (token, newPassword) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword }),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Password reset failed" };
        }
      },

      updateProfile: async (updateData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/profile`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updateData),
          });

          const data = await response.json();
          if (data.status === "success") {
            get().updateUser(data.data.user);
            return { success: true, message: "Profile updated successfully" };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Profile update failed" };
        }
      },

      deleteAccount: async () => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/account`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          if (data.status === "success") {
            get().clearUser();
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Account deletion failed" };
        }
      },

      submitContactForm: async (email, name, message) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name, message }),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to submit contact form" };
        }
      },

      // Admin Actions
      makeAdmin: async (userId) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/make-admin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ userId }),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to make user admin" };
        }
      },

      removeAdmin: async (userId) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/remove-admin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ userId }),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to remove admin privileges" };
        }
      },

      // Products Actions
      getAllProducts: async (filters = {}) => {
        try {
          set({ productsLoading: true });
          const queryParams = new URLSearchParams(filters).toString();
          const response = await fetch(`${SERVER_API}/products?${queryParams}`);

          const data = await response.json();
          if (data.status === "success") {
            set({
              products: data.data.products,
              productsPagination: data.data.pagination,
              productsLoading: false,
            });
            return { success: true, data: data.data };
          }
          set({ productsLoading: false });
          return { success: false, message: data.message };
        } catch (error) {
          set({ productsLoading: false });
          return { success: false, message: "Failed to fetch products" };
        }
      },

      getProduct: async (productId) => {
        try {
          const response = await fetch(`${SERVER_API}/products/${productId}`);
          const data = await response.json();
          if (data.status === "success") {
            return { success: true, data: data.data.product };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to fetch product" };
        }
      },

      createProduct: async (formData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/products`, {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: formData,
          });

          const data = await response.json();
          if (data.status === "success") {
            get().getAllProducts();
            return { success: true, message: "Product created successfully" };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to create product" };
        }
      },

      updateProduct: async (productId, formData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/products/${productId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: formData,
          });

          const data = await response.json();
          if (data.status === "success") {
            get().getAllProducts();
            return { success: true, message: "Product updated successfully" };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to update product" };
        }
      },

      deleteProduct: async (productId) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/products/${productId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          if (data.status === "success") {
            get().getAllProducts();
            return { success: true, message: "Product deleted successfully" };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to delete product" };
        }
      },

      updateProductStock: async (productId, stock) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/products/${productId}/stock`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ stock }),
          });

          const data = await response.json();
          if (data.status === "success") {
            return { success: true, message: "Stock updated successfully" };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to update stock" };
        }
      },

      // Cart Actions
      getCart: async () => {
        try {
          const { accessToken, emailVerified } = get();
          if (!accessToken || !emailVerified) return;

          set({ cartLoading: true });
          const response = await fetch(`${SERVER_API}/cart`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          if (data.status === "success") {
            set({ cart: data.data.cart, cartLoading: false });
            return { success: true, data: data.data.cart };
          }
          set({ cartLoading: false });
          return { success: false, message: data.message };
        } catch (error) {
          set({ cartLoading: false });
          return { success: false, message: "Failed to fetch cart" };
        }
      },

      addToCart: async (productId, quantity, size, color) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/cart/items`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ productId, quantity, size, color }),
          });

          const data = await response.json();
          if (data.status === "success") {
            set({ cart: data.data.cart });
            return { success: true, message: "Added to cart" };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to add to cart" };
        }
      },

      updateCartItem: async (itemId, quantity) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/cart/items/${itemId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ quantity }),
          });

          const data = await response.json();
          if (data.status === "success") {
            set({ cart: data.data.cart });
            return { success: true, message: "Cart updated" };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to update cart" };
        }
      },

      removeFromCart: async (itemId) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/cart/items/${itemId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          if (data.status === "success") {
            set({ cart: data.data.cart });
            return { success: true, message: "Item removed" };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to remove item" };
        }
      },

      clearCart: async () => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/cart`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          if (data.status === "success") {
            set({ cart: data.data.cart });
            return { success: true, message: "Cart cleared" };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to clear cart" };
        }
      },

      // Order Actions
      createOrder: async (orderData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(orderData),
          });

          const data = await response.json();
          if (data.status === "success") {
            return {
              success: true,
              data: data.data,
              message: "Order created successfully",
            };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to create order" };
        }
      },

      verifyPayment: async (reference) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/orders/verify/${reference}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          if (data.status === "success") {
            get().getOrders();
            get().getCart();
            return { success: true, data: data.data.order };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Payment verification failed" };
        }
      },

      getOrders: async (filters = {}) => {
        try {
          const { accessToken } = get();
          set({ ordersLoading: true });
          const queryParams = new URLSearchParams(filters).toString();
          const response = await fetch(`${SERVER_API}/orders?${queryParams}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          if (data.status === "success") {
            set({
              orders: data.data.orders,
              ordersPagination: data.data.pagination,
              ordersLoading: false,
            });
            return { success: true, data: data.data };
          }
          set({ ordersLoading: false });
          return { success: false, message: data.message };
        } catch (error) {
          set({ ordersLoading: false });
          return { success: false, message: "Failed to fetch orders" };
        }
      },

      getOrder: async (orderId) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          if (data.status === "success") {
            return { success: true, data: data.data.order };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to fetch order" };
        }
      },

      trackOrder: async (trackingNumber) => {
        try {
          const response = await fetch(`${SERVER_API}/orders/track/${trackingNumber}`);
          const data = await response.json();
          if (data.status === "success") {
            return { success: true, data: data.data };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to track order" };
        }
      },

      // Admin Order Actions
      getAllOrdersAdmin: async (filters = {}) => {
        try {
          const { accessToken } = get();
          const queryParams = new URLSearchParams(filters).toString();
          const response = await fetch(`${SERVER_API}/orders/admin/all?${queryParams}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          if (data.status === "success") {
            return { success: true, data: data.data };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to fetch orders" };
        }
      },

      updateOrderStatus: async (orderId, status, note) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/orders/admin/${orderId}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ status, note }),
          });

          const data = await response.json();
          if (data.status === "success") {
            return { success: true, message: "Order status updated" };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to update order status" };
        }
      },

      // Utility Functions
      getCartItemCount: () => {
        const { cart } = get();
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getCartTotal: () => {
        const { cart } = get();
        return cart?.totalAmount || 0;
      },
    }),
    {
      name: "ecommerce-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuth: state.isAuth,
        userId: state.userId,
        username: state.username,
        email: state.email,
        phone: state.phone,
        profileImage: state.profileImage,
        isAdmin: state.isAdmin,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        emailVerified: state.emailVerified,
        tokenExpirationTime: state.tokenExpirationTime,
      }),
    }
  )
);