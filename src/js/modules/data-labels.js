// src/js/modules/data-labels.js
// Capa de datos para la tabla "labels" en Supabase.

import { fetchTable } from './supabase-client.js';

/**
 * Tabla "labels":
 * - id
 * - name
 * - logo_url
 * - website_url (opcional)
 * - order_index
 */
export async function loadLabels() {
  const { data } = await fetchTable({
    table: 'labels',
    select: 'id, name, logo_url, website_url, order_index',
    order: { column: 'order_index', ascending: true },
  });

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    logo: row.logo_url,
    url: row.website_url || '',
  }));
}
