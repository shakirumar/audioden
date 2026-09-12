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
    if (!code || !code.trim()) {
      set({ couponError: 'Please enter a coupon code' });
      return { success: false, message: 'Please enter a coupon code' };
    }
    const formatted = code.trim().toUpperCase();

    // 1. Check custom offers in database created by admin
    try {
      const stored = localStorage.getItem('audio_den_catalog_v8');
      if (stored) {
        const parsed = JSON.parse(stored);
        const dynamicOffer = (parsed.offers || []).find(
          (o) => o.active !== false && o.couponCode && o.couponCode.trim().toUpperCase() === formatted
        );
        if (dynamicOffer) {
          const discountPercent = Number(dynamicOffer.discountPercent || (dynamicOffer.discountType === 'percentage' ? dynamicOffer.discountValue : 0));
          const discountAmount = Number(dynamicOffer.discountAmount || (dynamicOffer.discountType === 'fixed' ? dynamicOffer.discountValue : 0));
          const couponData = {
            code: formatted,
            discountPercent: discountPercent || (discountAmount ? 0 : 10),
            discountAmount: discountAmount || 0,
            title: dynamicOffer.title || `${formatted} Offer`
          };
          set({ coupon: couponData, couponError: null });
          return {
            success: true,
            message: `✓ Coupon ${formatted} applied successfully! (${dynamicOffer.title || (discountPercent ? `${discountPercent}% Off` : `₹${discountAmount} Off`)})`
          };
        }
      }
    } catch (err) {
      console.warn('Could not check dynamic offers', err);
    }

    // 2. Predefined showroom and online promo codes
    const standardCoupons = {
      'WELCOME10': { discountPercent: 10, title: 'Welcome First Order 10% Off' },
      'GOLD20': { discountPercent: 20, title: 'VIP Gold Member 20% Off' },
      'AUDIODEN5': { discountPercent: 5, title: 'Instant Store 5% Off' },
      'AUDIODEN10': { discountPercent: 10, title: 'Audio Den Showroom 10% Off' },
      'FESTIVE15': { discountPercent: 15, title: 'Festive Season 15% Off' },
      'NEWKATRA': { discountPercent: 10, title: 'New Katra Flagship Store 10% Off' },
      'OFFER500': { discountAmount: 500, title: 'Flat ₹500 Instant Discount' },
      'OFFER1000': { discountAmount: 1000, title: 'Flat ₹1,000 Instant Discount' },
      'OFFER2000': { discountAmount: 2000, title: 'Flat ₹2,000 Instant Discount' },
      'FLAT500': { discountAmount: 500, title: 'Flat ₹500 Off' },
      'FLAT1000': { discountAmount: 1000, title: 'Flat ₹1,000 Off' }
    };

    if (standardCoupons[formatted]) {
      const match = standardCoupons[formatted];
      const couponData = {
        code: formatted,
        discountPercent: match.discountPercent || 0,
        discountAmount: match.discountAmount || 0,
        title: match.title
      };
      set({ coupon: couponData, couponError: null });
      return {
        success: true,
        message: `✓ Coupon "${formatted}" applied! (${match.title})`
      };
    }

    set({ couponError: `Invalid or expired coupon "${formatted}". Try WELCOME10, AUDIODEN5, or OFFER1000.` });
    return {
      success: false,
      message: `Invalid or expired coupon "${formatted}". Try WELCOME10, AUDIODEN5, or OFFER1000.`
    };
  },

  removeCoupon: () => {
    set({ coupon: null, couponError: null });
  },

  getTotals: () => {
    const { items, coupon } = get();
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    let discount = 0;
    if (coupon) {
      if (coupon.discountPercent && coupon.discountPercent > 0) {
        discount = Math.round((subtotal * coupon.discountPercent) / 100);
      } else if (coupon.discountAmount && coupon.discountAmount > 0) {
        discount = Math.min(coupon.discountAmount, subtotal);
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
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
