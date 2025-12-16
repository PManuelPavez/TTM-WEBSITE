// src/js/modules/labels-slider.js
// Slider infinito para mostrar sellos discográficos en la página Artists.
// - Carga data desde loadLabels() (Supabase o fallback).
// - Genera los <li> dentro del track.
// - Duplica los ítems y anima con translateX para un loop infinito.
// - Se pausa al interactuar (hover/focus) y sigue solo después.

import { loadLabels } from './data-labels.js';

export async function initLabelsSlider() {
  const body = document.body;
  if (!body || !body.classList.contains('artists-page')) return;

  const main = document.querySelector('main');
  if (!main) return;

  // Usamos la sección ya definida en artists.html
  let section = document.querySelector('[data-ttm-labels-section]');
  if (!section) return;

  const sliderRoot = section.querySelector('[data-ttm-labels-slider]');
  const viewport = section.querySelector('[data-ttm-labels-viewport]');
  const track = section.querySelector('[data-ttm-labels-track]');
  const prevBtn = section.querySelector('[data-ttm-labels-prev]');
  const nextBtn = section.querySelector('[data-ttm-labels-next]');

  if (!sliderRoot || !viewport || !track) return;

  // A11y base
  viewport.setAttribute('role', 'region');
  if (!viewport.hasAttribute('aria-label')) {
    viewport.setAttribute('aria-label', 'Sellos discográficos');
  }
  track.setAttribute('role', 'list');

  let hasLoaded = false;
  let autoControls = null; // { start, stop }

  async function loadAndRenderLabels() {
    if (hasLoaded) return;
    hasLoaded = true;

    let labels = [];
    try {
      labels = await loadLabels();
    } catch (err) {
      console.error('[TTM] Error cargando labels desde Supabase', err);
    }

    if (!labels || !labels.length) {
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

    const items = Array.from(track.querySelectorAll('.labels-slider__item'));
    if (!items.length) {
      section.hidden = true;
      return;
    }

    // Set up infinito + autoplay
    autoControls = setupInfiniteSlider({
      sliderRoot,
      viewport,
      track,
      items,
      prevBtn,
      nextBtn,
    });
  }

  // --- Infinito + autoplay con translateX ---

  function setupInfiniteSlider({ sliderRoot, viewport, track, items, prevBtn, nextBtn }) {
    // Duplicamos los ítems para crear un loop visual
    const originalCount = items.length;
    const clones = [];

    for (let i = 0; i < originalCount; i++) {
      const clone = items[i].cloneNode(true);
      clones.push(clone);
    }
    clones.forEach((clone) => track.appendChild(clone));

    // Ahora la mitad del scrollWidth es el ancho de un loop
    const loopWidth = track.scrollWidth / 2;
    if (!loopWidth) {
      console.warn('[TTM] loopWidth = 0 en labels-slider; no se puede animar.');
      return {
        start() {},
        stop() {},
      };
    }

    let offset = 0;
    let rafId = null;
    let running = false;
    let lastTs = null;

    // px/segundo — ajustá si lo querés más rápido/lento
    const SPEED = 40;

    function applyTransform() {
      // usamos transform para evitar layout thrashing
      track.style.transform = `translateX(${-offset}px)`;
    }

    function step(timestamp) {
      if (!running) return;

      if (lastTs == null) {
        lastTs = timestamp;
      }

      const deltaMs = timestamp - lastTs;
      lastTs = timestamp;

      const deltaPx = (SPEED * deltaMs) / 1000;
      offset += deltaPx;

      // wrap infinito
      if (offset >= loopWidth) {
        offset -= loopWidth;
      }

      applyTransform();
      rafId = window.requestAnimationFrame(step);
    }

    function start() {
      if (running) return;
      running = true;
      lastTs = null;
      rafId = window.requestAnimationFrame(step);
    }

    function stop() {
      if (!running) return;
      running = false;
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function nudge(direction) {
      // movimiento manual con flechas / teclado
      const delta = viewport.clientWidth * 0.4 || 120;
      offset += direction * delta;

      // normalizamos el offset
      while (offset < 0) offset += loopWidth;
      while (offset >= loopWidth) offset -= loopWidth;

      applyTransform();
    }

    // Controles: flechas
    if (prevBtn) {
      prevBtn.addEventListener('click', (event) => {
        event.preventDefault();
        stop();
        nudge(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (event) => {
        event.preventDefault();
        stop();
        nudge(1);
      });
    }

    // Teclado dentro del viewport
    viewport.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        stop();
        nudge(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        stop();
        nudge(-1);
      }
    });

    // Pausa en interacción; resume después
    sliderRoot.addEventListener('mouseenter', stop);
    sliderRoot.addEventListener('mouseleave', start);
    viewport.addEventListener('focusin', stop);
    viewport.addEventListener('focusout', start);

    // Arrancamos una vez armado
    applyTransform();

    return {
      start,
      stop,
    };
  }

  // Lazy-load usando IntersectionObserver
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadAndRenderLabels().then(() => {
              if (autoControls && autoControls.start) {
                autoControls.start();
              }
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
    if (autoControls && autoControls.start) {
      autoControls.start();
    }
  }
}
