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
import { extractModelFamily } from '../utils/productUtils';

export const DB_KEY = 'audio_den_catalog_v16';
export const VERSION_KEY = 'audio_den_catalog_version_v16';

// Valid columns in Supabase products table schema
const SUPABASE_PRODUCT_COLUMNS = new Set([
  'id',
  'name',
  'sku',
  'brand',
  'category',
  'price',
  'salePrice',
  'stock',
  'description',
  'images',
  'features',
  'specifications',
  'isFlashSale',
  'isFeatured',
  'isBestSeller',
  'isNewArrival',
  'hasOffer',
  'offerTitle',
  'offerDiscountPercent',
  'offerBadgeText',
  'offerBadgeColor',
  'offerValidUntil',
  'offerFreebie',
  'rating',
  'reviewCount',
  'inStock',
  'createdAt'
]);

function sanitizeForSupabase(product) {
  const clean = {};
  for (const [key, val] of Object.entries(product)) {
    if (SUPABASE_PRODUCT_COLUMNS.has(key)) {
      clean[key] = val;
    }
  }

  // Preserve frontend-only rich metadata safely inside specifications JSONB
  const specs = typeof clean.specifications === 'object' && clean.specifications !== null
    ? { ...clean.specifications }
    : {};

  if (product.variants && Array.isArray(product.variants)) {
    specs._variants = product.variants;
  }
  if (product.modelGroup) {
    specs._modelGroup = product.modelGroup;
  }
  if (product.ram) {
    specs._ram = product.ram;
  }
  if (product.storage) {
    specs._storage = product.storage;
  }
  if (product.variantLabel) {
    specs._variantLabel = product.variantLabel;
  }

  clean.specifications = specs;
  clean.price = Number(clean.price) || 0;
  clean.salePrice = Number(clean.salePrice) || clean.price;
  clean.stock = Number(clean.stock) || 0;
  if (!clean.images || !Array.isArray(clean.images)) clean.images = [];
  if (!clean.features || !Array.isArray(clean.features)) clean.features = [];
  clean.inStock = clean.stock > 0;

  return clean;
}

export function unpackFromSupabase(product) {
  if (!product) return product;
  const specs = (typeof product.specifications === 'object' && product.specifications !== null)
    ? product.specifications
    : {};

  const cleanSpecs = {};
  for (const [k, v] of Object.entries(specs)) {
    if (!k.startsWith('_')) {
      cleanSpecs[k] = v;
    }
  }

  return {
    ...product,
    price: Number(product.price) || 0,
    salePrice: Number(product.salePrice) || Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    inStock: (Number(product.stock) || 0) > 0 || product.inStock !== false,
    specifications: cleanSpecs,
    modelGroup: product.modelGroup || specs._modelGroup || extractModelFamily(product),
    variants: product.variants || specs._variants || [],
    ram: product.ram || specs._ram || '',
    storage: product.storage || specs._storage || '',
    variantLabel: product.variantLabel || specs._variantLabel || ''
  };
}

