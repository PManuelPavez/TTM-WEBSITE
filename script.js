// script.js — nav toggle + simple hero slider + helpers
(function () {
  'use strict';

  /* ===== NAV TOGGLE (accessible) ===== */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-tabs');

  if (toggle && nav) {
    function setOpen(v) {
      toggle.setAttribute('aria-expanded', String(v));
      if (v) nav.classList.add('open'); else nav.classList.remove('open');
    }
    toggle.addEventListener('click', (e) => {
      const exp = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!exp);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980 && nav.classList.contains('open')) setOpen(false);
    });
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('open')) return;
      if (toggle.contains(e.target) || nav.contains(e.target)) return;
      setOpen(false);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ===== HERO SLIDER (simple, compatible) ===== */
  const sliderRoot = document.getElementById('heroSlider');
  if (!sliderRoot) return;

  const slides = Array.from(sliderRoot.querySelectorAll('.slide'));
  const dotsContainer = document.getElementById('heroDots') || sliderRoot.querySelector('.dots');
  let current = 0;
  let timer = null;
  const INTERVAL = 6000;
  const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    slides.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Ir a slide ' + (i + 1));
      b.addEventListener('click', () => { go(i); restart(); });
      if (i === 0) b.classList.add('active');
      dotsContainer.appendChild(b);
    });
  }

  function show(i) {
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === i);
    });
    if (dotsContainer) {
      Array.from(dotsContainer.children).forEach((d, idx) => d.classList.toggle('active', idx === i));
    }
    current = i;
  }

  function next() { show((current + 1) % slides.length); }
  function start() { if (PREFERS_REDUCED) return; stop(); timer = setInterval(next, INTERVAL); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { stop(); setTimeout(start, 1200); }
  function go(i) { show(i); }

  // init
  renderDots();
  show(0);
  // pause on hover/focus
  sliderRoot.addEventListener('mouseenter', stop);
  sliderRoot.addEventListener('mouseleave', start);
  sliderRoot.addEventListener('focusin', stop);
  sliderRoot.addEventListener('focusout', start);

  // start when visible (IO) or immediately
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) start(); else stop();
      });
    }, { threshold: 0.35 });
    io.observe(sliderRoot);
  } else start();

  // set year in footer where present
  document.addEventListener('DOMContentLoaded', () => {
    const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  });

})();
