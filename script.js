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

// === SLIDER (sin cambios previos) ===
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');
let current = 0;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => showSlide(i));
  dotsContainer.append(dot);
});

function showSlide(i) {
  slides[current].classList.remove('active');
  dotsContainer.children[current].classList.remove('active');
  current = i;
  slides[current].classList.add('active');
  dotsContainer.children[current].classList.add('active');
}

setInterval(() => {
  const next = (current + 1) % slides.length;
  showSlide(next);
}, 5000);

// === MENU HAMBURGUESA ===
const navToggle = document.querySelector('.nav-toggle');
const navTabs = document.querySelector('.nav-tabs');
if (navToggle) {
  navToggle.addEventListener('click', () => navTabs.classList.toggle('open'));
}

// === MODAL FORM LOGIC ===
const modal = document.getElementById('contactModal');
const openForm = document.getElementById('openForm');
const closeForm = document.getElementById('closeForm');
const overlay = document.querySelector('.modal-overlay');
const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');

const subject = document.getElementById('subject');
const artistSelectContainer = document.getElementById('artistSelectContainer');
const artistSelect = document.getElementById('artist');
const message = document.getElementById('message');
const nameInput = document.getElementById('name');

function toggleModal(show) {
  if (show) {
    modal.hidden = false;
    setTimeout(() => modal.classList.add('show'), 10);
  } else {
    modal.classList.remove('show');
    setTimeout(() => modal.hidden = true, 300);
  }
}

openForm?.addEventListener('click', () => toggleModal(true));
closeForm?.addEventListener('click', () => toggleModal(false));
overlay?.addEventListener('click', () => toggleModal(false));

modal?.addEventListener('click', e => {
  if (e.target === modal) toggleModal(false);
});

// === DYNAMIC FORM MESSAGE ===
function updateMessage() {
  const subj = subject.value;
  const name = nameInput.value.trim();
  const artist = artistSelect.value;
  
  let text = `Hola TTM! Me contacto por: ${subj}`;
  
  if (subj === 'Booking' && artist) {
    text += `, sobre el artista ${artist}`;
  }
  
  if (name) {
    text += `. Mi nombre es ${name}.`;
  }
  
  text += '\n\n';
  message.value = text;
}

subject.addEventListener('change', () => {
  const isBooking = subject.value === 'Booking';
  artistSelectContainer.hidden = !isBooking;
  updateMessage();
});
artistSelect.addEventListener('change', updateMessage);
nameInput.addEventListener('input', updateMessage);
subject.addEventListener('input', updateMessage);

// === FORM SUBMIT + TOAST ===
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  fetch(form.action, {
    method: 'POST',
    body: new FormData(form)
  }).then(() => {
    toggleModal(false);
    showToast();
    form.reset();
  }).catch(() => {
    showToast('Error al enviar, por favor intentá de nuevo.');
  });
});

function showToast(text = '¡Gracias por contactarte con To The Moon! Te responderemos pronto.') {
  toast.textContent = text;
  toast.hidden = false;
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.hidden = true, 300);
  }, 4000);
}

// === UNDERLINE ANIMATION ===
const underline = document.querySelector('.underline-animated');
window.addEventListener('load', () => underline?.classList.add('active'));

// services-interactions.js  (pegar al final de script.js o como archivo nuevo y añadir <script src="...">)
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.services-ol > li');
  // Añadimos clases 'reveal' y 'collapsible' para control
  items.forEach(li => {
    li.classList.add('reveal'); // mejora la animación al scrollear
    // hacemos clic en el H3 para abrir/cerrar
    const h3 = li.querySelector('h3');
    if (!h3) return;
    // añadir chevron si no existe
    if (!h3.querySelector('.chev')) {
      const chev = document.createElement('span');
      chev.className = 'chev';
      chev.innerHTML = '▸'; // símbolo simple
      h3.appendChild(chev);
    }
    // hacemos que sea "collapsible" al click en móviles/usuarios que quieran toggle
    li.classList.add('collapsible');
    h3.style.cursor = 'pointer';
    h3.addEventListener('click', () => {
      li.classList.toggle('open');
    });
  });

  // IntersectionObserver para revelar elementos al entrar en viewport
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.services-ol > li.reveal').forEach(el => io.observe(el));

  // opcional: smooth anchor scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const tgt = document.querySelector(a.getAttribute('href'));
      if (tgt) { e.preventDefault(); tgt.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });

});