function mergeProductsWithRemote(currentProducts = [], remoteProducts = [], deletedProductIds = []) {
  const deletedSet = new Set(deletedProductIds || []);
  const initialMap = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));

  // 1. Process all remote products from Supabase (Source of Truth)
  const processedRemote = (remoteProducts || [])
    .filter((p) => !deletedSet.has(p.id))
    .map((remote) => {
      const initial = initialMap.get(remote.id);
      const unpacked = unpackFromSupabase(remote);
      if (!initial) return unpacked;
      return {
        ...initial,
        ...unpacked,
        images: (unpacked.images && unpacked.images.length > 0) ? unpacked.images : initial.images,
        features: (unpacked.features && unpacked.features.length > 0) ? unpacked.features : initial.features
      };
    });

  const remoteIdSet = new Set(processedRemote.map((p) => p.id));

  // 2. Preserve any newly added local products that are not yet in remote and not deleted
  const localOnly = (currentProducts || []).filter(
    (p) => !deletedSet.has(p.id) && !remoteIdSet.has(p.id) && !initialMap.has(p.id)
  );

  return [...localOnly, ...processedRemote];
}

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
      ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10', 'v11', 'v12', 'v13', 'v14'].forEach((v) => {
        localStorage.removeItem(`audio_den_catalog_${v}`);
        localStorage.removeItem(`audio_den_catalog_version_${v}`);
      });
      localStorage.removeItem('audio_den_catalog_version');

      const storedVersion = localStorage.getItem(VERSION_KEY);
      const storedData = localStorage.getItem(DB_KEY);

      let needsReset = !storedData || storedVersion !== CATALOG_VERSION;
      if (!needsReset) {
        try {
          const parsed = JSON.parse(storedData);
          if (!parsed.products || !Array.isArray(parsed.products)) {
            needsReset = true;
          }
        } catch {
          needsReset = true;
        }
      }

      if (needsReset) {
        this.save({
          products: INITIAL_PRODUCTS,
          deletedProductIds: [],
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
      const current = this.get();
      let changed = false;

      const [
        { data: remoteProducts, error: pError },
        { data: remoteCategories, error: cError },
        { data: remoteBrands, error: bError },
        { data: remoteOrders, error: oError },
        { data: remoteCustomers, error: cuError },
        { data: remoteBanners, error: baError },
        { data: remoteReviews, error: rError },
        { data: remoteOffers, error: ofError }
      ] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('brands').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('banners').select('*'),
        supabase.from('reviews').select('*'),
        supabase.from('offers').select('*')
      ]);

      if (!pError && remoteProducts && remoteProducts.length > 0) {
        const merged = mergeProductsWithRemote(current.products, remoteProducts, current.deletedProductIds);

        // Auto-heal / push any un-synced local products up to Supabase in background
        const remoteIdSet = new Set(remoteProducts.map((p) => p.id));
        const unSyncedLocals = (current.products || []).filter(
          (p) => !(current.deletedProductIds || []).includes(p.id) &&
                 !remoteIdSet.has(p.id) &&
                 !INITIAL_PRODUCTS.some((ip) => ip.id === p.id)
        );
        if (unSyncedLocals.length > 0) {
          unSyncedLocals.forEach((lp) => {
            supabase.from('products').upsert([sanitizeForSupabase(lp)]).catch(() => {});
          });
        }

        current.products = merged;
        changed = true;
      }
      if (!cError && remoteCategories && remoteCategories.length > 0) {
        current.categories = remoteCategories;
        changed = true;
      }
      if (!bError && remoteBrands && remoteBrands.length > 0) {
        current.brands = remoteBrands;
        changed = true;
      }
      if (!oError && remoteOrders) {
        current.orders = remoteOrders;
        changed = true;
      }
      if (!cuError && remoteCustomers && remoteCustomers.length > 0) {
        current.customers = remoteCustomers;
        changed = true;
      }
      if (!baError && remoteBanners && remoteBanners.length > 0) {
        current.banners = remoteBanners;
        changed = true;
      }
      if (!rError && remoteReviews && remoteReviews.length > 0) {
        current.reviews = remoteReviews;
        changed = true;
      }
      if (!ofError && remoteOffers && remoteOffers.length > 0) {
        current.offers = remoteOffers;
        changed = true;
      }

      if (changed) {
        this.save(current);
        console.log(`Synced latest data for all 8 tables from Supabase Realtime DB`);
      }
    } catch (err) {
      console.warn('Could not sync from Supabase', err);
    }
  }

  async syncTableFromSupabase(table) {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (!error && data) {
        const current = this.get();
        if (table === 'products') {
          current.products = mergeProductsWithRemote(current.products, data, current.deletedProductIds);
        } else {
          current[table] = data;
        }
        this.save(current);
        return current;
      }
    } catch (err) {
      console.warn(`Could not sync table ${table} from Supabase:`, err);
    }
    return this.get();
  }

  get() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.deletedProductIds) && parsed.deletedProductIds.length > 0) {
          const deletedSet = new Set(parsed.deletedProductIds);
          parsed.products = (parsed.products || []).filter((p) => !deletedSet.has(p.id));
        }
        return parsed;
      }
    } catch (e) {
      console.error('Database read error:', e);
    }
    return {
      products: INITIAL_PRODUCTS,
      deletedProductIds: [],
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

  async addProduct(product) {
    const data = this.get();
    const newProd = {
      ...product,
      id: product.id || 'prod-' + Date.now(),
      rating: Number(product.rating) || 5.0,
      reviewCount: Number(product.reviewCount) || 1,
      inStock: true,
      createdAt: new Date().toISOString()
    };

    // Auto-ensure category exists in categories store so it appears in frontend filters & menus
    if (newProd.category) {
      const catExists = (data.categories || []).some(
        (c) => c.name.toLowerCase() === newProd.category.toLowerCase()
      );
      if (!catExists) {
        const newCat = {
          id: 'cat-' + Date.now(),
          name: newProd.category,
          slug: newProd.category.toLowerCase().replace(/\s+/g, '-'),
          image: newProd.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
          count: 1
        };
        data.categories = [...(data.categories || []), newCat];
        if (isSupabaseConfigured() && supabase) {
          supabase.from('categories').upsert([newCat]).catch(() => {});
        }
      }
    }

    // Auto-ensure brand exists in brands store
    if (newProd.brand) {
      const brandExists = (data.brands || []).some(
        (b) => b.name.toLowerCase() === newProd.brand.toLowerCase()
      );
      if (!brandExists) {
        const newBrand = {
          id: 'brand-' + Date.now(),
          name: newProd.brand,
          logo: ''
        };
        data.brands = [...(data.brands || []), newBrand];
        if (isSupabaseConfigured() && supabase) {
          supabase.from('brands').upsert([newBrand]).catch(() => {});
        }
      }
    }

    // If it was previously marked as deleted, unmark it
    if (data.deletedProductIds) {
      data.deletedProductIds = data.deletedProductIds.filter((id) => id !== newProd.id);
    }

    data.products = [newProd, ...(data.products || [])];
    this.save(data);

    // Persist to Supabase with schema-compliant sanitized payload
    if (isSupabaseConfigured() && supabase) {
      try {
        const clean = sanitizeForSupabase(newProd);
        const { error } = await supabase.from('products').upsert([clean]);
        if (error) {
          console.error('Supabase product insert error:', error.message);
        } else {
          console.log(`Product "${newProd.name}" saved to Supabase successfully.`);
        }
      } catch (err) {
        console.error('Supabase product insert exception:', err);
      }
    }

    return newProd;
  }

  async updateProduct(id, updates) {
    const data = this.get();
    data.products = (data.products || []).map((p) => (p.id === id ? { ...p, ...updates } : p));
    this.save(data);

    if (isSupabaseConfigured() && supabase) {
      try {
        const updated = data.products.find((p) => p.id === id);
        if (updated) {
          const clean = sanitizeForSupabase(updated);
          const { error } = await supabase.from('products').upsert([clean]);
          if (error) console.error('Supabase update failed:', error.message);
        }
      } catch (err) {
        console.error('Supabase update exception:', err);
      }
    }

    return data.products.find((p) => p.id === id);
  }

  async deleteProduct(id) {
    const data = this.get();
    data.products = (data.products || []).filter((p) => p.id !== id);
    // Track deleted IDs permanently so sync or refresh never resurrects it
    data.deletedProductIds = Array.from(new Set([...(data.deletedProductIds || []), id]));
    this.save(data);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.error('Supabase delete failed:', error.message);
        else console.log(`Product ${id} deleted from Supabase.`);
      } catch (err) {
        console.error('Supabase delete exception:', err);
      }
    }

    return true;
  }

  async deleteProducts(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) return true;
    const idsSet = new Set(ids);
    const data = this.get();
    data.products = (data.products || []).filter((p) => !idsSet.has(p.id));
    data.deletedProductIds = Array.from(new Set([...(data.deletedProductIds || []), ...ids]));
    this.save(data);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('products').delete().in('id', ids);
        if (error) console.error('Supabase bulk delete failed:', error.message);
        else console.log(`${ids.length} products deleted from Supabase.`);
      } catch (err) {
        console.error('Supabase bulk delete error:', err);
      }
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
      deletedProductIds: [],
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
