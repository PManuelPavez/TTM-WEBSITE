export function initPreloader() {
  const preloader = document.querySelector('[data-ttm-preloader]');
  if (!preloader) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const hidePreloader = () => {
    // Si ya está oculto, no repitas
    if (preloader.classList.contains('is-hidden')) return;

    // Paso 1: animación de salida
    preloader.classList.add('is-hiding');

    const onTransitionEnd = (event) => {
      // Nos aseguramos de escuchar la transición del overlay
      if (event.target !== preloader) return;

      preloader.classList.remove('is-hiding', 'is-active');
      preloader.classList.add('is-hidden');

      preloader.removeEventListener('transitionend', onTransitionEnd);
    };

    preloader.addEventListener('transitionend', onTransitionEnd);
  };

  // Si el usuario pidió menos animación, no mareamos
  if (prefersReducedMotion) {
    preloader.classList.remove('is-active');
    preloader.classList.add('is-hidden');
    return;
  }

  // Estrategia simple: cuando la página termina de cargar, escondemos
  window.addEventListener('load', () => {
    // Pequeño delay para que se vea algo pero no sea pesado
    window.setTimeout(hidePreloader, 600);
  });
}
