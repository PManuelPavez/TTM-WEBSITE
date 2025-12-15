// src/js/modules/labels-slider.js
// Slider de sellos discográficos en la página Artists.
// Usa la sección ya definida en artists.html y carga datos desde Supabase.

import { loadLabels } from './data-labels.js';

export async function initLabelsSlider() {
  const body = document.body;
  // Solo corre en la página de Artists
  if (!body || !body.classList.contains('artists-page')) return;

  const section = document.querySelector('[data-ttm-labels-section]');
  if (!section) return;

  const viewport = section.querySelector('[data-ttm-labels-viewport]');
  const track = section.querySelector('[data-ttm-labels-track]');
  const prevBtn = section.querySelector('[data-ttm-labels-prev]');
  const nextBtn = section.querySelector('[data-ttm-labels-next]');

  if (!viewport || !track || !prevBtn || !nextBtn) {
    console.warn('[TTM] labels-slider: faltan elementos del DOM.');
    return;
  }

  let items = [];

  async function loadAndRenderLabels() {
    let labels = [];

    try {
      labels = await loadLabels();
    } catch (error) {
      console.error('[TTM] Error cargando labels desde Supabase', error);
    }

    track.innerHTML = '';

    // Si no hay data, mostramos un placeholder en vez de esconder la sección
    if (!labels || !labels.length) {
      const li = document.createElement('li');
      li.className =
        'labels-slider__item labels-slider__item--placeholder';
      li.textContent =
        'Próximamente, los sellos con los que trabajamos.';
      track.appendChild(li);
      items = [li];
      return;
    }

    labels.forEach((label) => {
      const li = document.createElement('li');
      li.className = 'labels-slider__item';

      let container;

      if (label.url) {
        const a = document.createElement('a');
        a.href = label.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'labels-slider__link';
        container = a;
      } else {
        const div = document.createElement('div');
        div.className = 'labels-slider__logo-wrapper';
        container = div;
      }

      const img = document.createElement('img');
      img.src = label.logo;
      img.alt = label.name;
      img.loading = 'lazy';
      img.decoding = 'async';

      container.appendChild(img);
      li.appendChild(container);
      track.appendChild(li);
    });

    items = Array.from(track.querySelectorAll('.labels-slider__item'));
  }

  function getStep() {
    if (!items.length) return viewport.clientWidth * 0.6;

    const first = items[0].getBoundingClientRect();
    const second = items[1]?.getBoundingClientRect();

    if (second) {
      // distancia entre centros de los dos primeros items
      return second.left - first.left;
    }

    return first.width + 24; // fallback con un gap aproximado
  }

  function scrollByStep(direction) {
    const step = getStep();
    viewport.scrollBy({
      left: direction * step,
      behavior: 'smooth',
    });
  }

  // Controles con flechas
  prevBtn.addEventListener('click', () => scrollByStep(-1));
  nextBtn.addEventListener('click', () => scrollByStep(1));

  // Accesible con teclado desde el viewport
  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollByStep(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollByStep(-1);
    }
  });

  // Carga perezosa cuando la sección entra en viewport
  function setupObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback para navegadores viejos
      loadAndRenderLabels();
      return;
    }

    const io = new IntersectionObserver(
      async (entries, observer) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          observer.disconnect();
          await loadAndRenderLabels();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(section);
  }

  setupObserver();
}
