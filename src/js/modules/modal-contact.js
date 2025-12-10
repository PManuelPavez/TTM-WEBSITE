// modal-contact.js
// Controls the contact modal: shows/hides the artist selector based on
// subject, handles closing via overlay/escape/key, and simulates
// form submission with a toast message.

export function initModalContact() {
  const modal = document.getElementById('contactModal');
  if (!modal) return;

  const overlay = modal.querySelector('.modal-overlay');
  const closeBtn = modal.querySelector('.close-modal');
  const form = modal.querySelector('form');
  const subjectSelect = modal.querySelector('#cf_subject');
  const artistContainer = modal.querySelector('#artistSelectContainer');
  const artistSelect = modal.querySelector('#cf_artist');

  // Helper: close the modal
  function close() {
    modal.removeAttribute('open');
  }

  // Close handlers: overlay click and close button
  if (overlay) overlay.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.hasAttribute('open')) {
      close();
    }
  });

  // Show/hide artist selector when the subject changes
  if (subjectSelect) {
    subjectSelect.addEventListener('change', () => {
      if (subjectSelect.value === 'Booking') {
        artistContainer.hidden = false;
      } else {
        artistContainer.hidden = true;
        if (artistSelect) artistSelect.value = '';
      }
    });
  }

  // Form submission: simulate send and show toast
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Determine a success message
      const msg = '¡Gracias! Tu mensaje ha sido enviado.';
      // Use the global toast if available
      if (window.TTM && typeof window.TTM.showToast === 'function') {
        window.TTM.showToast({ variant: 'success', message: msg });
      } else {
        // Fallback: show/hide the toast element directly
        const toastEl = document.getElementById('toast');
        if (toastEl) {
          toastEl.textContent = msg;
          toastEl.classList.remove('hidden');
          setTimeout(() => {
            toastEl.classList.add('hidden');
          }, 2500);
        }
      }
      // Reset the form
      form.reset();
      // Hide the artist selector again
      if (artistContainer) artistContainer.hidden = true;
      // Close the modal
      close();
    });
  }
}