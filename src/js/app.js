// Entry point for the To The Moon website.
// Each imported module exposes an init function that sets up behaviour
// for its corresponding page or component.  Functions are called on
// DOMContentLoaded to avoid interfering with the page load.

import { initNav } from './modules/nav.js';
import { initHeroSlider } from './modules/hero-slider.js';
import { initArtistGrid } from './modules/artist-grid.js';
import { initModalArtist } from './modules/modal-artist.js';
import { initModalContact } from './modules/modal-contact.js';
import { initToast } from './modules/toast.js';
import { initServices } from './modules/services.js';
import { initTeam } from './modules/team.js';
import { initLabelsSlider } from './modules/labels-slider.js'; // ← NUEVO

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeroSlider();
  initArtistGrid();
  initModalArtist();
  initModalContact();
  initToast();
  initServices();
  initTeam();
  initLabelsSlider(); // ← NUEVO
});
