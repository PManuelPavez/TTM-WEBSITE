/**
 * slider.js
 * - carga slides desde slider.json
 * - preload de imágenes
 * - autoplay pausable, pausa en hover/focus
 * - keyboard controls, dots, accessible roles
 * - only start when slider visible (IntersectionObserver)
 */

(async function(){
  const sliderEl = document.getElementById('heroSlider');
  const dotsEl   = document.getElementById('sliderDots');
  if (!sliderEl || !dotsEl) return;

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AUTOPLAY_ATTR = sliderEl.getAttribute('data-autoplay');
  const AUTOPLAY = AUTOPLAY_ATTR === null ? true : AUTOPLAY_ATTR === 'true';

  // 1) CARGAR JSON (con fallback si no existe)
  async function loadJSON(){
    try {
      const res = await fetch('slider.json', {cache:'no-store'});
      if (!res.ok) throw new Error('no slider.json');
      return await res.json();
    } catch(err){
      console.warn('slider.json not found or invalid, using fallback', err);
      return [
        { image: 'https://source.unsplash.com/1600x900/?music,studio', title:'Unlock Your Potential', subtitle:'Representamos y acompañamos el talento desde una mirada humana e integral.' },
        { image: 'https://source.unsplash.com/1600x900/?concert,artist', title:'Crecer con propósito', subtitle:'Desarrollo artístico, bienestar y estrategia de carrera.' },
        { image: 'https://source.unsplash.com/1600x900/?recording,producer', title:'To The Moon', subtitle:'Un equipo que impulsa el arte y la autenticidad.' }
      ];
    }
  }

  const slidesData = await loadJSON();
  if (!Array.isArray(slidesData) || slidesData.length === 0) return;

  // 2) PRELOAD imágenes (no bloqueante: show skeleton first)
  // Creamos promesas de carga, no esperamos para empezar a mostrar primera slide si tarda
  const preloadPromises = slidesData.map(s => new Promise((resolve) => {
    const img = new Image();
    img.src = s.image;
    img.onload = () => resolve({ ok:true, src: s.image });
    img.onerror = () => resolve({ ok:false, src: s.image });
  }));

  // 3) CREAR DOM de slides + dots
  sliderEl.innerHTML = ''; // limpio
  dotsEl.innerHTML = '';

  slidesData.forEach((item, idx) => {
    const slide = document.createElement('div');
    slide.className = 'fade-slide';
    slide.setAttribute('role','group');
    slide.setAttribute('aria-roledescription','slide');
    slide.setAttribute('aria-label', `${idx + 1} de ${slidesData.length}`);
    slide.setAttribute('data-index', idx);
    if (idx === 0) slide.classList.add('active');

    // background-image aplicado por style para soportar URLs externas
    slide.style.backgroundImage = `url('${item.image}')`;

    // overlay con texto (lectura)
    const overlay = document.createElement('div');
    overlay.className = 'fade-overlay';
    overlay.innerHTML = `<h2 class="fade-title">${item.title}</h2>
                         <p class="fade-sub">${item.subtitle}</p>
                         <span class="sr-only">Slide ${idx+1} — ${item.title}</span>`;
    slide.appendChild(overlay);
    sliderEl.appendChild(slide);

    // dot
    const dot = document.createElement('button');
    dot.setAttribute('role','tab');
    dot.setAttribute('aria-label', `Ir a slide ${idx+1}`);
    dot.setAttribute('aria-controls','heroSlider');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(idx));
    dotsEl.appendChild(dot);
  });

  const slides = Array.from(sliderEl.querySelectorAll('.fade-slide'));
  const dots   = Array.from(dotsEl.querySelectorAll('button'));

  // 4) HELPERS: navegación, autoplay, pause/resume
  let current = 0;
  let timer = null;
  const interval = 7000;
  const autoplayEnabled = AUTOPLAY && !REDUCED;

  function setActive(n){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function goTo(n){
    setActive(n);
  }

  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }

  function play(){
    if (!autoplayEnabled) return;
    stop();
    timer = setInterval(() => next(), interval);
  }
  function stop(){
    if (timer) { clearInterval(timer); timer = null; }
  }

  // 5) Pause on hover / focus for accessibility
  sliderEl.addEventListener('mouseenter', () => stop());
  sliderEl.addEventListener('mouseleave', () => play());
  sliderEl.addEventListener('focusin', () => stop());
  sliderEl.addEventListener('focusout', () => play());

  // 6) Keyboard navigation: left/right arrows, and Home/End to first/last
  sliderEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    if (e.key === 'End') { e.preventDefault(); goTo(slides.length - 1); }
  });

  // 7) Start autoplay only when slider is visible (intersection observer)
  let started = false;
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting && !started) {
          started = true;
          // start autoplay after first image preloaded or immediately
          Promise.race(preloadPromises).then(()=> { play(); });
        } else if (!en.isIntersecting) {
          stop();
        }
      });
    }, {threshold: 0.35});
    io.observe(sliderEl);
  } else {
    // fallback: start immediately
    Promise.race(preloadPromises).then(()=> { play(); });
  }

  // 8) Ensure first image loads (simple prefetch hint)
  preloadPromises[0].then(()=> {
    // If first image loaded later, still fine
  });

  // 9) Expose small public API (useful for debugging)
  window.__TTMSlider = { goTo, next, prev, play, stop, slidesCount: slides.length };

})();
