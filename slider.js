(async function(){
  const slider = document.getElementById("heroSlider");
  const dotsContainer = document.getElementById("sliderDots");
  if (!slider || !dotsContainer) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  async function loadSlides() {
    try {
      const res = await fetch("slider.json");
      return await res.json();
    } catch {
      console.warn("Error al cargar slider.json — usando fallback");
      return [];
    }
  }

  const slidesData = await loadSlides();
  if (!slidesData.length) return;

  // Crear slides dinámicamente
  slidesData.forEach((s, i) => {
    const slide = document.createElement("div");
    slide.className = "fade-slide";
    if (i === 0) slide.classList.add("active");
    slide.style.backgroundImage = `url('${s.image}')`;

    const overlay = document.createElement("div");
    overlay.className = "fade-overlay";
    overlay.innerHTML = `
      <h1>${s.title}</h1>
      <p>${s.subtitle}</p>
    `;
    slide.appendChild(overlay);
    slider.appendChild(slide);

    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const slides = slider.querySelectorAll(".fade-slide");
  const dots = dotsContainer.querySelectorAll("button");
  let current = 0;
  let interval;

  function goToSlide(n) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (n + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  function nextSlide() {
    goToSlide(current + 1);
  }

  function startAutoplay() {
    if (prefersReduced) return;
    stopAutoplay();
    interval = setInterval(nextSlide, 7000);
  }

  function stopAutoplay() {
    clearInterval(interval);
  }

  // Pausa en hover o foco
  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);
  slider.addEventListener("focusin", stopAutoplay);
  slider.addEventListener("focusout", startAutoplay);

  // Keyboard (← →)
  slider.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") goToSlide(current - 1);
    if (e.key === "ArrowRight") goToSlide(current + 1);
  });

  // Intersection Observer (solo inicia si es visible)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) startAutoplay();
      else stopAutoplay();
    });
  }, { threshold: 0.3 });
  observer.observe(slider);
})();
