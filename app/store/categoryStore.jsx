import { create } from "zustand";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${SERVER_API}/categories?active=true`);
      const data = await response.json();

      if (response.ok && data.status === "success") {
        set({ categories: data.data || [], loading: false });
        return { success: true, data: data.data };
      }
      throw new Error(data.message || "Failed to fetch categories");
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  getCategoryBySlug: async (slug) => {
    try {
      const response = await fetch(`${SERVER_API}/categories/slug/${slug}`);
      const data = await response.json();

      if (response.ok && data.status === "success") {
        return { success: true, data: data.data };
      }
      throw new Error(data.message || "Category not found");
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
}));
