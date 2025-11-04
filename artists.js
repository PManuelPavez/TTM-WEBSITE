/* artists.js - To The Moon Management (final, sin duplicados) */
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Datos de artistas ---------- */
  const ARTISTS = [
    {
      id: "servando",
      name: "Servando",
      photo: "assets/artists/servando.jpg",
      bio: `Servando es un DJ y productor argentino en ascenso dentro de la escena global de la música electrónica. Su enfoque sofisticado y versátil le permite moverse entre los géneros, logrando un sonido único y adaptable a cualquier pista. Ha compartido cabina con artistas como Ezequiel Arias, Budakid, Emi Galván, John Cosani y más. Sus producciones son editadas por sellos como Mango Alley, Sound Avenue y SLC-6.`,
      links: { ig: "https://www.instagram.com/servandomusic", sc: "https://soundcloud.com/servando_music", yt: "https://www.youtube.com/@servandomusic", presskit: "https://servando.dj-presskit.com/" }
    },
    {
      id: "luciano",
      name: "Luciano Bedini",
      photo: "assets/artists/luciano.jpg",
      bio: `Luciano Bedini es DJ y productor de música electrónica, nacido en Pergamino, Provincia de Buenos Aires. Su identidad artística se define por la fusión entre el progressive house, el dub techno y el deep house. Ha editado en sellos como Sound Avenue y Sincity.`,
      links: { ig: "https://www.instagram.com/luciaanobedini", sc: "https://soundcloud.com/luciano-bedini", presskit: "https://lucianobedini.dj-presskit.com/" }
    },
    {
      id: "manu",
      name: "Manu Pavez",
      photo: "assets/artists/manu.jpg",
      bio: `Manu Pavez es un DJ y productor argentino con una visión moderna y versátil del progressive house. Su sonido se distingue por la conexión emocional con el público.`,
      links: { ig: "https://www.instagram.com/manupavez_", sc: "https://soundcloud.com/manupavez", yt: "https://www.youtube.com/@manupavez" }
    },
    {
      id: "fideksen",
      name: "Fideksen",
      photo: "assets/artists/fideksen.jpg",
      bio: `Fideksen es un DJ y productor argentino con un sonido que combina elegancia, groove y una fuerte identidad melódica.`,
      links: { ig: "https://www.instagram.com/fideksen", sc: "https://soundcloud.com/fideksensound" }
    },
    {
      id: "kentavros",
      name: "Kentavros",
      photo: "assets/artists/kentavros.jpg",
      bio: `Sebastián Mansilla aka Kentavros es un DJ argentino cuya propuesta mezcla progressive, melodic y deep house.`,
      links: { ig: "https://www.instagram.com/kentavros_music", sc: "https://soundcloud.com/kentavros_music" }
    },
    {
      id: "p37ro",
      name: "P37RO",
      photo: "assets/artists/p37ro.jpg",
      bio: `p37ro es un DJ y productor argentino con una propuesta marcada por calidez, detalle y texturas progresivas.`,
      links: { ig: "https://www.instagram.com/p37r0.fragueiro", sc: "https://soundcloud.com/user-560556342" }
    }
  ];

  /* ---------- Render grid ---------- */
  const grid = document.getElementById("artistsGrid");
  if (!grid) return;

  ARTISTS.forEach(a => {
    const card = document.createElement("article");
    card.className = "artist-card";
    card.dataset.artist = a.id;
    card.innerHTML = `
      <img src="${a.photo}" alt="${escapeHtml(a.name)}" loading="lazy">
      <h3>${escapeHtml(a.name)}</h3>
    `;
    grid.appendChild(card);
  });

  /* ---------- Modal references ---------- */
  const artistModal = document.getElementById("artistModal");
  const artistModalContent = document.getElementById("artistModalContent");
  const artistModalClose = artistModal.querySelector(".modal-close");

  const contactModal = document.getElementById("contactModal");
  const contactModalClose = contactModal?.querySelector(".modal-close");
  const contactForm = document.getElementById("contactForm");
  const cfName = document.getElementById("cf_name");
  const cfEmail = document.getElementById("cf_email");
  const cfSubject = document.getElementById("cf_subject");
  const cfMessage = document.getElementById("cf_message");

  /* ---------- Helpers ---------- */
  function escapeHtml(str = "") {
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }
  function openArtistModal(artistObj) {
    artistModalContent.innerHTML = `
      <img src="${artistObj.photo}" alt="${escapeHtml(artistObj.name)}">
      <h2>${escapeHtml(artistObj.name)}</h2>
      <h4>BIOGRAFÍA</h4>
      <p>${escapeHtml(artistObj.bio)}</p>
      <div class="artist-links">
        ${artistObj.links.ig?`<a href="${artistObj.links.ig}" target="_blank" rel="noopener">Instagram</a>`:''}
        ${artistObj.links.sc?`<a href="${artistObj.links.sc}" target="_blank" rel="noopener">SoundCloud</a>`:''}
        ${artistObj.links.yt?`<a href="${artistObj.links.yt}" target="_blank" rel="noopener">YouTube</a>`:''}
        ${artistObj.links.presskit?`<a href="${artistObj.links.presskit}" target="_blank" rel="noopener">Presskit</a>`:''}
      </div>
      <div style="margin-top:18px;text-align:center">
        <button class="btn-primary book-now" data-artist="${escapeHtml(artistObj.name)}">BOOK!</button>
      </div>
    `;
    // show modal
    artistModal.removeAttribute("hidden");
    artistModal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
    // focus for accessibility
    artistModalContent.querySelector("h2")?.focus?.();
  }
  function closeArtistModal(){
    artistModal.setAttribute("hidden","");
    artistModal.setAttribute("aria-hidden","true");
    artistModalContent.innerHTML = "";
    document.body.classList.remove("modal-open");
  }

  function openContactModal(prefill = {}) {
    if (!contactModal) return;
    contactModal.removeAttribute("hidden");
    contactModal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
    if (prefill.name) cfName.value = prefill.name;
    if (prefill.subject) cfSubject.value = prefill.subject;
    if (prefill.message) cfMessage.value = prefill.message;
    setTimeout(()=> cfName.focus(), 80);
  }
  function closeContactModal(){
    if(!contactModal) return;
    contactModal.setAttribute("hidden","");
    contactModal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
    // do not clear values (so user can resume)
  }

  /* ---------- Event: click cards -> open artist modal ---------- */
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".artist-card");
    if (!card) return;
    const key = card.dataset.artist;
    const artistObj = ARTISTS.find(a => a.id === key);
    if (!artistObj) return;
    openArtistModal(artistObj);
  });

  /* ---------- Close artist modal ---------- */
  artistModalClose?.addEventListener("click", closeArtistModal);
  artistModal.addEventListener("click", (e) => {
    if (e.target === artistModal) closeArtistModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!artistModal.hasAttribute("hidden")) closeArtistModal();
      if (contactModal && !contactModal.hasAttribute("hidden")) closeContactModal();
    }
  });

  /* ---------- Delegate: BOOK! button inside modal opens contact modal prefilled ---------- */
  artistModalContent.addEventListener("click", (e) => {
    const btn = e.target.closest(".book-now");
    if (!btn) return;
    const artistName = btn.dataset.artist || "";
    // Prefill contact modal
    openContactModal({
      name: artistName,
      subject: "Booking",
      message: `Hola TTM! Me contacto por: Booking - Artista: ${artistName}`
    });
    // close artist modal when opening contact
    closeArtistModal();
  });

  /* ---------- Contact modal open via header Contact button ---------- */
  const openContactBtn = document.getElementById("openContact");
  openContactBtn?.addEventListener("click", () => openContactModal({subject:"General Inquiry"}));

  /* ---------- Contact modal close handlers ---------- */
  contactModalClose?.addEventListener("click", closeContactModal);
  contactModal?.addEventListener("click", (e) => {
    if (e.target === contactModal) closeContactModal();
  });

  /* ---------- Contact form submit (Formspree used as example) ---------- */
  contactForm?.addEventListener("submit", (e) => {
    // let Formspree handle submission by default - you can intercept if you want AJAX.
    // Basic client-side validation is already enforced by required attributes.
    // Here we close the modal after submit (you may prefer to wait for response).
    setTimeout(()=> {
      closeContactModal();
      // small confirmation (could be improved with toast)
      alert("Gracias — tu mensaje fue enviado. Responderemos pronto.");
    }, 200);
  });

  /* ---------- Accessibility: trap focus in modal (minimal) ---------- */
  // Simple focus trap for artist modal & contact modal: return focus to body when closed.
  // (If you need full focus trap, we can add a more complete implementation.)

});

