// src/js/modules/labels-slider.js
// Slider ligero para mostrar sellos discográficos en la página Artists.
// Carga los datos desde Supabase (tabla "labels") y genera el HTML del slider.

import { loadLabels } from './data-labels.js';

export async function initLabelsSlider() {
  const body = document.body;
  // Solo corre en la página de Artists (body.artists-page)
  if (!body || !body.classList.contains('artists-page')) return;

  const main = document.querySelector('main');
  if (!main) return;

  // Creamos la sección del slider si no existe todavía
  let section = document.querySelector('[data-ttm-labels-section]');
  if (!section) {
    section = document.createElement('section');
    section.className = 'section labels-section';
    section.setAttribute('data-ttm-labels-section', 'true');
    section.innerHTML = `
      <h2 class="section-title">Labels we work with</h2>
      <div class="c-labels-slider" data-ttm-labels-slider>
        <button
          type="button"
          class="labels-slider__arrow labels-slider__arrow--prev"
          data-ttm-labels-prev
          aria-label="Sello anterior"
        >
          ‹
        </button>

        <div
          class="labels-slider__viewport"
          data-ttm-labels-viewport
          tabindex="0"
        >
          <ul
            class="labels-slider__track"
            data-ttm-labels-track
          ></ul>
        </div>

        <button
          type="button"
          class="labels-slider__arrow labels-slider__arrow--next"
          data-ttm-labels-next
          aria-label="Sello siguiente"
        >
          ›
        </button>
      </div>
    `;

    // Insertamos la sección justo después de la sección de artistas
    const artistsSection = document.querySelector('.artists-section');
    if (artistsSection && artistsSection.parentNode === main) {
      main.insertBefore(section, artistsSection.nextSibling);
    } else {
      main.appendChild(section);
    }
  }

  const sliderRoot = section.querySelector('[data-ttm-labels-slider]');
  const viewport = sliderRoot.querySelector('[data-ttm-labels-viewport]');
  const track = sliderRoot.querySelector('[data-ttm-labels-track]');
  const prevBtn = sliderRoot.querySelector('[data-ttm-labels-prev]');
  const nextBtn = sliderRoot.querySelector('[data-ttm-labels-next]');

  if (!sliderRoot || !viewport || !track) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Accesibilidad básica
  viewport.setAttribute('role', 'region');
  if (!viewport.hasAttribute('aria-label')) {
    viewport.setAttribute('aria-label', 'Sellos discográficos');
  }
  track.setAttribute('role', 'list');

  let items = [];
  let currentIndex = 0;
  let autoTimer = null;
  let hasLoaded = false;

  async function loadAndRenderLabels() {
    if (hasLoaded) return;
    hasLoaded = true;

    let labels = [];
    try {
      labels = await loadLabels();
    } catch (err) {
      console.error('[TTM] Error cargando labels desde Supabase', err);
    }

    if (!labels.length) {
      // Si no hay data, escondemos la sección para que no quede vacía
      section.hidden = true;
      return;
    }

    const fragment = document.createDocumentFragment();

    labels.forEach((label) => {
      const li = document.createElement('li');
      li.className = 'labels-slider__item';
      li.setAttribute('role', 'listitem');

      let inner = '';
      if (label.url) {
        inner = `
          <a href="${label.url}" target="_blank" rel="noopener">
            <img src="${label.logo}" alt="${label.name}">
          </a>
        `;
      } else {
        inner = `
          <div class="labels-slider__logo-wrapper">
            <img src="${label.logo}" alt="${label.name}">
          </div>
        `;
      }
      li.innerHTML = inner;

      const img = li.querySelector('img');
      if (img && !img.hasAttribute('loading')) {
        img.loading = 'lazy';
        img.decoding = 'async';
      }

      fragment.appendChild(li);
    });

    track.innerHTML = '';
    track.appendChild(fragment);

    items = Array.from(track.querySelectorAll('.labels-slider__item'));
    if (!items.length) {
      section.hidden = true;
      return;
    }

    // Arrancamos centrados en el primer item
    goTo(0);
    wireControls();
  }

  function goTo(index) {
    if (!items.length) return;
    const total = items.length;
    currentIndex = (index + total) % total;

    const target = items[currentIndex];
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';

    target.scrollIntoView({
      behavior,
      inline: 'center',
      block: 'nearest',
    });
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  function startAuto() {
    if (autoTimer || prefersReducedMotion || !items.length) return;
    autoTimer = setInterval(next, 4000);
  }

  function stopAuto() {
    if (!autoTimer) return;
    clearInterval(autoTimer);
    autoTimer = null;
  }

  function wireControls() {
    if (prevBtn) {
      prevBtn.addEventListener('click', (event) => {
        event.preventDefault();
        stopAuto();
        prev();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (event) => {
        event.preventDefault();
        stopAuto();
        next();
      });
    }

    // Teclado dentro del viewport
    viewport.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        stopAuto();
        next();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        stopAuto();
        prev();
      }
    });

    // Pausar autoplay cuando el usuario interactúa
    sliderRoot.addEventListener('mouseenter', stopAuto);
    sliderRoot.addEventListener('mouseleave', startAuto);
    viewport.addEventListener('focusin', stopAuto);
    viewport.addEventListener('focusout', startAuto);
  }

  // Lazy-load: solo pedimos labels cuando el slider entra en viewport
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadAndRenderLabels().then(() => {
              startAuto();
            });
            io.disconnect();
          }
        });
      },
      {
        threshold: 0.2,
      }
    );
    io.observe(section);
  } else {
    // Fallback sin IO
    await loadAndRenderLabels();
    startAuto();
  }
}
