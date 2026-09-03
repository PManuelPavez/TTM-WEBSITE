// src/js/modules/supabase-client.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function getSupabaseConfig() {
  const urlMeta = document.querySelector('meta[name="supabase-url"]');
  const keyMeta = document.querySelector('meta[name="supabase-anon-key"]');

  if (!urlMeta || !keyMeta) {
    console.warn('[TTM] Faltan las meta tags de Supabase en el <head>.');
    return null;
  }

  const url = urlMeta.content.trim();
  const key = keyMeta.content.trim();

  if (!url || !key) {
    console.warn('[TTM] Las meta tags de Supabase están vacías.');
    return null;
  }

  return { url, key };
}

const config = getSupabaseConfig();

export const supabase = config
  ? createClient(config.url, config.key, {
      auth: { persistSession: false },
    })
  : null;

export async function fetchTable({ table, select = '*', order } = {}) {
  if (!supabase) {
    console.warn('[TTM] Supabase no está configurado.');
    return { data: [], error: null };
  }

  let query = supabase.from(table).select(select);

  if (order && order.column) {
    query = query.order(order.column, {
      ascending: order.ascending ?? true,
    });
  }

  const { data, error } = await query;
  if (error) {
    console.error(`[TTM] Error leyendo tabla ${table}`, error);
    return { data: [], error };
  }

  return { data: data || [], error: null };
}
