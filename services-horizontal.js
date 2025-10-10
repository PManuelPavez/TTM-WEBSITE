// services-horizontal.js - horizontal layout + icons + TOC + reveal + back-to-top
(function(){
  const services = [
    { id:'s1', title: "Manager personal", text: "En TTM el artista cuenta con un acompañamiento cercano y constante. El manager personal se convierte en una herramienta integral que organiza, planifica y gestiona todas las áreas que componen al artista, tanto la humana como la de marca. El objetivo principal es que el artista pueda enfocarse plenamente en su arte y que mientras se entrega a esa pasión, se construya como individuo." },
    { id:'s2', title: "Estrategia de carrera y marca", text: "Trabajamos en la construcción de una identidad sólida y diferenciada, desarrollando un plan estratégico individualizado, hecho a medida del artista, que potencie la marca y trace un camino claro de crecimiento, con objetivos medibles y acciones concretas que generen impacto a largo plazo dentro de la industria." },
    { id:'s3', title: "Agenda interactiva", text: "Diseñamos y compartimos una agenda personalizada y digital en la que manager y artista trabajan en conjunto. Allí se definen objetivos SMART, se dividen en hitos y tareas, y se siguen con metodologías ágiles (Scrum, Sprints), asegurando organización, claridad y avances constantes." },
    { id:'s4', title: "Entrenamiento / Studio", text: "Contamos con un estudio de producción musical y una sala de entrenamiento de mezcla en nuestra oficina en Ciudad Autónoma de Buenos Aires. Este espacio está pensado para que los artistas puedan desarrollar su sonido, perfeccionar su técnica y crear sinergia entre ellos, compartiendo conocimientos e inspiración." },
    { id:'s5', title: "Desarrollo personal", text: "Sabemos que el éxito real comienza con la persona. Por eso brindamos herramientas de apoyo en salud mental, nutrición, entrenamiento físico y hábitos sostenibles, asegurando que el artista crezca en equilibrio y mantenga un rendimiento alto sin comprometer su bienestar." },
    { id:'s6', title: "Desarrollo de productos audiovisuales", text: "Contamos con un equipo de fotógrafos, filmmakers y community managers que generan contenido profesional y creativo. De esta manera, el artista puede comunicar su identidad con material propio, de calidad y alineado a su visión." },
    { id:'s7', title: "Press & media", text: "Gestionamos la relación con la prensa, medios y plataformas, elaborando estrategias de comunicación que amplifiquen el alcance del artista y aseguren una exposición coherente y positiva de la marca." },
    { id:'s8', title: "Logística y viajes", text: "Organizamos y coordinamos traslados, itinerarios y necesidades logísticas en cada fecha o gira. El objetivo es que el artista tenga una experiencia fluida y segura, pudiendo concentrarse en su performance sin preocuparse por los detalles operativos." },
    { id:'s9', title: "Booking, legal & negotiation", text: "Asesoramos y gestionamos negociaciones de contratos, bookings y acuerdos comerciales. Garantizamos transparencia, respaldo legal y condiciones justas que protejan al artista y fortalezcan su desarrollo profesional." },
    { id:'s10', title: "Espiritualidad", text: "En TTM entendemos que la carrera artística también es un camino personal profundo. Por eso ofrecemos acompañamiento espiritual y prácticas de conciencia que ayudan al artista a mantenerse en paz, conectado con su propósito y con claridad frente a los desafíos de la industria." }
  ];

  const container = document.getElementById("servicesList");
  if (!container) return;

  // --- Small helper icons (inline SVG minimal) ---
  const ICONS = [
    `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" fill="currentColor"/></svg>`,
    `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2l3 6 6 .5-4.5 3L18 19l-6-3-6 3 1.5-7.5L3 8.5 9 8 12 2z" fill="currentColor"/></svg>`,
    `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" fill="currentColor"/></svg>`,
    `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 4h16v4H4zM4 10h16v10H4z" fill="currentColor"/></svg>`,
    `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2a10 10 0 0 0-2 19.8v-3.1a7 7 0 1 1 2 0v3.1A10 10 0 0 0 12 2z" fill="currentColor"/></svg>`,
    `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 3h18v18H3z" fill="currentColor"/></svg>`,
    `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2a10 10 0 0 1 10 10H12z" fill="currentColor"/></svg>`,
    `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 4h16v2H4zM4 8h16v2H4zM4 12h16v8H4z" fill="currentColor"/></svg>`,
    `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 6h16v2H4zm0 4h10v2H4zm0 4h7v6H4z" fill="currentColor"/></svg>`,
    `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2l4 10h-8zM6 14h12v8H6z" fill="currentColor"/></svg>`
  ];

  // Build TOC + content wrapper
  container.innerHTML = `
    <div class="services-wrapper">
      <div class="services-horizontal" id="svcList"></div>
      <aside class="services-toc" aria-label="Índice de servicios">
        <h4>Servicios</h4>
        <ul id="svcToc"></ul>
      </aside>
    </div>
    <button id="backTop" class="back-to-top" aria-label="Volver arriba" title="Volver arriba" type="button" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 4l-8 8h5v8h6v-8h5z" fill="currentColor"/></svg>
    </button>
  `;

  const listEl = document.getElementById('svcList');
  const tocEl  = document.getElementById('svcToc');
  const backTop = document.getElementById('backTop');

  // Render services blocks + TOC entries
  listEl.innerHTML = services.map((s, i) => {
    const num = String(i+1).padStart(2,'0');
    const icon = ICONS[i % ICONS.length] || ICONS[0];
    return `
      <section id="${s.id}" class="service-block is-hidden" tabindex="-1" aria-labelledby="${s.id}-title" data-index="${i}">
        <div class="service-number" aria-hidden="true">
          <div class="service-icon" aria-hidden="true">${icon}</div>
          <div class="service-num-text">${num}</div>
        </div>
        <div class="service-content">
          <a class="service-anchor" href="#${s.id}" id="${s.id}-anchor">Anchor</a>
          <h3 id="${s.id}-title" class="service-title">${s.title}
            <a class="service-permalink" href="#${s.id}" aria-hidden="true">#</a>
          </h3>
          <p class="service-text">${s.text}</p>
        </div>
      </section>
    `;
  }).join('');

  // Build TOC
  tocEl.innerHTML = services.map((s, i) => {
    const num = String(i+1).padStart(2,'0');
    return `<li><a href="#${s.id}" data-target="${s.id}">${num} — ${s.title}</a></li>`;
  }).join('');

  // Smooth scroll with offset for sticky header (reuse existing function if present)
  function getHeaderOffset(){
    const brand = document.querySelector('.brandbar');
    const tabs  = document.querySelector('.tabsbar');
    const margin = 12;
    const h = (brand?.clientHeight || 0) + (tabs?.clientHeight || 0) + margin;
    return h;
  }
  function smoothScrollToId(id){
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  // Intercept TOC clicks for smooth scroll
  tocEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const id = a.getAttribute('data-target');
      smoothScrollToId(id);
      // focus the section for screen readers
      setTimeout(()=> document.getElementById(id)?.focus(), 400);
    });
  });

  // Reveal when in viewport (respect reduced motion)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const items = Array.from(listEl.querySelectorAll('.service-block'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.remove('is-hidden');
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    items.forEach((it, idx) => {
      // stagger slight delay via inline style for nicer effect
      it.style.transitionDelay = `${Math.min(0.16 * idx, 0.8)}s`;
      io.observe(it);
    });
  } else {
    // fallback: reveal immediately
    listEl.querySelectorAll('.service-block').forEach(it => { it.classList.remove('is-hidden'); it.classList.add('is-visible'); });
  }

  // Highlight TOC based on scroll (which section is most visible)
  if ('IntersectionObserver' in window) {
    const sections = Array.from(listEl.querySelectorAll('.service-block'));
    const tocLinks = Array.from(tocEl.querySelectorAll('a'));
    const io2 = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio)[0];
      tocLinks.forEach(l => l.removeAttribute('aria-current'));
      if (visible) {
        const id = visible.target.id;
        const tocLink = tocEl.querySelector(`a[data-target="${id}"]`);
        if (tocLink) tocLink.setAttribute('aria-current','true');
      }
    }, { root: null, rootMargin: `-${getHeaderOffset()}px 0px -40% 0px`, threshold: [0.2, 0.4, 0.6] });
    sections.forEach(s => io2.observe(s));
    // recalc on resize
    window.addEventListener('resize', () => io2.rootMargin = `-${getHeaderOffset()}px 0px -40% 0px`);
  }

  // Back to top behavior
  function toggleBackTop(){
    if (window.scrollY > 400) backTop.classList.add('show'), backTop.setAttribute('aria-hidden','false');
    else backTop.classList.remove('show'), backTop.setAttribute('aria-hidden','true');
  }
  backTop.addEventListener('click', ()=> {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    backTop.blur();
  });
  window.addEventListener('scroll', toggleBackTop);
  toggleBackTop(); // init
})();
