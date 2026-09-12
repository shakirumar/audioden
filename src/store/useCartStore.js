import { create } from 'zustand';

const CART_STORAGE_KEY = 'audio_den_cart';

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const useCartStore = create((set, get) => ({
  items: getInitialCart(),
  coupon: null, // { code: 'WELCOME10', discountPercent: 10 }
  couponError: null,

  addItem: (product, quantity = 1, selectedVariant = null) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.id === product.id && item.selectedVariant === selectedVariant
      );

      let newItems;
      if (existingIndex > -1) {
        newItems = state.items.map((item, index) => {
          if (index === existingIndex) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      } else {
        newItems = [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            originalPrice: product.price,
            image: product.images?.[0] || '',
            category: product.category,
            brand: product.brand,
            sku: product.sku,
            quantity,
            selectedVariant
          }
        ];
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }

    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  clearCart: () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    set({ items: [], coupon: null, couponError: null });
  },

  applyCoupon: (code) => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'WELCOME10') {
      set({ coupon: { code: 'WELCOME10', discountPercent: 10 }, couponError: null });
      return { success: true, message: '10% discount applied successfully!' };
    } else if (formatted === 'GOLD20') {
      set({ coupon: { code: 'GOLD20', discountPercent: 20 }, couponError: null });
      return { success: true, message: '20% VIP Gold discount applied!' };
    } else if (formatted === 'AUDIODEN5') {
      set({ coupon: { code: 'AUDIODEN5', discountPercent: 5 }, couponError: null });
      return { success: true, message: '5% Instant Store discount applied!' };
    } else if (formatted === 'AUDIODEN10') {
      set({ coupon: { code: 'AUDIODEN10', discountPercent: 10 }, couponError: null });
      return { success: true, message: '10% Audio Den Special discount applied!' };
    } else {
      set({ couponError: 'Invalid coupon code' });
      return { success: false, message: 'Invalid coupon code' };
    }
  },

  removeCoupon: () => {
    set({ coupon: null, couponError: null });
  },

  getTotals: () => {
    const { items, coupon } = get();
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0;
    const taxableAmount = subtotal - discount;
    const tax = Math.round(taxableAmount * 0.18); // 18% GST standard on mobile/electronics
    const shipping = subtotal > 1000 || items.length === 0 ? 0 : 150;
    const grandTotal = taxableAmount + tax + shipping;

    return {
      subtotal,
      discount,
      tax,
      shipping,
      grandTotal,
      itemCount: items.reduce((acc, item) => acc + item.quantity, 0)
    };
  }
}));
