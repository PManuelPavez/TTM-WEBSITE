/* slider.js — robust, non-invasive slider
   - Compatible with markup that uses #heroSlider or #slider or .fade-slider
   - Uses .slides/.slide layout (grid or absolute) and falls back to toggling .active
   - Respects data-autoplay attribute on the slider element
   - Pauses on hover/focus and on document visibilitychange
   - Does NOT add global click handlers or call preventDefault() on unrelated links
   - Accessible: dots buttons with aria-label, keyboard left/right support
*/
(function () {
  const sliderEl =
    document.getElementById('heroSlider') ||
    document.getElementById('slider') ||
    document.querySelector('.fade-slider');

  if (!sliderEl) return;

  const slidesContainer =
    sliderEl.querySelector('.slides') ||
    sliderEl.querySelector('#sliderSlides') ||
    null;

  if (!slidesContainer) return;

  // collect slides (support .slide elements or direct children)
  let slides = Array.from(slidesContainer.querySelectorAll('.slide'));
  if (!slides.length) {
    // fallback: use direct children
    slides = Array.from(slidesContainer.children).filter(
      (n) => n.nodeType === 1
    );
  }
  if (!slides.length) return;

  const prevBtn =
    sliderEl.querySelector('.prev') || sliderEl.querySelector('[data-prev]');
  const nextBtn =
    sliderEl.querySelector('.next') || sliderEl.querySelector('[data-next]');

  let dotsContainer =
    sliderEl.querySelector('.dots') || sliderEl.querySelector('#sliderDots') || null;

  // If no dots container, create one and append at the end of sliderEl
  if (!dotsContainer) {
    dotsContainer = document.createElement('div');
    dotsContainer.className = 'dots';
    sliderEl.appendChild(dotsContainer);
  }

  let current = 0;
  const lastIndex = slides.length - 1;
  const dots = [];

  // Create dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = i === 0 ? 'dot active' : 'dot';
    btn.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      goTo(i);
    });
    dotsContainer.appendChild(btn);
    dots.push(btn);
  });

  // Helper: set active index with safe bounds
  function goTo(index) {
    if (index === current) return;
    const newIndex = ((index % slides.length) + slides.length) % slides.length;

    // remove active state from previous
    slides[current].classList.remove('active');
    if (dots[current]) {
      dots[current].classList.remove('active');
      dots[current].setAttribute('aria-pressed', 'false');
    }

    // add active to new
    slides[newIndex].classList.add('active');
    if (dots[newIndex]) {
      dots[newIndex].classList.add('active');
      dots[newIndex].setAttribute('aria-pressed', 'true');
    }

    // If slides are laid out horizontally (grid with transform), move container.
    // Only set transform if container can accept it (defensive)
    try {
      // Check if slidesContainer children are inline columns (grid/flow)
      // We'll always set transform to translateX percent — it's harmless if layout doesn't use it.
      slidesContainer.style.transform = `translateX(-${100 * newIndex}%)`;
      slidesContainer.style.transition = slidesContainer.style.transition || 'transform 0.6s ease';
    } catch (e) {
      // ignore
    }

    current = newIndex;
  }

  // Prev / Next handlers (safe guards)
  if (prevBtn) {
    prevBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      goTo(current - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      goTo(current + 1);
    });
  }

  // Keyboard support: left/right when slider has focus
  sliderEl.setAttribute('tabindex', sliderEl.getAttribute('tabindex') || '0');
  sliderEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(current - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(current + 1);
    }
  });

  // Autoplay handling
  const autoplayAttr = sliderEl.getAttribute('data-autoplay') || sliderEl.dataset.autoplay;
  const shouldAutoplay = autoplayAttr === '' || autoplayAttr === 'true' || autoplayAttr === true;
  let autoplayTimer = null;
  const autoplayDelay = parseInt(sliderEl.getAttribute('data-delay') || sliderEl.dataset.delay || 6000, 10) || 6000;

  function startAutoplay() {
    if (!shouldAutoplay || autoplayTimer !== null || slides.length <= 1) return;
    autoplayTimer = setInterval(() => {
      goTo(current + 1);
    }, autoplayDelay);
  }
  function stopAutoplay() {
    if (autoplayTimer !== null) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Pause on hover/focus to be polite
  sliderEl.addEventListener('mouseenter', stopAutoplay, { passive: true });
  sliderEl.addEventListener('mouseleave', startAutoplay, { passive: true });
  sliderEl.addEventListener('focusin', stopAutoplay);
  sliderEl.addEventListener('focusout', startAutoplay);

  // Pause when the page is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  // Initialize: ensure first slide has active class and container transform
  slides.forEach((s, i) => {
    if (i === 0) s.classList.add('active');
    else s.classList.remove('active');
    // Ensure slides take full width when using transform approach
    s.style.minWidth = s.style.minWidth || '100%';
  });

  // If slidesContainer is a flex/grid row, make sure it's sized for transform:
  slidesContainer.style.display = slidesContainer.style.display || 'grid';
  slidesContainer.style.gridAutoFlow = slidesContainer.style.gridAutoFlow || 'column';
  slidesContainer.style.gridAutoColumns = slidesContainer.style.gridAutoColumns || '100%';
  slidesContainer.style.overflow = slidesContainer.style.overflow || 'hidden';
  slidesContainer.style.transition = slidesContainer.style.transition || 'transform 0.6s ease';

  // Start autoplay if requested
  startAutoplay();

  // Expose minimal API (non-global): attach to element for debugging if needed
  try {
    sliderEl.__slider = {
      goTo,
      next: () => goTo(current + 1),
      prev: () => goTo(current - 1),
      startAutoplay,
      stopAutoplay,
    };
  } catch (e) {
    // ignore in strict environments
  }
})();
