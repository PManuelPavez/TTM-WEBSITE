// src/js/modules/data-labels.js
// Capa de datos para la tabla "labels" en Supabase.
// Si la tabla está vacía o falla, usa una lista local basada en assets/LABELS.

import { fetchTable } from './supabase-client.js';

const FALLBACK_LABELS = [
  { id: '3rdavenue',      name: '3rd Avenue',       logo: '../../assets/LABELS/3RDAVENUE.svg',     url: '' },
  { id: 'ahdigital',      name: 'AH Digital',       logo: '../../assets/LABELS/AHDIGITAL.svg',     url: '' },
  { id: 'circleoflife',   name: 'Circle of Life',   logo: '../../assets/LABELS/CIRCLEOFLIFE.png',  url: '' },
  { id: 'd9sa',           name: 'D9SA',             logo: '../../assets/LABELS/D9SA.svg',          url: '' },
  { id: 'laforesta',      name: 'La Foresta',       logo: '../../assets/LABELS/LAFORESTA.svg',     url: '' },
  { id: 'madden',         name: 'Madden',           logo: '../../assets/LABELS/MADDEN.png',        url: '' },
  { id: 'musiquedelune',  name: 'Musique de Lune',  logo: '../../assets/LABELS/MUSIQUEDELUNE.svg', url: '' },
  { id: 'soundavenue',    name: 'Sound Avenue',     logo: '../../assets/LABELS/SOUNDAVENUE.png',   url: '' },
  { id: 'themangoalley',  name: 'The Mango Alley',  logo: '../../assets/LABELS/THEMANGOALLEY.png', url: '' },
  { id: 'traful',         name: 'Traful',           logo: '../../assets/LABELS/TRAFUL.png',        url: '' },
  { id: 'venturerecords', name: 'Venture Records',  logo: '../../assets/LABELS/VENTURERECORDS.png',url: '' },
];

export async function loadLabels() {
  try {
    const { data } = await fetchTable({
      table: 'labels',
      select: 'id, name, logo_url, website_url, order_index',
      order: { column: 'order_index', ascending: true },
    });

    const labels = (data || [])
      .map((row) => ({
        id: row.id,
        name: row.name,
        logo: row.logo_url,
        url: row.website_url || '',
      }))
      .filter((label) => !!label.logo);

    if (labels.length) {
      return labels;
    }

    console.warn('[TTM] Tabla "labels" vacía, usando FALLBACK_LABELS.');
  } catch (err) {
    console.error('[TTM] Error cargando labels desde Supabase, usando fallback', err);
  }

  return FALLBACK_LABELS;
}
