// artists.js — genera la lista horizontal de artistas
(function(){
  const data = [
    {
      id: "a1",
      name: "Luna Soler",
      role: "Cantautora / Productora",
      photo: "assets/artists/luna_soler.jpg",
      bio: "Luna crea canciones con un pulso íntimo y potente; su trabajo combina electrónica y folk en paisajes sonoros emotivos.",
      links: { ig: "https://instagram.com/luna", mail: "luna@tothemoon.example" }
    },
    {
      id: "a2",
      name: "Marco Vega",
      role: "DJ / Productor",
      photo: "assets/artists/marco_vega.jpg",
      bio: "DJ y curador de sets nocturnos con una sensibilidad sonora que mezcla house, techno y grooves latinos.",
      links: { ig: "https://instagram.com/marcovega", mail: "booking@marco.example", tel:"+5491144455566" }
    },
    {
      id: "a3",
      name: "Sofía Rojas",
      role: "Multi-instrumentista",
      photo: "assets/artists/sofia_rojas.jpg",
      bio: "Sofía aporta arreglos orquestales y texturas acústicas; su enfoque conecta lo clásico con lo contemporáneo.",
      links: { ig: "https://instagram.com/sofiarojas", mail: "sofia@tothemoon.example" }
    }
  ];

  const strip = document.getElementById('artistsStrip');
  if (!strip) return;

  function createIconBtn(type, href, label){
    if (!href) return '';
    const svg = {
      ig: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" fill="currentColor"/></svg>',
      mail: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v.5l-10 6-10-6V6zM2 9.2V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.2l-9.4 5.6a2 2 0 0 1-2.2 0L2 9.2z" fill="currentColor"/></svg>',
      tel: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.6 11.6 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.6 11.6 0 0 0 .6 3.6 1 1 0 0 1-.25 1l-2.25 2.2z" fill="currentColor"/></svg>'
    }[type] || '';
    const a = document.createElement(type === 'mail' ? 'a' : 'a');
    a.className = 'icon-btn';
    a.href = (type === 'mail') ? `mailto:${href}` : (type === 'tel' ? `tel:${href}` : href);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = label;
    a.innerHTML = svg;
    return a;
  }

  // render cards
  strip.innerHTML = '';
  data.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'artist-card';
    card.tabIndex = 0;
    card.setAttribute('role','listitem');
    card.innerHTML = `
      <div class="artist-photo" style="background-image:url('${p.photo}')" role="img" aria-label="${p.name}"></div>
      <div class="artist-body">
        <h3 class="artist-name">${p.name}</h3>
        <p class="artist-role">${p.role}</p>
        <p class="artist-bio">${p.bio}</p>
        <div class="artist-actions"></div>
      </div>
    `;
    // append action icons
    const actions = card.querySelector('.artist-actions');
    if (p.links?.ig) actions.appendChild(createIconBtn('ig', p.links.ig, `Instagram de ${p.name}`));
    if (p.links?.mail) actions.appendChild(createIconBtn('mail', p.links.mail, `Email a ${p.name}`));
    if (p.links?.tel)  actions.appendChild(createIconBtn('tel', p.links.tel, `Llamar a ${p.name}`));

    strip.appendChild(card);
  });

  // keyboard: left/right to navigate through cards when focus is on strip
  strip.addEventListener('keydown', (e) => {
    const focused = document.activeElement;
    if (!focused || !strip.contains(focused)) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = focused.nextElementSibling || strip.firstElementChild;
      next?.focus();
      next?.scrollIntoView({behavior:'smooth', inline:'center'});
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = focused.previousElementSibling || strip.lastElementChild;
      prev?.focus();
      prev?.scrollIntoView({behavior:'smooth', inline:'center'});
    }
  });

  // optional: auto-center first card on load
  window.addEventListener('load', () => {
    const first = strip.querySelector('.artist-card');
    first?.scrollIntoView({behavior:'smooth', inline:'center'});
    // set year
    const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  });
})();
