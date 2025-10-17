/* slider.js - robusto y con fallback */
(function(){
  const slidesContainer = document.getElementById('sliderSlides');
  const dotsContainer   = document.getElementById('sliderDots');
  const sliderRoot      = document.getElementById('slider');

  if (!slidesContainer || !dotsContainer || !sliderRoot) {
    console.warn('Slider: elementos DOM faltan, no inicializo slider.');
    return;
  }

  const JSON_PATH = 'slider.json';
  const AUTOPLAY = sliderRoot.getAttribute('data-autoplay') !== 'false';
  const INTERVAL = 6000;
  const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let slidesData = [];
  let slidesEls = [];
  let dotsEls = [];
  let current = 0;
  let timer = null;

  async function loadJSON(){
    try {
      const res = await fetch(JSON_PATH, {cache:'no-store'});
      if (!res.ok) throw new Error('no slider.json');
      const j = await res.json();
      if (!Array.isArray(j) || !j.length) throw new Error('slider.json vacío/inválido');
      return j;
    } catch (e) {
      console.warn('slider.json no accesible – usaré fallback local', e);
      return [
        { image: 'assets/hero1.webp', title: 'Unlock Your Potential', text: 'Gestión 360° para artistas.' }
      ]; // fallback mínimo (asegurate que assets/hero1.webp existe)
    }
  }

  function createSlide(item, idx){
    const slide = document.createElement('div');
    slide.className = 'slide' + (idx === 0 ? ' active' : '');
    slide.setAttribute('role','group');
    slide.setAttribute('aria-roledescription','slide');
    slide.setAttribute('aria-label', `${idx+1} de ${slidesData.length}`);
    slide.style.backgroundImage = `url('${item.image}')`;

    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.innerHTML = `<div><h2>${item.title || ''}</h2><p>${item.text || item.subtitle || ''}</p></div>`;
    slide.appendChild(caption);

    return slide;
  }

  function render(data){
    slidesContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    slidesEls = [];
    dotsEls = [];

    data.forEach((it, i) => {
      const s = createSlide(it, i);
      slidesContainer.appendChild(s);
      slidesEls.push(s);

      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Ir a slide ${i+1}`);
      dot.addEventListener('click', () => { show(i); restartAutoplay(); });
      dotsContainer.appendChild(dot);
      dotsEls.push(dot);
    });
  }

  function show(i){
    if (!slidesEls.length) return;
    slidesEls[current].classList.remove('active');
    dotsEls[current].classList.remove('active');
    current = ((i % slidesEls.length) + slidesEls.length) % slidesEls.length;
    slidesEls[current].classList.add('active');
    dotsEls[current].classList.add('active');
  }

  function next(){ show(current + 1); }
  function start(){
    if (!AUTOPLAY || PREFERS_REDUCED) return;
    stop();
    timer = setInterval(next, INTERVAL);
  }
  function stop(){ if (timer) { clearInterval(timer); timer = null; } }
  function restartAutoplay(){ stop(); setTimeout(()=> start(), 1200); }

  function addInteractions(){
    sliderRoot.addEventListener('mouseenter', stop);
    sliderRoot.addEventListener('mouseleave', start);
    sliderRoot.addEventListener('focusin', stop);
    sliderRoot.addEventListener('focusout', start);
    sliderRoot.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); restartAutoplay(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); restartAutoplay(); }
    });
  }

  async function init(){
    slidesData = await loadJSON();
    render(slidesData);
    addInteractions();

    // start autoplay only when visible
    if ('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) start();
          else stop();
        });
      }, { threshold: 0.35 });
      io.observe(sliderRoot);
    } else {
      start();
    }
  }

  init();
})();
