import { create } from 'zustand';
import db, { DB_KEY } from '../services/db';
import { initSupabaseRealtime, isSupabaseConfigured, supabase } from '../services/supabase';

// Safely execute Supabase query thenables without throwing if .catch is missing
const safeSupabase = (promiseLike) => {
  if (!promiseLike) return;
  Promise.resolve(promiseLike)
    .then((result) => {
      if (result && result.error) {
        console.warn('Supabase DB operation warning:', result.error.message || result.error);
      }
    })
    .catch((err) => {
      console.warn('Supabase DB network/runtime warning:', err);
    });
};

export const useProductStore = create((set, _get) => {
  // Listen for storage events across browser tabs
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key === DB_KEY && event.newValue) {
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
    initSupabaseRealtime(async (table, payload) => {
      console.log(`⚡ Supabase Realtime event on ${table}:`, payload);
      try {
        if (typeof db.syncTableFromSupabase === 'function' && table) {
          const fresh = await db.syncTableFromSupabase(table);
          if (fresh) set(fresh);
        } else if (typeof db.syncFromSupabaseIfAvailable === 'function') {
          await db.syncFromSupabaseIfAvailable();
          set(db.get());
        }
      } catch (err) {
        console.warn('Error applying realtime update:', err);
      }
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
    addProduct: async (product) => {
      const newProduct = await db.addProduct(product);
      set(db.get());
      return newProduct;
    },

    updateProduct: async (id, updatedFields) => {
      await db.updateProduct(id, updatedFields);
      set(db.get());
    },

    deleteProduct: async (id) => {
      await db.deleteProduct(id);
      set(db.get());
    },

    deleteProducts: async (ids) => {
      await db.deleteProducts(ids);
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
      data.categories = [...(data.categories || []), newCat];
      db.save(data);
      set({ categories: data.categories });
      
      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('categories').insert([newCat]));
      }
      return newCat;
    },

    updateCategory: (id, updatedFields) => {
      const data = db.get();
      data.categories = (data.categories || []).map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      db.save(data);
      set({ categories: data.categories });
      
      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('categories').update(updatedFields).eq('id', id));
      }
    },

    deleteCategory: (id) => {
      const data = db.get();
      data.categories = (data.categories || []).filter((c) => c.id !== id);
      db.save(data);
      set({ categories: data.categories });
      
      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('categories').delete().eq('id', id));
      }
    },

    // ================= BRANDS CRUD =================
    addBrand: (brand) => {
      const data = db.get();
      const newBrand = {
        ...brand,
        id: 'brand-' + Date.now()
      };
      data.brands = [...(data.brands || []), newBrand];
      db.save(data);
      set({ brands: data.brands });
      
      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('brands').insert([newBrand]));
      }
      return newBrand;
    },

    updateBrand: (id, updatedFields) => {
      const data = db.get();
      data.brands = (data.brands || []).map((b) => (b.id === id ? { ...b, ...updatedFields } : b));
      db.save(data);
      set({ brands: data.brands });
      
      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('brands').update(updatedFields).eq('id', id));
      }
    },

    deleteBrand: (id) => {
      const data = db.get();
      data.brands = (data.brands || []).filter((b) => b.id !== id);
      db.save(data);
      set({ brands: data.brands });
      
      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('brands').delete().eq('id', id));
      }
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

      let customerToSave = null;
      if (existingCustIndex >= 0) {
        const cust = data.customers[existingCustIndex];
        customerToSave = {
          ...cust,
          name: orderData.customerName || cust.name,
          phone: orderData.customerPhone || cust.phone,
          city: orderData.shippingAddress ? (orderData.shippingAddress.includes('Prayagraj') ? 'Prayagraj' : cust.city) : cust.city,
          totalOrders: (cust.totalOrders || 0) + 1,
          totalSpent: (cust.totalSpent || 0) + (orderData.totalAmount || 0),
          lastOrderDate: newOrder.date
        };
        data.customers[existingCustIndex] = customerToSave;
      } else {
        customerToSave = {
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
        data.customers = [customerToSave, ...(data.customers || [])];
      }

      db.save(data);
      set({ orders: data.orders, customers: data.customers });

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('orders').insert([newOrder]));
        if (customerToSave) {
          safeSupabase(supabase.from('customers').upsert([customerToSave]));
        }
      }
      return newOrder;
    },

    updateOrderStatus: (orderId, newStatus) => {
      const data = db.get();
      data.orders = (data.orders || []).map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      db.save(data);
      set({ orders: data.orders });

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('orders').update({ status: newStatus }).eq('id', orderId));
      }
    },

    deleteOrder: (orderId) => {
      const data = db.get();
      data.orders = (data.orders || []).filter((o) => o.id !== orderId);
      db.save(data);
      set({ orders: data.orders });

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('orders').delete().eq('id', orderId));
      }
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

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('customers').insert([newCust]));
      }
      return newCust;
    },

    updateCustomer: (id, updatedFields) => {
      const data = db.get();
      data.customers = (data.customers || []).map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      db.save(data);
      set({ customers: data.customers });

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('customers').update(updatedFields).eq('id', id));
      }
    },

    deleteCustomer: (id) => {
      const data = db.get();
      data.customers = (data.customers || []).filter((c) => c.id !== id);
      db.save(data);
      set({ customers: data.customers });

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('customers').delete().eq('id', id));
      }
    },

    // ================= BANNERS MANAGEMENT =================
    addBanner: (banner) => {
      const data = db.get();
      const newBanner = {
        ...banner,
        id: 'banner-' + Date.now(),
        enabled: true
      };
      data.banners = [...(data.banners || []), newBanner];
      db.save(data);
      set({ banners: data.banners });

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('banners').insert([newBanner]));
      }
      return newBanner;
    },

    toggleBanner: (id) => {
      const data = db.get();
      let updatedBanner = null;
      data.banners = (data.banners || []).map((b) => {
        if (b.id === id) {
          updatedBanner = { ...b, enabled: !b.enabled };
          return updatedBanner;
        }
        return b;
      });
      db.save(data);
      set({ banners: data.banners });

      if (isSupabaseConfigured() && supabase && updatedBanner) {
        safeSupabase(supabase.from('banners').update({ enabled: updatedBanner.enabled }).eq('id', id));
      }
    },

    deleteBanner: (id) => {
      const data = db.get();
      data.banners = (data.banners || []).filter((b) => b.id !== id);
      db.save(data);
      set({ banners: data.banners });

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('banners').delete().eq('id', id));
      }
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
      data.reviews = [newReview, ...(data.reviews || [])];
      db.save(data);
      set({ reviews: data.reviews });

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('reviews').insert([newReview]));
      }
      return newReview;
    },

    approveReview: (id) => {
      const data = db.get();
      data.reviews = (data.reviews || []).map((r) => (r.id === id ? { ...r, approved: true } : r));
      db.save(data);
      set({ reviews: data.reviews });

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('reviews').update({ approved: true }).eq('id', id));
      }
    },

    deleteReview: (id) => {
      const data = db.get();
      data.reviews = (data.reviews || []).filter((r) => r.id !== id);
      db.save(data);
      set({ reviews: data.reviews });

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('reviews').delete().eq('id', id));
      }
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

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('offers').insert([newOffer]));
      }
      return newOffer;
    },

    updateOffer: (id, updatedFields) => {
      const data = db.get();
      data.offers = (data.offers || []).map((o) => (o.id === id ? { ...o, ...updatedFields } : o));
      db.save(data);
      set({ offers: data.offers });

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('offers').update(updatedFields).eq('id', id));
      }
    },

    toggleOffer: (id) => {
      const data = db.get();
      let updatedOffer = null;
      data.offers = (data.offers || []).map((o) => {
        if (o.id === id) {
          updatedOffer = { ...o, enabled: !o.enabled };
          return updatedOffer;
        }
        return o;
      });
      db.save(data);
      set({ offers: data.offers });

      if (isSupabaseConfigured() && supabase && updatedOffer) {
        safeSupabase(supabase.from('offers').update({ enabled: updatedOffer.enabled }).eq('id', id));
      }
    },

    deleteOffer: (id) => {
      const data = db.get();
      data.offers = (data.offers || []).filter((o) => o.id !== id);
      db.save(data);
      set({ offers: data.offers });

      if (isSupabaseConfigured() && supabase) {
        safeSupabase(supabase.from('offers').delete().eq('id', id));
      }
    }
  };
});
