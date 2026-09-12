import { create } from 'zustand';

const WISHLIST_STORAGE_KEY = 'audio_den_wishlist';

const getInitialWishlist = () => {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const useWishlistStore = create((set, get) => ({
  items: getInitialWishlist(),

  toggleWishlist: (product) => {
    set((state) => {
      const exists = state.items.some((item) => item.id === product.id);
      let newItems;
      if (exists) {
        newItems = state.items.filter((item) => item.id !== product.id);
      } else {
        newItems = [...state.items, product];
      }
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item.id === productId);
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== productId);
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  clearWishlist: () => {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
    set({ items: [] });
  }
}));
