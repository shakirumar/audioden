import { createClient } from '@supabase/supabase-js';

// Read from import.meta.env or localStorage admin override
const getSupabaseConfig = () => {
  let url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
  let key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '';

  // Check admin local override if stored
  try {
    const saved = localStorage.getItem('audio_den_supabase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.key) {
        url = parsed.url;
        key = parsed.key;
      }
    }
  } catch (err) {
    console.warn('Error reading Supabase config override', err);
  }

  const isValid =
    Boolean(url) &&
    Boolean(key) &&
    !url.includes('your-project-id') &&
    !key.includes('your-anon-key') &&
    url.startsWith('http');

  return { url, key, isValid };
};

const config = getSupabaseConfig();

export const isSupabaseConfigured = () => config.isValid;

export const supabase = config.isValid ? createClient(config.url, config.key) : null;

/**
 * Initializes real-time listener for database changes if Supabase is active
 * @param {Function} onDbChange Callback invoked with table and payload
 */
export const initSupabaseRealtime = (onDbChange) => {
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel('audio_den_realtime_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => onDbChange('products', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => onDbChange('categories', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'brands' },
        (payload) => onDbChange('brands', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => onDbChange('orders', payload)
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('🟢 Supabase Realtime channel connected successfully');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.error('Failed to initialize Supabase Realtime', err);
    return () => {};
  }
};

/**
 * Saves or updates custom Supabase credentials in browser
 */
export const saveSupabaseCredentials = (url, key) => {
  try {
    localStorage.setItem('audio_den_supabase_config', JSON.stringify({ url, key }));
    window.location.reload();
  } catch (err) {
    console.error('Failed to save Supabase credentials', err);
  }
};

export const clearSupabaseCredentials = () => {
  try {
    localStorage.removeItem('audio_den_supabase_config');
    window.location.reload();
  } catch (err) {
    console.error('Failed to clear Supabase credentials', err);
  }
};

export default supabase;
