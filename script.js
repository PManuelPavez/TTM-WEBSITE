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
