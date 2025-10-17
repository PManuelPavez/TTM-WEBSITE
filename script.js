(function(){
  const navToggle = document.getElementById('navToggle');
  const navTabs = document.getElementById('navTabs');
  if (navToggle && navTabs) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navTabs.classList.toggle('open');
    });
  }

  // scroll suave solo para links internos #
  document.querySelectorAll('a[data-link]').forEach(link => {
    link.addEventListener('click', ev => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        ev.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = document.querySelector('.tabsbar').offsetHeight + 40;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // año automático
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // contacto (simulado)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      alert('Mensaje enviado. ¡Gracias por contactarnos!');
      form.reset();
    });
  }
})();
// === Hero Slider ===
(function(){
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  const prev = slider.querySelector('.prev');
  const next = slider.querySelector('.next');
  const dotsContainer = slider.querySelector('#heroDots');
  let current = 0;

  // Crear puntos
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('button');

  function goToSlide(index){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    slider.querySelector('.slides').style.transform = `translateX(-${100 * current}%)`;
  }

  prev.addEventListener('click', () => goToSlide(current - 1));
  next.addEventListener('click', () => goToSlide(current + 1));

  // autoplay
  setInterval(() => goToSlide(current + 1), 6000);
})();
