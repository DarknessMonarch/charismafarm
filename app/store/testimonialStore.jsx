import { create } from "zustand";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useTestimonialStore = create((set, get) => ({
  testimonials: [],
  loading: false,
  error: null,

  fetchTestimonials: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${SERVER_API}/testimonials?active=true`);
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
}));
