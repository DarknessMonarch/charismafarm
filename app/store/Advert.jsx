import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useAdvertStore = create(
  persist(
    (set, get) => ({
      adverts: [],
      loading: false,
      error: null,

      fetchAdverts: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/advert`);

          if (!response.ok) {
            throw new Error('Failed to fetch adverts');
          }

          const data = await response.json();
          set({ adverts: Array.isArray(data) ? data : [], loading: false });
          return { success: true, data };
        } catch (error) {
          set({ error: error.message, loading: false, adverts: [] });
          return {
            success: false,
            message: error.message || "Failed to fetch adverts",
          };
        }
      },

      getAdvertById: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/advert/${id}`);

          if (!response.ok) {
            throw new Error('Failed to fetch advert');
          }

          const data = await response.json();
          set({ loading: false });
          return { success: true, data };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, message: error.message };
        }
      },

      createAdvert: async (formData) => {
        try {
          set({ loading: true, error: null });
          const { accessToken } = useEcommerceStore.getState();

          const response = await fetch(`${SERVER_API}/advert`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to create advert');
          }

          const data = await response.json();
          set((state) => ({
            adverts: [data, ...state.adverts],
            loading: false,
          }));
          return { success: true, data };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, message: error.message };
        }
      },

      updateAdvert: async (id, formData) => {
        try {
          set({ loading: true, error: null });
          const { accessToken } = useEcommerceStore.getState();

          const response = await fetch(`${SERVER_API}/advert/${id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to update advert');
          }

          const data = await response.json();
          set((state) => ({
            adverts: state.adverts.map((advert) =>
              advert._id === id ? data : advert
            ),
            loading: false,
          }));
          return { success: true, data };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, message: error.message };
        }
      },

      deleteAdvert: async (id) => {
        try {
          set({ loading: true, error: null });
          const { accessToken } = useEcommerceStore.getState();

          const response = await fetch(`${SERVER_API}/advert/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to delete advert');
          }

          set((state) => ({
            adverts: state.adverts.filter((advert) => advert._id !== id),
            loading: false,
          }));
          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, message: error.message };
        }
      },
    }),
    {
      name: "advert-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        adverts: state.adverts,
      }),
    }
  )
);

import { useEcommerceStore } from "./ecommerceStore";