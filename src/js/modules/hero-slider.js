// hero-slider.js
// Implements a simple hero slider with automatic rotation and dots navigation.

export function initHeroSlider() {
  const slider = document.querySelector('.c-hero-slider');
  if (!slider) return;
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const dotsContainer = slider.querySelector('.dots');
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');
  if (!slides.length || !dotsContainer || !prevBtn || !nextBtn) return;

  let current = 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function update() {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('is-active', idx === current);
    });
    dotsContainer.querySelectorAll('button').forEach((dot, idx) => {
      dot.setAttribute('aria-selected', idx === current ? 'true' : 'false');
    });
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    update();
  }

  function next() {
    goTo(current + 1);
  }

  // Create dots for each slide
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Slide ${idx + 1}`);
    dot.addEventListener('click', () => goTo(idx));
    dotsContainer.appendChild(dot);
  });

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  update();

  // Auto-play if allowed
  if (!prefersReducedMotion) {
    let timer = setInterval(next, 5000);
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', () => {
      timer = setInterval(next, 5000);
    });
  }
}