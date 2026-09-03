// nav.js
// Handles the responsive navigation toggle and contact button
// for the To The Moon site.

export function initNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navTabs = document.querySelector('.nav-tabs');
  // Buttons that should open the contact modal from the nav or other parts
  const contactTriggers = document.querySelectorAll('[data-ttm-open="contact-modal"], .nav-contact-btn');

  // Mobile nav toggle
  if (navToggle && navTabs) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      navTabs.classList.toggle('open', !isExpanded);
    });
    // Close the menu when clicking a link (helpful on mobile)
    navTabs.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navTabs.classList.remove('open');
      });
    });
  }

  // Contact modal triggers
  contactTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById('contactModal');
      if (modal) {
        modal.setAttribute('open', '');
      }
    });
  });
}