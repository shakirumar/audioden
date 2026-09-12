import { create } from 'zustand';
import db from '../services/db';
import { initSupabaseRealtime, isSupabaseConfigured } from '../services/supabase';

export const useProductStore = create((set, _get) => {
  // Listen for storage events across browser tabs
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if ((event.key === 'audio_den_catalog_v8' || event.key === 'audio_den_catalog_v7') && event.newValue) {
        try {
          const fresh = JSON.parse(event.newValue);
          set(fresh);
        } catch (err) {
          console.error('Failed to sync storage event', err);
        }
      }
    });

    window.addEventListener('audio_den_db_updated', (event) => {
      if (event.detail) {
        set(event.detail);
      }
    });

    // Supabase cloud realtime subscription
    initSupabaseRealtime((table, payload) => {
      console.log(`⚡ Supabase Realtime event on ${table}:`, payload);
      // Reload catalog state from DB
      set(db.get());
    });
  }

  return {
    ...db.get(),
    isSupabaseConfigured: isSupabaseConfigured(),

    // Real-time catalog reload from database
    reloadCatalog: () => {
      const fresh = db.get();
      set(fresh);
    },

    // Reset database to latest models (Apple, Samsung, OnePlus, Vivo, Oppo)
    resetToDefault: () => {
      const fresh = db.resetDatabase();
      set(fresh);
    },

    // ================= PRODUCTS CRUD =================
    addProduct: (product) => {
      const newProduct = db.addProduct(product);
      set(db.get());
      return newProduct;
    },

    updateProduct: (id, updatedFields) => {
      db.updateProduct(id, updatedFields);
      set(db.get());
    },

    deleteProduct: (id) => {
      db.deleteProduct(id);
      set(db.get());
    },

    reorderProducts: (newProductsList) => {
      const data = db.get();
      data.products = newProductsList;
      db.save(data);
      set({ products: newProductsList });
    },

    // ================= CATEGORIES CRUD =================
    addCategory: (category) => {
      const data = db.get();
      const newCat = {
        ...category,
        id: 'cat-' + Date.now(),
        count: 0
      };
      data.categories = [...data.categories, newCat];
      db.save(data);
      set({ categories: data.categories });
    },

    updateCategory: (id, updatedFields) => {
      const data = db.get();
      data.categories = data.categories.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      db.save(data);
      set({ categories: data.categories });
    },

    deleteCategory: (id) => {
      const data = db.get();
      data.categories = data.categories.filter((c) => c.id !== id);
      db.save(data);
      set({ categories: data.categories });
    },

    // ================= BRANDS CRUD =================
    addBrand: (brand) => {
      const data = db.get();
      const newBrand = {
        ...brand,
        id: 'brand-' + Date.now()
      };
      data.brands = [...data.brands, newBrand];
      db.save(data);
      set({ brands: data.brands });
    },

    updateBrand: (id, updatedFields) => {
      const data = db.get();
      data.brands = data.brands.map((b) => (b.id === id ? { ...b, ...updatedFields } : b));
      db.save(data);
      set({ brands: data.brands });
    },

    deleteBrand: (id) => {
      const data = db.get();
      data.brands = data.brands.filter((b) => b.id !== id);
      db.save(data);
      set({ brands: data.brands });
    },

    // ================= ORDERS MANAGEMENT =================
    createOrder: (orderData) => {
      const data = db.get();
      const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
      const newOrder = {
        id: orderId,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        ...orderData
      };
      data.orders = [newOrder, ...(data.orders || [])];

      // Automatically synchronize customer profile in database
      const existingCustIndex = (data.customers || []).findIndex(
        (c) =>
          (orderData.customerEmail && c.email?.toLowerCase() === orderData.customerEmail?.toLowerCase()) ||
          (orderData.customerPhone && c.phone === orderData.customerPhone)
      );

      if (existingCustIndex >= 0) {
        const cust = data.customers[existingCustIndex];
        data.customers[existingCustIndex] = {
          ...cust,
          name: orderData.customerName || cust.name,
          phone: orderData.customerPhone || cust.phone,
          city: orderData.shippingAddress ? (orderData.shippingAddress.includes('Prayagraj') ? 'Prayagraj' : cust.city) : cust.city,
          totalOrders: (cust.totalOrders || 0) + 1,
          totalSpent: (cust.totalSpent || 0) + (orderData.totalAmount || 0),
          lastOrderDate: newOrder.date
        };
      } else {
        const newCustomer = {
          id: 'cust-' + Date.now(),
          name: orderData.customerName || 'Valued Customer',
          email: orderData.customerEmail || 'customer@audioden.com',
          phone: orderData.customerPhone || '9935102727',
          city: 'Prayagraj',
          totalOrders: 1,
          totalSpent: orderData.totalAmount || 0,
          joinedDate: newOrder.date,
          lastOrderDate: newOrder.date
        };
        data.customers = [newCustomer, ...(data.customers || [])];
      }

      db.save(data);
      set({ orders: data.orders, customers: data.customers });
      return newOrder;
    },

    updateOrderStatus: (orderId, newStatus) => {
      const data = db.get();
      data.orders = data.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      db.save(data);
      set({ orders: data.orders });
    },

    deleteOrder: (orderId) => {
      const data = db.get();
      data.orders = data.orders.filter((o) => o.id !== orderId);
      db.save(data);
      set({ orders: data.orders });
    },

    // ================= CUSTOMERS MANAGEMENT =================
    addCustomer: (customer) => {
      const data = db.get();
      const newCust = {
        ...customer,
        id: 'cust-' + Date.now(),
        totalOrders: 0,
        totalSpent: 0,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      data.customers = [newCust, ...(data.customers || [])];
      db.save(data);
      set({ customers: data.customers });
      return newCust;
    },

    updateCustomer: (id, updatedFields) => {
      const data = db.get();
      data.customers = (data.customers || []).map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      db.save(data);
      set({ customers: data.customers });
    },

    deleteCustomer: (id) => {
      const data = db.get();
      data.customers = (data.customers || []).filter((c) => c.id !== id);
      db.save(data);
      set({ customers: data.customers });
    },

    // ================= BANNERS MANAGEMENT =================
    addBanner: (banner) => {
      const data = db.get();
      const newBanner = {
        ...banner,
        id: 'banner-' + Date.now(),
        enabled: true
      };
      data.banners = [...data.banners, newBanner];
      db.save(data);
      set({ banners: data.banners });
    },

    toggleBanner: (id) => {
      const data = db.get();
      data.banners = data.banners.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b));
      db.save(data);
      set({ banners: data.banners });
    },

    deleteBanner: (id) => {
      const data = db.get();
      data.banners = data.banners.filter((b) => b.id !== id);
      db.save(data);
      set({ banners: data.banners });
    },

    // ================= REVIEWS MANAGEMENT =================
    addReview: (review) => {
      const data = db.get();
      const newReview = {
        ...review,
        id: 'rev-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        approved: true
      };
      data.reviews = [newReview, ...data.reviews];
      db.save(data);
      set({ reviews: data.reviews });
    },

    approveReview: (id) => {
      const data = db.get();
      data.reviews = data.reviews.map((r) => (r.id === id ? { ...r, approved: true } : r));
      db.save(data);
      set({ reviews: data.reviews });
    },

    deleteReview: (id) => {
      const data = db.get();
      data.reviews = data.reviews.filter((r) => r.id !== id);
      db.save(data);
      set({ reviews: data.reviews });
    },

    // ================= OFFERS MANAGEMENT =================
    addOffer: (offer) => {
      const data = db.get();
      const newOffer = {
        ...offer,
        id: 'offer-' + Date.now(),
        enabled: true
      };
      data.offers = [...(data.offers || []), newOffer];
      db.save(data);
      set({ offers: data.offers });
    },

    updateOffer: (id, updatedFields) => {
      const data = db.get();
      data.offers = (data.offers || []).map((o) => (o.id === id ? { ...o, ...updatedFields } : o));
      db.save(data);
      set({ offers: data.offers });
    },

    toggleOffer: (id) => {
      const data = db.get();
      data.offers = (data.offers || []).map((o) => (o.id === id ? { ...o, enabled: !o.enabled } : o));
      db.save(data);
      set({ offers: data.offers });
    },

    deleteOffer: (id) => {
      const data = db.get();
      data.offers = (data.offers || []).filter((o) => o.id !== id);
      db.save(data);
      set({ offers: data.offers });
    }
  };
});
