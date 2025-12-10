// toast.js
// Exposes a global toast function on the TTM namespace to show
// transient notifications. The toast element is expected to exist
// with id="toast" and class .c-toast.

export function initToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  // Ensure the toast is hidden initially
  toast.classList.add('hidden');
  // Provide a global function for showing messages
  window.TTM = window.TTM || {};
  window.TTM.showToast = function ({ variant = 'info', message = '' } = {}) {
    // Optionally handle different variants via classes; for now we just display
    toast.textContent = message;
    toast.classList.remove('hidden');
    // Hide after a delay
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  };
}