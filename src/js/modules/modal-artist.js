// src/js/modules/modal-artist.js
// Maneja abrir/cerrar el modal de artista y poblarlo con los datos.
// Expone window.TTM.openArtistModal para que artist-grid.js lo use.

export function initModalArtist() {
  const modal = document.getElementById('artistModal');
  if (!modal) return;

  const overlay = modal.querySelector('.modal-overlay');
  const closeBtn = modal.querySelector('.modal-close');
  const content = modal.querySelector('#artistModalContent');

  if (!content) return;

  function close() {
    modal.removeAttribute('open');
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.hasAttribute('open')) {
      close();
    }
  });

  // Exponer función global para que artist-grid.js pueda abrir el modal
  window.TTM = window.TTM || {};
  window.TTM.openArtistModal = function (artist) {
    if (!artist) return;

    const links = [];
    if (artist.links?.ig) {
      links.push(
        `<a class="artist-link" href="${artist.links.ig}" target="_blank" rel="noopener">Instagram</a>`
      );
    }
    if (artist.links?.sc) {
      links.push(
        `<a class="artist-link" href="${artist.links.sc}" target="_blank" rel="noopener">SoundCloud</a>`
      );
    }
    if (artist.links?.yt) {
      links.push(
        `<a class="artist-link" href="${artist.links.yt}" target="_blank" rel="noopener">YouTube</a>`
      );
    }
    if (artist.links?.presskit) {
      links.push(
        `<a class="artist-link" href="${artist.links.presskit}" target="_blank" rel="noopener">Presskit</a>`
      );
    }

    content.innerHTML = `
      <div class="modal-top">
        <img class="modal-photo" src="${artist.photo}" alt="${artist.name}" loading="lazy">
      </div>
      <div class="modal-body">
        <div class="modal-header">
          <h2 id="artistTitle">${artist.name}</h2>
          <div class="modal-links">${links.join(' ')}</div>
        </div>
        <h4>Biografía</h4>
        <p class="bio-text">${artist.bio || ''}</p>
        <div class="modal-actions">
          <button class="btn-primary book-now" data-artist-name="${artist.name}">Book!</button>
        </div>
      </div>
    `;

    // Botón Book → abre modal de contacto prellenado
    const bookBtn = content.querySelector('.book-now');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => {
        const contactModal = document.getElementById('contactModal');
        if (!contactModal) return;

        contactModal.setAttribute('open', '');

        const subjectSelect = contactModal.querySelector('#cf_subject');
        const artistSelect = contactModal.querySelector('#cf_artist');
        const artistContainer = contactModal.querySelector('#artistSelectContainer');

        if (subjectSelect) subjectSelect.value = 'Booking';
        if (artistContainer) artistContainer.hidden = false;

        if (artistSelect) {
          let opt = Array.from(artistSelect.options).find(
            (o) => o.value === artist.name
          );
          if (!opt) {
            opt = document.createElement('option');
            opt.value = artist.name;
            opt.textContent = artist.name;
            artistSelect.appendChild(opt);
          }
          artistSelect.value = artist.name;
        }
      });
    }

    modal.setAttribute('open', '');
  };
}
