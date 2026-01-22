import { create } from "zustand";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useBlogStore = create((set, get) => ({
  blogs: [],
  loading: false,
  error: null,
  pagination: null,

  fetchBlogs: async (page = 1, limit = 6) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${SERVER_API}/blogs?published=true&page=${page}&limit=${limit}`);
      const data = await response.json();

      if (response.ok && data.status === "success") {
        set({
          blogs: data.data?.blogs || [],
          pagination: data.data?.pagination || null,
          loading: false,
        });
        return { success: true, data: data.data };
      }
      throw new Error(data.message || "Failed to fetch blogs");
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  getBlogBySlug: async (slug) => {
    try {
      const response = await fetch(`${SERVER_API}/blogs/slug/${slug}`);
      const data = await response.json();

      if (response.ok && data.status === "success") {
        return { success: true, data: data.data };
      }
      throw new Error(data.message || "Blog not found");
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
}));
