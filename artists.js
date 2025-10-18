// artists.js — improved: continuous marquee with speed control, compact single-text cards,
// lazy batch loading, expand/collapse toggles (no inner white boxes)

(() => {
  'use strict';

  /* ---------- DATA (usa tus datos reales o extiende) ---------- */
  const ARTISTS = [
    { name:"Servando", role:"DJ / Producer", photo:"assets/artists/servando.jpg",
      text: `Servando es un DJ y productor argentino en ascenso dentro de la escena global de la música electrónica. Ha compartido cabina con figuras como Ezequiel Arias, Budakid y Hernán Cattáneo; sus producciones se han editado en sellos relevantes y su proyección internacional sigue en crecimiento.` },
    { name:"Luciano Bedini", role:"DJ / Producer", photo:"assets/artists/luciano_bedini.jpg",
      text: `Luciano fusiona progressive house, dub techno y deep house creando paisajes melódicos e hipnóticos. Su música ha sido editada por sellos como Sound Avenue y Future Avenue.` },
    { name:"Manu Pavez", role:"DJ / Producer", photo:"assets/artists/manu_pavez.jpg",
      text: `Manu transforma cada set en un viaje emocional. Con múltiples lanzamientos, su enfoque combina técnica y sensibilidad.` },
    { name:"Fideksen", role:"DJ / Producer", photo:"assets/artists/fideksen.jpg",
      text: `Fideksen aporta elegancia melódica y groove. Fundador de La Casadiscografica, impulsa nuevos talentos con visión artística.` },
    { name:"Kentavros", role:"DJ", photo:"assets/artists/kentavros.jpg",
      text: `Kentavros desarrolla atmósferas inmersivas dentro del progressive y melodic house, conectando emocionalmente con el público.` },
    { name:"p37ro", role:"DJ / Producer", photo:"assets/artists/p37ro.jpg",
      text: `p37ro combina técnica y sensibilidad en sus producciones progressive apoyadas por referentes de la escena.` }
  ];

  /* ---------- UTILS ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- MARQUEE (continuous) ---------- */
  function initMarquee() {
    const marquee = $('#artistsMarquee');
    if (!marquee) return;

    // build initial items (text repeated). Use more repeats to fill wide screens.
    const base = 'ARTISTS';
    const repeatCount = 16;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < repeatCount; i++) {
      const sp = document.createElement('span');
      sp.className = 'marq-item';
      sp.textContent = base;
      fragment.appendChild(sp);
    }
    // append two copies for seamless
    marquee.appendChild(fragment.cloneNode(true));
    marquee.appendChild(fragment.cloneNode(true));

    // determine speed: allow data attribute on marquee element data-speed (px/sec) or default 120
    const pxPerSec = parseFloat(marquee.datasetSpeed || marquee.dataset?.speed) || 120;

    // compute duration based on total width (two copies)
    requestAnimationFrame(() => {
      const totalW = marquee.scrollWidth;
      // duration seconds = width(px) / pxPerSec (but we want translateX -50% (one copy))
      const oneCopyWidth = totalW / 2;
      const durationSec = clamp(oneCopyWidth / pxPerSec, 8, 180); // clamp to avoid extreme durations
      marquee.style.animationDuration = `${durationSec}s`;
      // set running class to start CSS animation
      marquee.classList.add('running');
    });
  }

  /* ---------- TITLE underline ---------- */
  function animateTitle() {
    const t = $('.artists-title');
    if (!t) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    requestAnimationFrame(() => setTimeout(() => t.classList.add('underlined'), 120));
  }

  /* ---------- CARDS: lazy load in batches, single-text, expand/collapse ---------- */
  const BATCH = 2;
  let idx = 0;
  const listRoot = $('#artistsList');
  const sentinel = $('#loadMoreSentinel');

  function makeCard(d) {
    const art = document.createElement('article');
    art.className = 'artist-card';
    art.tabIndex = 0;

    art.innerHTML = `
      <div class="artist-left" data-src="${escapeHtml(d.photo)}"></div>
      <div class="artist-right">
        <div class="artist-row">
          <div class="title">
            <span>${escapeHtml(d.name)}</span>
            <small>${escapeHtml(d.role)}</small>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="artist-socials" aria-hidden="false">
              <a href="#" class="artist-ig" title="Instagram">IG</a>
              <a href="#" class="artist-sc" title="SoundCloud">SC</a>
            </div>
            <div class="expand-area">
              <button class="expand-btn" aria-expanded="false" aria-label="Expandir biografía">
                <span class="arrow">▾</span>
              </button>
            </div>
          </div>
        </div>

        <p class="artist-bio">${escapeHtml(d.text)}</p>
        <!-- no inner white box; extra content is the same text shown fully when expanded -->
      </div>
    `;

    const left = art.querySelector('.artist-left');
    const imgSrc = left.dataset.src;
    // image lazy set on insert (handled in loader)

    // expand logic
    const btn = art.querySelector('.expand-btn');
    btn.addEventListener('click', () => toggle(art, btn));

    // keyboard shortcut
    art.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });

    return art;
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function loadBatch() {
    if (!listRoot) return;
    const stop = Math.min(idx + BATCH, ARTISTS.length);
    for (; idx < stop; idx++) {
      const data = ARTISTS[idx];
      // placeholder for shimmer effect
      const ph = document.createElement('div'); ph.className = 'artist-placeholder';
      listRoot.appendChild(ph);

      // replace in next paint to keep UI responsive
      (function(p, d) {
        requestAnimationFrame(() => {
          const card = makeCard(d);
          listRoot.replaceChild(card, p);
          // lazy-load background image
          const left = card.querySelector('.artist-left');
          const src = left.getAttribute('data-src');
          if (src) {
            const img = new Image();
            img.onload = () => left.style.backgroundImage = `url('${src}')`;
            img.src = src;
          }
        });
      })(ph, data);
    }

    // disconnect when done
    if (idx >= ARTISTS.length && sentinelObserver) { sentinelObserver.disconnect(); sentinel.style.display = 'none'; }
  }

  let sentinelObserver = null;
  function initLazy() {
    // load first batch immediately for perceived speed
    loadBatch();
    if ('IntersectionObserver' in window && sentinel) {
      sentinelObserver = new IntersectionObserver((entries) => {
        entries.forEach(en => { if (en.isIntersecting) loadBatch(); });
      }, { root: null, rootMargin: '300px', threshold: 0.1 });
      sentinelObserver.observe(sentinel);
    } else {
      while (idx < ARTISTS.length) loadBatch();
    }
  }

  // toggle expand/collapse
  function toggle(card, btn) {
    const expanded = card.classList.toggle('expanded');
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    // scroll into view on expand (respect reduced motion)
    if (expanded && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 220);
    }
  }

  /* ---------- INIT on DOMContentLoaded ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initMarquee();
    animateTitle();
    initLazy();

    // expose speed control: if user sets #marqueeSpeed input, update animation speed live
    const marquee = $('#artistsMarquee');
    if (marquee) {
      const speedInput = document.getElementById('marqueeSpeed');
      if (speedInput) {
        speedInput.addEventListener('input', (e) => {
          const pxPerSec = parseFloat(e.target.value) || 120;
          const totalW = marquee.scrollWidth;
          const duration = Math.max(8, (totalW / 2) / pxPerSec);
          marquee.style.animationDuration = `${duration}s`;
        });
      }
    }

    // footer year
    const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  });

})();
