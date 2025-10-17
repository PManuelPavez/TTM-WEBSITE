const sliderDataPath = "slider.json";
const sliderContainer = document.getElementById("sliderSlides");
const dotsContainer = document.getElementById("sliderDots");

let current = 0;
let slides = [];

fetch(sliderDataPath)
  .then((res) => res.json())
  .then((data) => {
    slides = data;
    renderSlides();
    startSlider();
  });

function renderSlides() {
  sliderContainer.innerHTML = slides
    .map(
      (s, i) => `
      <div class="slide ${i === 0 ? "active" : ""}" 
        style="background-image: url('${s.image}');">
        <div class="caption">
          <h2>${s.title}</h2>
          <p>${s.text}</p>
        </div>
      </div>`
    )
    .join("");

  dotsContainer.innerHTML = slides
    .map(
      (_, i) =>
        `<button class="${i === 0 ? "active" : ""}" aria-label="Ir a slide ${
          i + 1
        }"></button>`
    )
    .join("");

  dotsContainer.querySelectorAll("button").forEach((dot, i) => {
    dot.addEventListener("click", () => showSlide(i));
  });
}

function showSlide(i) {
  const allSlides = document.querySelectorAll(".slide");
  const allDots = document.querySelectorAll(".dots button");
  allSlides[current].classList.remove("active");
  allDots[current].classList.remove("active");
  current = i;
  allSlides[current].classList.add("active");
  allDots[current].classList.add("active");
}

function startSlider() {
  setInterval(() => {
    let next = (current + 1) % slides.length;
    showSlide(next);
  }, 4000);
}
