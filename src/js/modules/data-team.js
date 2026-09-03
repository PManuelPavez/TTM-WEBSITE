// src/js/modules/data-team.js
// Lee la tabla "team" para poblar la página de equipo.

import { fetchTable } from './supabase-client.js';

/**
 * Tabla "team":
 * - id (int / uuid)
 * - name (text)
 * - role (text)   -> rol corto
 * - title (text)  -> título completo
 * - bio (text)
 * - tel (text)
 * - order_index (int)
 */
export async function loadTeam() {
  const { data } = await fetchTable({
    table: 'team',
    select: 'id, name, role, title, bio, tel, order_index',
    order: { column: 'order_index', ascending: true },
  });

  return (data || []).map((row) => ({
    name: row.name,
    role: row.role,
    title: row.title,
    bio: row.bio,
    links: { tel: row.tel },
  }));
}
