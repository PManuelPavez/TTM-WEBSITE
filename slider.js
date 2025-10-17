/* slider.js — versión mejorada
   Reemplazar completamente el archivo anterior por este.
   Requisitos: slider.json en la raíz y /o images locales referenciadas allí.
*/
(function () {
  'use strict';

  // SELECTORS — soporta dos estructuras (dependiendo del HTML que tengas)
  const slidesContainer = document.getElementById('sliderSlides') || document.querySelector('#slider .slides') || document.querySelector('.fade-slider .slides');
  const dotsContainer   = document.getElementById('sliderDots')   || document.querySelector('#slider .dots')  || document.querySelector('.fade-slider .dots');
  const sliderRoot      = document.getElementById('slider')      || document.querySelector('.fade-slider');

  if (!slidesContainer || !dotsContainer || !sliderRoot) {
    console.warn('Slider: elementos DOM faltantes (sliderSlides/sliderDots/slider). No se inicializa.');
    return;
  }

  const JSON_PATH = 'slider.json';
  const AUTOPLAY_ATTR = sliderRoot.getAttribute('data-autoplay');
  const AUTOPLAY = AUTOPLAY_ATTR === null ? true : AUTOPLAY_ATTR === 'true';
  const INTERVAL_MS = 6000;
  const PRELOAD_COUNT = 2; // cuántas imágenes preloadear prioritariamente

  const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let slidesData = [];
  let slidesEls = [];
  let dotsEls = [];
  let current = 0;
  let timer = null;
  let started = false;

  // =========================
  // Utilities
  // =========================
  function el(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    return tpl.content.firstChild;
  }

  async function fetchJSON(path) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) throw new Error('no json');
      return await res.json();
    } catch (err) {
      console.warn('slider.json no disponible o inválido, uso fallback', err);
      return null;
    }
  }

  function preloadImage(src) {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.src = src;
        img.onload  = () => resolve({ ok: true, src });
        img.onerror = () => resolve({ ok: false, src });
      } catch {
        resolve({ ok: false, src });
      }
    });
  }

  function setActive(index) {
    if (!slidesEls.length) return;
    const prev = current;
    current = ((index % slidesEls.length) + slidesEls.length) % slidesEls.length;
    if (prev === current) return;
    slidesEls[prev].classList.remove('active');
    dotsEls[prev].classList.remove('active');
    slidesEls[current].classList.add('active');
    dotsEls[current].classList.add('active');
  }

  function nextSlide() { setActive(current + 1); }
  function prevSlide() { setActive(current - 1); }

  // =========================
  // Render
  // =========================
  function renderSlides(data) {
    slidesContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    slidesEls = [];
    dotsEls = [];

    data.forEach((item, i) => {
      // slide
      const slide = document.createElement('div');
      slide.className = 'slide' + (i === 0 ? ' active' : '');
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${i + 1} de ${data.length}`);
      slide.dataset.index = String(i);
      slide.style.backgroundImage = `url('${item.image}')`;

      // optional caption inside slide (keeps markup accessible)
      if (item.title || item.subtitle || item.text) {
        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.innerHTML = `<div class="caption-inner">
          ${item.title ? `<h2 class="caption-title">${item.title}</h2>` : ''}
          ${item.subtitle || item.text ? `<p class="caption-sub">${item.subtitle || item.text || ''}</p>` : ''}
        </div>`;
        slide.appendChild(caption);
      }

      slidesContainer.appendChild(slide);
      slidesEls.push(slide);

      // dot
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = i === 0 ? 'active' : '';
      dot.setAttribute('aria-label', `Ir a slide ${i + 1}`);
      dot.dataset.index = String(i);
      dot.addEventListener('click', () => {
        stopAutoplay();
        setActive(i);
        startAutoplayDeferred();
      });
      dotsContainer.appendChild(dot);
      dotsEls.push(dot);
    });
  }

  // =========================
  // Autoplay / Controls
  // =========================
  function startAutoplay() {
    if (!AUTOPLAY || PREFERS_REDUCED || timer) return;
    timer = setInterval(() => {
      nextSlide();
    }, INTERVAL_MS);
  }

  function stopAutoplay() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // small helper to start autoplay after a short delay (useful after manual interaction)
  let autoplayRestartTimeout = null;
  function startAutoplayDeferred(delay = 2000) {
    if (!AUTOPLAY || PREFERS_REDUCED) return;
    if (autoplayRestartTimeout) clearTimeout(autoplayRestartTimeout);
    autoplayRestartTimeout = setTimeout(() => {
      startAutoplay();
    }, delay);
  }

  // =========================
  // Keyboard & pointer behavior
  // =========================
  function addInteractionHandlers() {
    // pause on hover / focus
    sliderRoot.addEventListener('mouseenter', stopAutoplay);
    sliderRoot.addEventListener('mouseleave', () => startAutoplayDeferred(600));
    sliderRoot.addEventListener('focusin', stopAutoplay);
    sliderRoot.addEventListener('focusout', () => startAutoplayDeferred(600));

    // keyboard navigation
    sliderRoot.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowLeft') { ev.preventDefault(); prevSlide(); stopAutoplay(); startAutoplayDeferred(); }
      if (ev.key === 'ArrowRight'){ ev.preventDefault(); nextSlide(); stopAutoplay(); startAutoplayDeferred(); }
      if (ev.key === 'Home') { ev.preventDefault(); setActive(0); stopAutoplay(); startAutoplayDeferred(); }
      if (ev.key === 'End')  { ev.preventDefault(); setActive(slidesEls.length - 1); stopAutoplay(); startAutoplayDeferred(); }
    });

    // optional: allow clicking on slide to advance
    slidesEls.forEach(s => {
      s.addEventListener('click', () => {
        nextSlide();
        stopAutoplay();
        startAutoplayDeferred();
      });
    });
  }

  // =========================
  // Visibility / Intersection Observer
  // =========================
  function addVisibilityObserver() {
    if (!('IntersectionObserver' in window)) {
      // fallback: start immediately
      startAutoplay();
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          // start autoplay when visible first time
          if (!started) {
            started = true;
            startAutoplay();
          } else {
            // resume if it was paused because scrolled away
            startAutoplayDeferred(250);
          }
        } else {
          // pause while out of view
          stopAutoplay();
        }
      });
    }, { threshold: 0.35 });
    io.observe(sliderRoot);
  }

  // =========================
  // Init sequence
  // =========================
  async function init() {
    // 1) load JSON
    let data = await fetchJSON(JSON_PATH);
    if (!data) {
      // fallback minimal dataset if needed
      data = [
        { image: 'assets/hero1.webp', title: 'Unlock Your Potential', subtitle: 'Gestión 360° para artistas.' },
        { image: 'assets/hero2.webp', title: 'Crecer con propósito',       subtitle: 'Desarrollo artístico y estrategia.' },
        { image: 'assets/hero3.webp', title: 'High Performance',          subtitle: 'Estrategias que transforman talento.' }
      ];
    }
    slidesData = data;

    // 2) render DOM
    renderSlides(slidesData);

    // 3) preload first N images (non-blocking)
    const toPreload = slidesData.slice(0, PRELOAD_COUNT).map(s => preloadImage(s.image));
    // Don't await all; but ensure first one loads soonish to improve LCP
    Promise.race(toPreload).then(()=> {
      // noop: ensures at least one image attempts to load quickly
    });

    // 4) wire controls & events
    addInteractionHandlers();
    addVisibilityObserver();

    // Expose API for debugging
    window.__TTMSlider = {
      goTo: (n) => setActive(n),
      next: nextSlide,
      prev: prevSlide,
      play: startAutoplay,
      stop: stopAutoplay,
      count: () => slidesEls.length
    };
  }

  // start
  init();

})();
