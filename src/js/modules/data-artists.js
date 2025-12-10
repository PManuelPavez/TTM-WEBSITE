// src/js/modules/data-artists.js
// Capa de datos para la tabla "artists" en Supabase.

import { fetchTable } from './supabase-client.js';

/**
 * Tabla "artists" en Supabase (ya la creaste con el SQL):
 * - id
 * - name
 * - role (no obligatorio)
 * - bio
 * - photo_url
 * - ig_url
 * - sc_url
 * - yt_url
 * - presskit_url
 * - order_index
 *
 * Esta función devuelve objetos con la MISMA forma que usaba el array ARTISTS
 * del artist-grid original:
 * { id, name, photo, bio, links: { ig, sc, yt, presskit } }
 */
export async function loadArtists() {
  const { data } = await fetchTable({
    table: 'artists',
    select:
      'id, name, role, bio, photo_url, ig_url, sc_url, yt_url, presskit_url, order_index',
    order: { column: 'order_index', ascending: true },
  });

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    photo: row.photo_url || '',
    bio: row.bio || '',
    links: {
      ig: row.ig_url || '',
      sc: row.sc_url || '',
      yt: row.yt_url || '',
      presskit: row.presskit_url || '',
    },
  }));
}
