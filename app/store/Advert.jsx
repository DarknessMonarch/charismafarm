import { create } from "zustand";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useAdvertStore = create((set, get) => ({
  adverts: [],
  advertsByPlacement: {},
  loading: false,
  error: null,

  fetchAdverts: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${SERVER_API}/adverts?active=true`);

      if (!response.ok) {
        throw new Error("Failed to fetch adverts");
      }

      const data = await response.json();
      if (data.status === "success") {
        const adverts = data.data.adverts || [];
        const byPlacement = {};
        adverts.forEach((advert) => {
          byPlacement[advert.placement] = advert;
        });
        set({ adverts, advertsByPlacement: byPlacement, loading: false });
        return { success: true, data: adverts };
      }
      set({ loading: false });
      return { success: false, message: data.message };
    } catch (error) {
      set({ error: error.message, loading: false, adverts: [] });
      return {
        success: false,
        message: error.message || "Failed to fetch adverts",
      };
    }
  },

  getAdvertByPlacement: async (placement) => {
    try {
      const cached = get().advertsByPlacement[placement];
      if (cached) {
        return { success: true, data: cached };
      }

      set({ loading: true, error: null });
      const response = await fetch(`${SERVER_API}/adverts/placement/${placement}`);

      if (!response.ok) {
        if (response.status === 404) {
          set({ loading: false });
          return { success: false, message: "Advert not found" };
        }
        throw new Error("Failed to fetch advert");
      }

      const data = await response.json();
      if (data.status === "success") {
        const advert = data.data.advert;
        set((state) => ({
          advertsByPlacement: { ...state.advertsByPlacement, [placement]: advert },
          loading: false,
        }));
        return { success: true, data: advert };
      }
      set({ loading: false });
      return { success: false, message: data.message };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  getAdvertById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${SERVER_API}/adverts/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch advert");
      }

      const data = await response.json();
      if (data.status === "success") {
        set({ loading: false });
        return { success: true, data: data.data.advert };
      }
      set({ loading: false });
      return { success: false, message: data.message };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  getPlacementItems: (placement) => {
    const advert = get().advertsByPlacement[placement];
    return advert?.items || [];
  },

  clearCache: () => {
    set({ adverts: [], advertsByPlacement: {}, error: null });
  },
}));
