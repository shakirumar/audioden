// Robust Real-Time Database & Backend Service for AUDIO DEN
// Supports localStorage, BroadcastChannel multi-tab sync, Supabase cloud sync, and remote backend API fallback

import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_BANNERS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_REVIEWS,
  INITIAL_OFFERS,
  CATALOG_VERSION
} from '../data/initialData';
import { supabase, isSupabaseConfigured } from './supabase';

const DB_KEY = 'audio_den_catalog_v8';
const VERSION_KEY = 'audio_den_catalog_version_v8';

// Multi-tab BroadcastChannel for zero-latency instant updates across all open windows
let realtimeChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    realtimeChannel = new BroadcastChannel('audio_den_realtime_channel');
  } catch (err) {
    console.warn('BroadcastChannel not supported or error initializing', err);
  }
}

class AudioDenDatabase {
  constructor() {
    this.initDatabase();
    this.setupBroadcastListener();
    this.syncFromSupabaseIfAvailable();
  }

  initDatabase() {
    try {
      // Clear legacy storage cache keys
      ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7'].forEach((v) => {
        localStorage.removeItem(`audio_den_catalog_${v}`);
        localStorage.removeItem(`audio_den_catalog_version_${v}`);
      });
      localStorage.removeItem('audio_den_catalog_version');

      const storedVersion = localStorage.getItem(VERSION_KEY);
      const storedData = localStorage.getItem(DB_KEY);

      if (!storedData || storedVersion !== CATALOG_VERSION) {
        this.save({
          products: INITIAL_PRODUCTS,
          categories: INITIAL_CATEGORIES,
          brands: INITIAL_BRANDS,
          banners: INITIAL_BANNERS,
          orders: INITIAL_ORDERS,
          customers: INITIAL_CUSTOMERS,
          reviews: INITIAL_REVIEWS,
          offers: INITIAL_OFFERS
        });
        localStorage.setItem(VERSION_KEY, CATALOG_VERSION);
      } else {
        try {
          const parsed = JSON.parse(storedData);
          if (parsed.orders && parsed.orders.some((o) => o.id === 'ORD-98214' || o.id === 'ORD-98215')) {
            parsed.orders = parsed.orders.filter((o) => o.id !== 'ORD-98214' && o.id !== 'ORD-98215');
            if (parsed.orders.length === 0) {
              parsed.orders = INITIAL_ORDERS;
            }
            this.save(parsed);
          }
        } catch (err) {
          console.error('Failed to clean old demo orders', err);
        }
      }
    } catch (e) {
      console.error('Database initialization error:', e);
    }
  }

  setupBroadcastListener() {
    if (typeof window === 'undefined' || !realtimeChannel) return;
    realtimeChannel.onmessage = (event) => {
      if (event.data?.type === 'DB_UPDATED' && event.data?.payload) {
        window.dispatchEvent(new CustomEvent('audio_den_db_updated', { detail: event.data.payload }));
      }
    };
  }

  async syncFromSupabaseIfAvailable() {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      const { data: remoteProducts, error } = await supabase.from('products').select('*');
      if (!error && remoteProducts && remoteProducts.length > 0) {
        const current = this.get();
        // Merge or replace products with remote
        current.products = remoteProducts;
        this.save(current);
        console.log(`Synced ${remoteProducts.length} products from Supabase Realtime DB`);
      }
    } catch (err) {
      console.warn('Could not sync from Supabase on startup', err);
    }
  }

  get() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Database read error:', e);
    }
    return {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      brands: INITIAL_BRANDS,
      banners: INITIAL_BANNERS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS,
      reviews: INITIAL_REVIEWS,
      offers: INITIAL_OFFERS
    };
  }

  save(data) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      // Dispatch in current window
      window.dispatchEvent(new CustomEvent('audio_den_db_updated', { detail: data }));
      // Broadcast to other tabs & windows
      if (realtimeChannel) {
        realtimeChannel.postMessage({ type: 'DB_UPDATED', payload: data });
      }
    } catch (e) {
      console.error('Database write error:', e);
    }
  }

  // ================= PRODUCTS =================
  getProducts(filter = {}) {
    let list = this.get().products || [];
    if (filter.category) {
      list = list.filter((p) => p.category?.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.brand) {
      list = list.filter((p) => p.brand?.toLowerCase() === filter.brand.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getProductById(id) {
    return this.get().products.find((p) => p.id === id) || null;
  }

  addProduct(product) {
    const data = this.get();
    const newProd = {
      ...product,
      id: product.id || 'prod-' + Date.now(),
      rating: product.rating || 5.0,
      reviewCount: product.reviewCount || 1,
      inStock: true,
      createdAt: new Date().toISOString()
    };

    // Auto-ensure category exists in categories store so it appears in frontend filters & menus
    if (newProd.category) {
      const catExists = data.categories.some(
        (c) => c.name.toLowerCase() === newProd.category.toLowerCase()
      );
      if (!catExists) {
        data.categories.push({
          id: 'cat-' + Date.now(),
          name: newProd.category,
          slug: newProd.category.toLowerCase().replace(/\s+/g, '-'),
          image: newProd.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
          count: 1
        });
      }
    }

    // Auto-ensure brand exists in brands store
    if (newProd.brand) {
      const brandExists = data.brands.some(
        (b) => b.name.toLowerCase() === newProd.brand.toLowerCase()
      );
      if (!brandExists) {
        data.brands.push({
          id: 'brand-' + Date.now(),
          name: newProd.brand,
          logo: ''
        });
      }
    }

    data.products = [newProd, ...data.products];
    this.save(data);

    // Optional background sync to Supabase
    if (isSupabaseConfigured() && supabase) {
      supabase.from('products').insert([newProd]).then(({ error }) => {
        if (error) console.warn('Supabase insert failed (check table schema):', error.message);
      });
    }

    return newProd;
  }

  updateProduct(id, updates) {
    const data = this.get();
    data.products = data.products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    this.save(data);

    if (isSupabaseConfigured() && supabase) {
      supabase.from('products').update(updates).eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase update failed:', error.message);
      });
    }

    return data.products.find((p) => p.id === id);
  }

  deleteProduct(id) {
    const data = this.get();
    data.products = data.products.filter((p) => p.id !== id);
    this.save(data);

    if (isSupabaseConfigured() && supabase) {
      supabase.from('products').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase delete failed:', error.message);
      });
    }

    return true;
  }

  // ================= ORDERS =================
  deleteOrder(orderId) {
    const data = this.get();
    data.orders = (data.orders || []).filter((o) => o.id !== orderId);
    this.save(data);
    return true;
  }

  updateOrderStatus(orderId, newStatus) {
    const data = this.get();
    data.orders = (data.orders || []).map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    this.save(data);
    return true;
  }

  createOrder(orderData) {
    const data = this.get();
    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...orderData
    };
    data.orders = [newOrder, ...(data.orders || [])];
    this.save(data);
    return newOrder;
  }

  // Reset database back to fresh default models
  resetDatabase() {
    const fresh = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      brands: INITIAL_BRANDS,
      banners: INITIAL_BANNERS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS,
      reviews: INITIAL_REVIEWS,
      offers: INITIAL_OFFERS
    };
    this.save(fresh);
    localStorage.setItem(VERSION_KEY, CATALOG_VERSION);
    return fresh;
  }
}

export const db = new AudioDenDatabase();
export default db;
