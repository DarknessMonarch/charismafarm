import { create } from "zustand";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useTestimonialStore = create((set, get) => ({
  testimonials: [],
  myTestimonials: [],
  loading: false,
  error: null,

  // Fetch approved testimonials (public)
  fetchTestimonials: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${SERVER_API}/testimonials?approved=true`);
      const data = await response.json();

      if (response.ok && data.status === "success") {
        set({ testimonials: data.data || [], loading: false });
        return { success: true, data: data.data };
      }
      throw new Error(data.message || "Failed to fetch testimonials");
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  // Fetch user's own testimonials
  fetchMyTestimonials: async (accessToken) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${SERVER_API}/testimonials/user/my-testimonials`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      if (response.ok && data.status === "success") {
        set({ myTestimonials: data.data || [], loading: false });
        return { success: true, data: data.data };
      }
      throw new Error(data.message || "Failed to fetch your testimonials");
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  // Check if user can submit testimonial for an order
  canSubmitTestimonial: async (orderId, accessToken) => {
    try {
      const response = await fetch(`${SERVER_API}/testimonials/user/can-submit/${orderId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      if (response.ok && data.status === "success") {
        return { success: true, data: data.data };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Create testimonial (customer)
  createTestimonial: async (testimonialData, accessToken) => {
    try {
      set({ loading: true, error: null });

      const formData = new FormData();
      formData.append("orderId", testimonialData.orderId);
      formData.append("rating", testimonialData.rating || 5);
      formData.append("comment", testimonialData.comment);

      if (testimonialData.image) {
        formData.append("image", testimonialData.image);
      }

      const response = await fetch(`${SERVER_API}/testimonials`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Add to my testimonials
        set((state) => ({
          myTestimonials: [data.data, ...state.myTestimonials],
          loading: false,
        }));
        return { success: true, data: data.data, message: data.message };
      }
      throw new Error(data.message || "Failed to create testimonial");
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  // Delete own testimonial (customer)
  deleteTestimonial: async (testimonialId, accessToken) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${SERVER_API}/testimonials/user/${testimonialId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Remove from my testimonials and public testimonials
        set((state) => ({
          myTestimonials: state.myTestimonials.filter((t) => t._id !== testimonialId),
          testimonials: state.testimonials.filter((t) => t._id !== testimonialId),
          loading: false,
        }));
        return { success: true, message: data.message };
      }
      throw new Error(data.message || "Failed to delete testimonial");
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  clearError: () => set({ error: null }),
}));
