// team.js — WhatsApp en managers, tooltips, copiar teléfono, skeletons, empty state y autodetección de API
(function(){
  // === Detección de endpoint ===
  async function fetchTeam(){
    const sameOrigin = '/api/team';
    const local = 'http://localhost:4000/api/team';
    // Intento 1: mismo dominio (producción con proxy)
    try{
      const r1 = await fetch(sameOrigin, { cache: 'no-store' });
      if (r1.ok) return r1.json();
      throw new Error('Same-origin failed');
    }catch(_){}
    // Intento 2: localhost (dev)
    try{
      const r2 = await fetch(local, { cache: 'no-store' });
      if (r2.ok) return r2.json();
      throw new Error('Localhost failed');
    }catch(_){}
    // Intento 3: fallback embed
    return FALLBACK;
  }

  // === Fallback por si no hay backend ===
  const FALLBACK = [
    {"name":"Federico Mordeglia","role":"Director de Estrategias","title":"Director de Estrategias y Project Manager","bio":"Fundador de To The Moon, Federico combina su experiencia como Project Manager en Google con su formación en derecho y management para guiar el crecimiento integral de cada artista. Diseña estrategias personalizadas que unen desarrollo profesional, bienestar y propósito, asegurando una carrera sustentable, genuina y con identidad propia.","links":{"tel":"+5491112345678"}},
    {"name":"Felix Peralta","role":"Manager Personal","title":"Manager Personal y Tour Manager","bio":"Como socio director, Félix acompaña a los artistas en cada paso de su recorrido, tanto en lo humano como en lo operativo. Con formación en liderazgo estratégico, coordina giras, fechas y planificación logística, garantizando que cada experiencia esté organizada con detalle, calidez y visión a largo plazo.","links":{"tel":"+5491122233344"}},
    {"name":"Miranda Peterson","role":"Nutricionista","title":"Nutricionista","bio":"Miranda cuida la energía y el bienestar físico de los artistas. A través de planes personalizados, enseña a nutrirse con consciencia para sostener la vitalidad y el equilibrio que exige la vida artística, conectando cuerpo, mente y creatividad.","links":{"ig":"https://instagram.com/usuario.miranda","email":"miranda@tothemoon.example"}},
    {"name":"Catalina Culell","role":"Fotógrafa & Community","title":"Fotógrafa y Community Manager","bio":"Catalina transforma la esencia de cada artista en imagen y comunicación. Su mirada artística y estratégica conecta lo visual con lo emocional, plasmando la identidad de To The Moon con coherencia, estética y autenticidad en cada contenido.","links":{"ig":"https://instagram.com/usuario.catalina","email":"catalina@tothemoon.example"}}
  ];

  const grid   = document.getElementById('teamGrid');
  const form   = document.getElementById('teamFilters');
  const qInput = document.getElementById('tq');
  const roleSel= document.getElementById('trole');
  const toast  = document.getElementById('toast');

  let TEAM = [];

  // === SVGs ===
  const ICONS = {
    ig:   `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" fill="currentColor"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v.5l-10 6-10-6V6zm0 3.2V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.2l-9.4 5.6a2 2 0 0 1-2.2 0L2 9.2z" fill="currentColor"/></svg>`,
    tel:  `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.6 11.6 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.6 11.6 0 0 0 .6 3.6 1 1 0 0 1-.25 1l-2.25 2.2z" fill="currentColor"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V9zm-4 8V7a3 3 0 0 1 3-3h7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    wa:   `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.2-1.5A10 10 0 1 0 12.04 2zm5.8 14.1c-.2.6-1.1 1-1.6 1.1-.4.1-.9.1-1.5-.1-.3-.1-.7-.2-1.2-.5-2.1-1.1-3.5-3-3.6-3.1-.1-.2-.9-1.2-.9-2.3 0-1.1.5-1.7.7-2 .3-.3.6-.5.8-.5h.6c.2 0 .4 0 .5.4.2.6.5 1.4.6 1.5.1.1.1.3 0 .5-.1.2-.2.4-.4.6-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.7 0 .2-.1 1-.5 1.1-.7.1-.2.2-.3.4-.2.2.1 1.3.6 1.5.7.2.1.3.2.4.3.1.1.1.6-.1 1.2z" fill="currentColor"/></svg>`
  };

  // === Utils ===
  function sanitizeTel(t){ return String(t || '').replace(/[^\d+]/g,''); }
  function formatTel(t){
    const s = sanitizeTel(t);
    if (s.startsWith('+')) return s.replace(/(\+\d{2})(\d{3})(\d{3,})/,'$1 $2 $3');
    return s.replace(/(\d{2,4})(\d{3})(\d{3,})/,'+$1 $2 $3');
  }
  function showToast(msg){
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(()=> { toast.hidden = true; }, 1600);
  }
  function badge(role){
    const map = {
      "Director de Estrategias":"badge-dir",
      "Manager Personal":"badge-mgr",
      "Nutricionista":"badge-nutri",
      "Fotógrafa & Community":"badge-photo"
    };
    const cls = map[role] || "badge";
    return `<span class="badge ${cls}">${role}</span>`;
  }
  function iconBtn({type, href, label, tip}){
    if (!href) return '';
    let url = href, target = '', rel = '';
    let cls = type;
    if (type === 'mail') { url = `mailto:${href}`; }
    if (type === 'tel')  { url = `tel:${sanitizeTel(href)}`; }
    if (type === 'wa')   { url = `https://wa.me/${sanitizeTel(href)}?text=${encodeURIComponent('Hola, me gustaría coordinar una reunión. Gracias!')}`; target = '_blank'; rel = 'noopener noreferrer'; }
    if (type === 'ig')   { target = '_blank'; rel = 'noopener noreferrer'; }
    return `<a class="icon-btn ${cls}" href="${url}" ${target ? `target="${target}"` : ''} ${rel ? `rel="${rel}"` : ''} aria-label="${label}" data-tip="${tip || label}">${ICONS[type]}<span class="sr-only">${label}</span></a>`;
  }
  function copyBtn(tel, name){
    if (!tel) return '';
    return `<button type="button" class="icon-btn copy" data-copytel="${sanitizeTel(tel)}" data-tip="Copiar teléfono" aria-label="Copiar teléfono de ${name}">${ICONS.copy}<span class="sr-only">Copiar teléfono de ${name}</span></button>`;
  }

  // === Skeletons mientras carga ===
  function renderSkeleton(count=4){
    if (!grid) return;
    grid.innerHTML = Array.from({length:count}).map(()=>`
      <article class="card skel-card">
        <div class="skel skel-media"></div>
        <div class="card-body">
          <div class="skel skel-line w60"></div>
          <div class="skel skel-line w40"></div>
          <div class="skel skel-line w80"></div>
        </div>
      </article>
    `).join('');
  }

  function renderEmpty(){
    grid.innerHTML = `<div class="empty">No encontramos miembros con ese criterio.</div>`;
  }

  function render(list){
    if (!grid) return;
    if (!list.length){ renderEmpty(); return; }

    grid.innerHTML = list.map(m => {
      const tel   = m.links?.tel;
      const ig    = m.links?.ig;
      const email = m.links?.email;

      // Reglas: managers => tel + WhatsApp + copiar; otros roles => ig/email si existen
      const isManager = (m.role || '').toLowerCase().includes('manager');

      const igBtn   = ig    ? iconBtn({type:'ig',   href:ig,    label:`Instagram de ${m.name}`, tip:'Instagram'}) : '';
      const mailBtn = email ? iconBtn({type:'mail', href:email, label:`Email de ${m.name}`,     tip:'Email'})     : '';

      let phoneStack = '';
      if (tel){
        const telBtn  = iconBtn({type:'tel', href:tel, label:`Llamar a ${m.name}`, tip:'Llamar'});
        const waBtn   = iconBtn({type:'wa',  href:tel, label:`WhatsApp a ${m.name}`, tip:'WhatsApp'});
        const cpBtn   = copyBtn(tel, m.name);
        const phoneLabel = `<span class="phone-label">${formatTel(tel)}</span>`;
        phoneStack = `${telBtn}${waBtn}${cpBtn}${phoneLabel}`;
      }

      const iconRow = isManager ? `${phoneStack}${igBtn}${mailBtn}` : `${igBtn}${mailBtn}${phoneStack}`;

      return `
        <article class="card">
          <div class="card-media ph ph2" aria-hidden="true"></div>
          <div class="card-body">
            <h3 class="h3">${m.name}</h3>
            <p class="small muted">${badge(m.role)} <span class="sep">•</span> ${m.title}</p>
            <p class="small">${m.bio}</p>
            <div class="icon-row">${iconRow}</div>
          </div>
        </article>
      `;
    }).join('');

    // Eventos copiar teléfono
    grid.querySelectorAll('[data-copytel]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const tel = btn.getAttribute('data-copytel');
        try{
          await navigator.clipboard.writeText(tel);
          showToast('Teléfono copiado');
        }catch{
          showToast('No se pudo copiar');
        }
      });
    });
  }

  function applyFilters(){
    const q = (qInput?.value || '').toLowerCase();
    const r = (roleSel?.value || '');
    const filtered = TEAM.filter(m =>
      (!q || m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || (m.title||'').toLowerCase().includes(q))
      && (!r || m.role === r)
    );
    render(filtered);
  }

  async function load(){
    renderSkeleton();
    try{
      TEAM = await fetchTeam();
      // Orden sugerido: Director/Managers primero, luego resto alfabético
      const priority = (role) => (/director|manager/i.test(role||'')) ? 0 : 1;
      TEAM.sort((a,b)=> priority(a.role)-priority(b.role) || a.name.localeCompare(b.name));
    }catch{
      TEAM = FALLBACK;
    }
    render(TEAM);
  }

  ['input','change','keyup'].forEach(ev => form?.addEventListener(ev, applyFilters));
  load();
})();
