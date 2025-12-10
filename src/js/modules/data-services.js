// src/js/modules/data-services.js
// Lee la tabla "services" y la mapea a los objetos que usa services.js.

import { fetchTable } from './supabase-client.js';

/**
 * Tabla "services":
 * - id (int / uuid)
 * - title (text)
 * - text (text)
 * - order_index (int)
 */
export async function loadServices() {
  const { data } = await fetchTable({
    table: 'services',
    select: 'id, title, text, order_index',
    order: { column: 'order_index', ascending: true },
  });

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    text: row.text,
  }));
}
