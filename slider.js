(async function(){
  const slider = document.getElementById("heroSlider");
  const dotsContainer = document.getElementById("sliderDots");
  if (!slider || !dotsContainer) return;

  try {
    const res = await fetch("slider.json");
    const slidesData = await res.json();

    slidesData.forEach((item, i) => {
      const slide = document.createElement("div");
      slide.className = "fade-slide";
      if (i === 0) slide.classList.add("active");
      slide.style.backgroundImage = `url('${item.image}')`;

      const overlay = document.createElement("div");
      overlay.className = "fade-overlay";
      overlay.innerHTML = `<h1>${item.title}</h1><p>${item.subtitle}</p>`;
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

    function goToSlide(index) {
      slides[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("active");
      dots[current].classList.add("active");
    }

    // autoplay con fade
    setInterval(() => goToSlide(current + 1), 7000);
  } catch (err) {
    console.error("Error cargando slider.json", err);
  }
})();
