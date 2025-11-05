/*
 * artists.js
 * Controlador para la página de Artistas de To The Moon.
 * Maneja la renderización del grid de artistas, el modal de detalle y el formulario de contacto.
 */

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Datos de los artistas. Cada artista debe tener un id, nombre, foto, biografía
   * y un objeto links con urls a sus redes (pueden quedar vacías si no hay).  
   */
  const ARTISTS = [
    {
      id: 'servando',
      name: 'Servando',
      photo: 'assets/artists/servando.jpg',
      bio: 'Servando es un DJ y productor argentino en ascenso dentro de la escena global de la música electrónica. Su enfoque sofisticado y versátil le permite moverse entre los géneros, logrando un sonido único y adaptable a cualquier pista. Ha compartido cabina con artistas como Ezequiel Arias, Budakid, Emi Galván, John Cosani y más. Sus producciones son editadas por sellos como Mango Alley, Sound Avenue y SLC-6.',
      links: {
        ig: 'https://www.instagram.com/servandomusic',
        sc: 'https://soundcloud.com/servando_music',
        yt: 'https://www.youtube.com/@servandomusic',
        presskit: 'https://servando.dj-presskit.com/'
      }
    },
    {
      id: 'luciano',
      name: 'Luciano Bedini',
      photo: 'assets/artists/luciano.jpg',
      bio: 'Luciano Bedini es DJ y productor de música electrónica, nacido en Pergamino, Provincia de Buenos Aires. Su identidad artística se define por la fusión entre el progressive house, el dub techno y el deep house. Ha editado en sellos como Sound Avenue y Sincity.',
      links: {
        ig: 'https://www.instagram.com/luciaanobedini',
        sc: 'https://soundcloud.com/luciano-bedini',
        yt: '',
        presskit: 'https://lucianobedini.dj-presskit.com/'
      }
    },
    {
      id: 'manu',
      name: 'Manu Pavez',
      photo: 'assets/artists/manu.jpg',
      bio: 'Manu Pavez es un DJ y productor argentino con una visión moderna y versátil del progressive house. Su sonido se distingue por la conexión emocional con el público.',
      links: {
        ig: 'https://www.instagram.com/manupavez_',
        sc: 'https://soundcloud.com/manupavez',
        yt: 'https://www.youtube.com/@manupavez',
        presskit: ''
      }
    },
    {
      id: 'fideksen',
      name: 'Fideksen',
      photo: 'assets/artists/fideksen.jpg',
      bio: 'Fideksen es un DJ y productor argentino con un sonido que combina elegancia, groove y una fuerte identidad melódica.',
      links: {
        ig: 'https://www.instagram.com/fideksen',
        sc: 'https://soundcloud.com/fideksensound',
        yt: '',
        presskit: ''
      }
    },
    {
      id: 'kentavros',
      name: 'Kentavros',
      photo: 'assets/artists/kentavros.jpg',
      bio: 'Sebastián Mansilla aka Kentavros es un DJ argentino cuya propuesta mezcla progressive, melodic y deep house.',
      links: {
        ig: 'https://www.instagram.com/kentavros_music',
        sc: 'https://soundcloud.com/kentavros_music',
        yt: '',
        presskit: ''
      }
    },
    {
      id: 'p37ro',
      name: 'P37RO',
      photo: 'assets/artists/p37ro.jpg',
      bio: 'p37ro es un DJ y productor argentino con una propuesta marcada por calidez, detalle y texturas progresivas.',
      links: {
        ig: 'https://www.instagram.com/p37r0.fragueiro',
        sc: 'https://soundcloud.com/user-560556342',
        yt: '',
        presskit: ''
      }
    }
  ];

  /**
   * Helpers de escape de HTML para prevenir XSS al insertar strings en el DOM.
   */
  function escapeHtml(str = '') {
    return String(str).replace(/[&<>"]|'/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  /**
   * Referencias a elementos del DOM.
   */
  const grid = document.getElementById('artistsGrid');
  const artistModal = document.getElementById('artistModal');
  const artistModalContent = document.getElementById('artistModalContent');
  // Contact modal elements
  const contactModal = document.getElementById('contactModal');
  const contactForm = document.getElementById('contactForm');
  const cfName = document.getElementById('cf_name');
  const cfEmail = document.getElementById('cf_email'); // puede no existir en este modal
  const cfSubject = document.getElementById('cf_subject');
  const cfMessage = document.getElementById('cf_message');
  const cfArtist = document.getElementById('cf_artist');
  const artistSelectContainer = document.getElementById('artistSelectContainer');
  const openContactBtn = document.getElementById('openContact');
  const openFormBtn = document.getElementById('openForm');
  const closeFormBtn = document.getElementById('closeForm');
  const modalOverlay = document.querySelector('.modal-overlay');
  const toast = document.getElementById('toast');
  // Nav toggle for burger menu
  const navToggle = document.querySelector('.nav-toggle');
  const navTabs = document.querySelector('.nav-tabs');

  if (!grid) return;

  /**
   * Renderizamos las tarjetas de artistas en el grid.  
   * Cada card contiene la imagen en un contenedor, con overlay para el nombre.
   */
  grid.innerHTML = '';
  ARTISTS.forEach(artist => {
    const card = document.createElement('article');
    card.className = 'artist-card';
    card.dataset.artist = artist.id;
    card.innerHTML = `
      <div class="image-container">
        <img src="${artist.photo}" alt="${escapeHtml(artist.name)}" loading="lazy" width="640" height="320">
        <div class="overlay"><span class="artist-name">${escapeHtml(artist.name)}</span></div>
      </div>
    `;
    grid.appendChild(card);
  });

  /**
   * Abre el modal de artista con la información completa.
   * Inyecta foto más pequeña, degradé inferior y muestra enlaces a redes junto al nombre.
   */
  function openArtistModal(artistObj) {
    // Construimos una lista de enlaces a redes (si existen)
    const linksHtml = [];
    if (artistObj.links.ig) linksHtml.push(`<a class="artist-link" href="${artistObj.links.ig}" target="_blank" rel="noopener">Instagram</a>`);
    if (artistObj.links.sc) linksHtml.push(`<a class="artist-link" href="${artistObj.links.sc}" target="_blank" rel="noopener">SoundCloud</a>`);
    if (artistObj.links.yt) linksHtml.push(`<a class="artist-link" href="${artistObj.links.yt}" target="_blank" rel="noopener">YouTube</a>`);
    if (artistObj.links.presskit) linksHtml.push(`<a class="artist-link" href="${artistObj.links.presskit}" target="_blank" rel="noopener">Presskit</a>`);

    // Inyectamos el contenido del modal
    artistModalContent.innerHTML = `
      <div class="modal-top">
        <img class="modal-photo" src="${artistObj.photo}" alt="${escapeHtml(artistObj.name)}" loading="lazy" width="900" height="500">
      </div>
      <div class="modal-body">
        <div class="modal-header">
          <h2 id="artistTitle">${escapeHtml(artistObj.name)}</h2>
          <div class="modal-links">${linksHtml.join(' ')}</div>
        </div>
        <h4>BIOGRAFÍA</h4>
        <p class="bio-text">${escapeHtml(artistObj.bio)}</p>
        <div class="modal-actions">
          <button class="btn-primary book-now" data-artist="${escapeHtml(artistObj.name)}">BOOK!</button>
        </div>
      </div>
    `;

    // Mostrar el modal y bloquear el scroll del body
    artistModal.classList.add('opened');
    artistModal.removeAttribute('hidden');
    artistModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    // Fijamos el foco para accesibilidad
    artistModalContent.querySelector('h2')?.focus();
  }

  /**
   * Cierra el modal de artista.
   */
  function closeArtistModal() {
    artistModal.classList.remove('opened');
    artistModal.setAttribute('hidden', '');
    artistModal.setAttribute('aria-hidden', 'true');
    artistModalContent.innerHTML = '';
    document.body.classList.remove('modal-open');
  }

  /**
   * Toggle del menú hamburguesa. Cambia el estado aria-expanded y la clase 'open' de las tabs.
   */
  if (navToggle && navTabs) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navTabs.classList.toggle('open', !expanded);
    });
    // Cerrar al hacer click fuera en mobile
    document.addEventListener('click', (ev) => {
      if (!navTabs.classList.contains('open')) return;
      if (navToggle.contains(ev.target) || navTabs.contains(ev.target)) return;
      navToggle.setAttribute('aria-expanded', 'false');
      navTabs.classList.remove('open');
    });
    // Cerrar con Esc
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && navTabs.classList.contains('open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navTabs.classList.remove('open');
      }
    });
  }

  /**
   * Toggle para mostrar u ocultar el modal de contacto con animación.
   */
  function toggleContactModal(show) {
    if (!contactModal) return;
    if (show) {
      contactModal.hidden = false;
      // Pequeño retraso para permitir que se aplique la clase show (transición)
      setTimeout(() => contactModal.classList.add('show'), 10);
    } else {
      contactModal.classList.remove('show');
      setTimeout(() => { contactModal.hidden = true; }, 300);
    }
  }

  /**
   * Prepara y abre el contacto con prefill opcional.
   */
  function openContactModal(prefill = {}) {
    // Prefill name
    if (cfName && prefill.name) cfName.value = prefill.name;
    if (cfSubject && prefill.subject) cfSubject.value = prefill.subject;
    // Preselect artist if booking
    if (prefill.subject === 'Booking' && cfArtist) {
      artistSelectContainer.hidden = false;
      // Intentar seleccionar artista si coincide
      const opts = Array.from(cfArtist.options);
      const opt = opts.find(o => o.value.toLowerCase() === (prefill.name||'').toLowerCase());
      if (opt) cfArtist.value = opt.value;
    } else if (artistSelectContainer) {
      artistSelectContainer.hidden = true;
      if (cfArtist) cfArtist.value = '';
    }
    // Prefill message si se pasa
    if (prefill.message && cfMessage) {
      cfMessage.value = prefill.message;
    } else if (cfMessage) {
      cfMessage.value = '';
    }
    toggleContactModal(true);
    // Enfocar el campo nombre
    setTimeout(() => cfName?.focus(), 100);
    // Actualizar mensaje dinámico
    updateMessage();
  }

  /**
   * Cierra el modal de contacto.
   */
  function closeContactModal() {
    toggleContactModal(false);
  }

  /**
   * Actualiza el mensaje del textarea en función del asunto, artista y nombre.
   */
  function updateMessage() {
    if (!cfSubject || !cfMessage) return;
    const subjectVal = cfSubject.value;
    const nameVal = cfName ? cfName.value.trim() : '';
    const artistVal = cfArtist ? cfArtist.value : '';
    let text = `Hola TTM! Me contacto por: ${subjectVal}`;
    if (subjectVal === 'Booking' && artistVal) {
      text += ` - Artista: ${artistVal}`;
    }
    if (nameVal) {
      text += `\n\nMi nombre es ${nameVal}.`;
    }
    cfMessage.value = text;
  }

  /**
   * Delegación: clic en una tarjeta abre modal de artista.
   */
  grid.addEventListener('click', (ev) => {
    const card = ev.target.closest('.artist-card');
    if (!card) return;
    const artistId = card.dataset.artist;
    const artistObj = ARTISTS.find(a => a.id === artistId);
    if (!artistObj) return;
    openArtistModal(artistObj);
  });

  /**
   * Clic en el botón de Book dentro del modal abre el modal de contacto
   * con campos prellenados. Cierra el modal de artista primero.
   */
  artistModalContent.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.book-now');
    if (!btn) return;
    const artistName = btn.dataset.artist || '';
    closeArtistModal();
    openContactModal({
      name: artistName,
      subject: 'Booking',
      message: `Hola TTM! Me contacto por: Booking - Artista: ${artistName}`
    });
  });

  /**
   * Botones de cierre para los modales.
   * - Botón X en artist modal
   * - Botón X en contact modal
   * - Click en overlay de contact modal
   * - Escape para ambos
   */
  // Cerrar artist modal con su botón de cierre
  const artistCloseBtn = artistModal.querySelector('.modal-close');
  artistCloseBtn?.addEventListener('click', closeArtistModal);

  // Botón de cierre del formulario de contacto
  closeFormBtn?.addEventListener('click', closeContactModal);
  // Click en overlay cierra contact modal
  modalOverlay?.addEventListener('click', closeContactModal);

  // Cerrar modales con Escape
  document.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    if (!artistModal.hasAttribute('hidden')) closeArtistModal();
    if (!contactModal.hidden) closeContactModal();
    // También cerrar nav en mobile
    if (navTabs && navTabs.classList.contains('open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navTabs.classList.remove('open');
    }
  });

  /**
   * Enlaces para abrir modal de contacto desde la navegación y el footer.
   */
  openContactBtn?.addEventListener('click', (ev) => {
    ev.preventDefault();
    openContactModal({ subject: 'General Inquiry' });
  });
  openFormBtn?.addEventListener('click', (ev) => {
    ev.preventDefault();
    openContactModal({ subject: 'General Inquiry' });
  });

  /**
   * Actualización dinámica del mensaje según inputs del formulario.
   */
  cfSubject?.addEventListener('change', () => {
    // Mostrar el select de artista sólo para Booking
    if (cfSubject.value === 'Booking') {
      artistSelectContainer.hidden = false;
    } else {
      artistSelectContainer.hidden = true;
      if (cfArtist) cfArtist.value = '';
    }
    updateMessage();
  });
  cfArtist?.addEventListener('change', updateMessage);
  cfName?.addEventListener('input', updateMessage);

  /**
   * Submit del formulario de contacto. Envía los datos (si hay endpoint)
   * y cierra el modal después de un breve delay con un toast.
   */
  contactForm?.addEventListener('submit', (ev) => {
    // Si hay endpoint real, no cancelar el submit. Para test local, se puede usar ev.preventDefault().
    setTimeout(() => {
      closeContactModal();
      // Mostrar toast
      if (toast) {
        toast.hidden = false;
        setTimeout(() => { toast.hidden = true; }, 3500);
      } else {
        alert('Gracias — tu mensaje fue enviado.');
      }
    }, 300);
  });
});
