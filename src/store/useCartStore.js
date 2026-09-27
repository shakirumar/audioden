import { create } from 'zustand';

const CART_STORAGE_KEY = 'audio_den_cart';
const COUPON_STORAGE_KEY = 'audio_den_cart_coupon';

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const getInitialCoupon = () => {
  try {
    const saved = localStorage.getItem(COUPON_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const useCartStore = create((set, get) => ({
  items: getInitialCart(),
  coupon: getInitialCoupon(), // Persisted { code: 'DIWALI20', discountPercent: 20 }
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
    localStorage.removeItem(COUPON_STORAGE_KEY);
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
          (o) => (o.active !== false && o.enabled !== false) && o.couponCode && o.couponCode.trim().toUpperCase() === formatted
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
          localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(couponData));
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
      'DIWALI20': { discountPercent: 20, title: 'Diwali Dhamaka Fest 20% Off' },
      'MONSOON15': { discountPercent: 15, title: 'Monsoon Mega Sale 15% Off' },
      'APPLEDAYS': { discountPercent: 8, title: 'Apple Days Special 8% Off' },
      'OP10FEST': { discountPercent: 10, title: 'OnePlus Festive Offer 10% Off' },
      'TVDEAL30': { discountPercent: 30, title: 'Smart TV Bonanza 30% Off' },
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
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(couponData));
      set({ coupon: couponData, couponError: null });
      return {
        success: true,
        message: `✓ Coupon "${formatted}" applied! (${match.title})`
      };
    }

    set({ couponError: `Invalid or expired coupon "${formatted}". Please enter a valid promo code.` });
    return {
      success: false,
      message: `Invalid or expired coupon "${formatted}". Please enter a valid promo code.`
    };
  },

  removeCoupon: () => {
    localStorage.removeItem(COUPON_STORAGE_KEY);
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

    const payableSubtotal = Math.max(0, subtotal - discount);
    const shipping = subtotal > 1000 || items.length === 0 ? 0 : 150;
    const grandTotal = payableSubtotal + shipping;
    // 18% inclusive GST component
    const tax = Math.round((payableSubtotal * 18) / 118);

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
