// artist-grid.js
// Renders the list of artists on the Artists page and wires up
// click handlers to open the artist modal with the selected artist's
// details. Los datos ahora vienen desde Supabase vía loadArtists().

import { loadArtists } from './data-artists.js';

export async function initArtistGrid() {
  const grid = document.getElementById('artistsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  let artists = [];
  try {
    artists = await loadArtists();
  } catch (err) {
    console.error('[TTM] Error cargando artistas desde Supabase', err);
  }

  if (!artists.length) {
    grid.innerHTML =
      '<p class="prose">En breve vamos a publicar el roster completo.</p>';
    return;
  }

  const cards = artists.map((artist, index) => {
    const card = createCard(artist);
    // Estado inicial para animación (CSS controla opacidad/transform).
    card.classList.add('is-reveal-init');
    // Índice para poder escalonar delay vía CSS (var(--reveal-index)).
    card.style.setProperty('--reveal-index', index.toString());
    return card;
  });

  cards.forEach((card) => {
    grid.appendChild(card);
  });

  // Animación basada en scroll: las cards se "activan" cuando entran en viewport.
  setupCardReveal(grid, cards);

  // Guardar lista para que otros módulos (si quieren) la usen
  window.TTM = window.TTM || {};
  window.TTM.artists = artists;

  // Populate the artist select dropdown in the contact modal
  const artistSelect = document.getElementById('cf_artist');
  if (artistSelect) {
    artistSelect.innerHTML =
      '<option value="" disabled selected>Elegí un artista</option>';
    artists.forEach((artist) => {
      const opt = document.createElement('option');
      opt.value = artist.name;
      opt.textContent = artist.name;
      artistSelect.appendChild(opt);
    });
  }
}

function setupCardReveal(grid, cards) {
  if (!('IntersectionObserver' in window)) {
    // Fallback: sin observer, marcamos todo como visible de entrada.
    cards.forEach((card) => {
      card.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        observer.unobserve(el);
      });
    },
    {
      threshold: 0.25,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  cards.forEach((card) => {
    observer.observe(card);
  });
}

function createCard(artist) {
  const card = document.createElement('article');
  card.className = 'c-card-artist';
  card.dataset.artistId = artist.id;
  card.innerHTML = `
    <div class="card-media">
      <img src="${artist.photo}" alt="${artist.name}" loading="lazy">
    </div>
    <div class="card-body">
      <h3 class="artist-name">${artist.name}</h3>
      <p class="artist-role"></p>
    </div>
  `;
  card.addEventListener('click', () => {
    // Usa el modal global definido en modal-artist.js
    if (window.TTM && typeof window.TTM.openArtistModal === 'function') {
      window.TTM.openArtistModal(artist);
    }
  });
  return card;
}
