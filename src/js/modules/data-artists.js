// src/js/modules/data-artists.js
// Capa de datos para la tabla "artists" en Supabase.
// Todo el texto y links vienen de Supabase.
// Las fotos se resuelven SOLO desde assets/artists/*.png

import { fetchTable } from './supabase-client.js';

/**
 * Tabla "artists" en Supabase:
 * - id
 * - name
 * - role
 * - bio
 * - ig_url
 * - sc_url
 * - yt_url
 * - presskit_url
 * - order_index
 *
 * Esta función devuelve objetos con la MISMA forma que usaba el array ARTISTS
 * original:
 * { id, name, photo, bio, links: { ig, sc, yt, presskit } }
 *
 * photo se resuelve desde assets/artists en base al nombre.
 */

const LOCAL_ARTIST_IMAGES = {
  // Coinciden directo con nombres simples
  servando: '../../assets/artists/servando.png',
  fideksen: '../../assets/artists/fideksen.png',
  gasparaguilera: '../../assets/artists/gasparaguilera.png',
  kentavros: '../../assets/artists/kentavros.png',
  mateotapia: '../../assets/artists/mateo_tapia.png',
  matezys: '../../assets/artists/matezys.png',
  p37ro: '../../assets/artists/p37ro.png',
  sirenes: '../../assets/artists/sirenes.png',

  // Artistas con nombre + apellido:
  // soportamos tanto la versión corta como la completa
  manu: '../../assets/artists/manu.png',
  manupavez: '../../assets/artists/manu.png',

  luciano: '../../assets/artists/luciano.png',
  lucianobedini: '../../assets/artists/luciano.png',

  sofideren: '../../assets/artists/sofideren.png',
  sofiaderen: '../../assets/artists/sofideren.png',
};


// "Gaspar Aguilera" -> "gasparaguilera"
function normalizeKey(value) {
  if (!value) return '';
  return String(value)
    .toLowerCase()
    .normalize('NFD') // separa acentos
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .replace(/[^a-z0-9]/g, ''); // saca espacios, guiones, etc.
}

function resolveLocalPhoto(row) {
  const candidates = [];

  // por ahora solo tenemos name en la tabla, pero dejamos preparado por si sumás slug
  if (row.slug) candidates.push(row.slug);
  if (row.name) candidates.push(row.name);

  for (const value of candidates) {
    const key = normalizeKey(value);
    if (key && LOCAL_ARTIST_IMAGES[key]) {
      return LOCAL_ARTIST_IMAGES[key];
    }
  }

  // si no hay match, devolvemos string vacío
  return '';
}

export async function loadArtists() {
  const { data } = await fetchTable({
    table: 'artists',
    select:
      'id, name, role, bio, ig_url, sc_url, yt_url, presskit_url, order_index',
    order: { column: 'order_index', ascending: true },
  });

  const rows = Array.isArray(data) ? data : [];

  return rows.map((row, index) => {
    const photo = resolveLocalPhoto(row); // IGNORAMOS photo_url de Supabase

    return {
      id: row.id ?? index,
      name: row.name || '',
      // role lo dejamos por si después lo querés usar en la UI
      role: row.role || '',
      photo, // solo assets locales
      bio: row.bio || '',
      links: {
        ig: row.ig_url || '',
        sc: row.sc_url || '',
        yt: row.yt_url || '',
        presskit: row.presskit_url || '',
      },
      order_index:
        typeof row.order_index === 'number' ? row.order_index : index,
    };
  });
}
