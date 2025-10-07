(function(){
  document.body.classList.remove('no-js');

  // Año
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Toggle mobile
  const navToggle = document.getElementById('navToggle');
  const navTabs   = document.getElementById('navTabs');
  if (navToggle && navTabs){
    navToggle.addEventListener('click', () => {
      const open = navTabs.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('[data-link]').forEach(a => {
      a.addEventListener('click', (ev) => {
        const href = a.getAttribute('href') || '';
        if (href.startsWith('#')) {
          ev.preventDefault();
          const id = href.slice(1);
          const el = document.getElementById(id);
          if (el) smoothScrollTo(el);
        }
        if (navTabs.classList.contains('open')) {
          navTabs.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Offset dinámico de header
  function getScrollOffsetPx(){
    const brand = document.querySelector('.brandbar');
    const tabs  = document.querySelector('.tabsbar');
    const margin = 12;
    const h = (brand?.clientHeight || 0) + (tabs?.clientHeight || 0) + margin;
    document.documentElement.style.setProperty('--scroll-offset', `${h}px`);
    return h;
  }
  function smoothScrollTo(targetEl){
    const y = targetEl.getBoundingClientRect().top + window.scrollY - getScrollOffsetPx();
    window.scrollTo({ top: y, behavior: 'smooth' });
    setActiveById(targetEl.id);
    history.replaceState(null, '', `#${targetEl.id}`);
  }

  // Tab activa por hash/scroll
  const links = Array.from(document.querySelectorAll('#navTabs a'));
  function setActiveById(id){
    links.forEach(a => a.removeAttribute('aria-current'));
    const match = links.find(a => (a.getAttribute('href') || '').slice(1) === id);
    if (match) match.setAttribute('aria-current', 'page');
  }
  if (location.hash) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) setTimeout(()=> smoothScrollTo(el), 0);
  }
  const sections = Array.from(document.querySelectorAll('[data-section]'));
  const io = new IntersectionObserver((entries) => {
    const vis = entries.filter(e => e.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio)[0];
    if (vis) setActiveById(vis.target.id);
  }, { rootMargin: `-${getScrollOffsetPx()}px 0px 0px 0px`, threshold: [0.25, 0.5, 0.75, 1] });
  sections.forEach(s => io.observe(s));
  window.addEventListener('resize', () => getScrollOffsetPx());

  // Slider
  const slider = document.querySelector('.slider');
  if (!slider) return;
  const slidesEl = slider.querySelector('.slides');
  const slides = Array.from(slidesEl.querySelectorAll('.slide'));
  const dots = Array.from(slider.querySelectorAll('[data-dot]'));
  const prev = slider.querySelector('[data-prev]');
  const next = slider.querySelector('[data-next]');
  let i = 0, timer = null;
  const autoplay = slider.getAttribute('data-autoplay') === 'true';
  const interval = Number(slider.getAttribute('data-interval') || 5000);
  function goTo(n){ i = (n + slides.length) % slides.length; slidesEl.scrollTo({ left: slidesEl.clientWidth * i, behavior: 'smooth' }); dots.forEach((d, idx) => d.setAttribute('aria-selected', String(idx === i))); }
  function play(){ if (!autoplay) return; stop(); timer = setInterval(()=> goTo(i + 1), interval); }
  function stop(){ if (timer) { clearInterval(timer); timer = null; } }
  prev?.addEventListener('click', ()=>{ goTo(i - 1); play(); });
  next?.addEventListener('click', ()=>{ goTo(i + 1); play(); });
  dots.forEach((d, idx)=> d.addEventListener('click', ()=>{ goTo(idx); play(); }));
  slider.addEventListener('keydown', (e)=>{ if (e.key === 'ArrowLeft'){ e.preventDefault(); goTo(i - 1); play(); } if (e.key === 'ArrowRight'){ e.preventDefault(); goTo(i + 1); play(); } });
  slider.addEventListener('mouseenter', stop); slider.addEventListener('mouseleave', play);
  slider.addEventListener('focusin', stop);   slider.addEventListener('focusout', play);
  getScrollOffsetPx(); goTo(0); play();
})();

// --- Render TEAM desde /api/team ---
(async function renderTeam(){
  const grid = document.getElementById('teamGrid');
  if (!grid) return;
  try {
    const res = await fetch('http://localhost:4000/api/team');
    const team = await res.json();
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(4,1fr)';
    grid.style.gap = '16px';
    grid.innerHTML = team.map(m => `
      <article class="card">
        <div class="card-body">
          <h3 class="h3">${m.name}</h3>
          <p class="small muted">${m.title || m.role}</p>
          <p class="small">${m.bio}</p>
        </div>
      </article>
    `).join('');
  } catch (e) {
    console.error('TEAM error', e);
  }
})();
