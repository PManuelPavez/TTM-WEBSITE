// services.js
// Llena la página de servicios usando la tabla "services" de Supabase.

import { loadServices } from './data-services.js';

export async function initServices() {
  const container = document.getElementById('servicesList');
  if (!container) return;

  container.innerHTML = '';

  let services = [];
  try {
    services = await loadServices();
  } catch (err) {
    console.error('[TTM] Error cargando servicios desde Supabase', err);
  }

  if (!services.length) {
    container.innerHTML =
      '<p class="prose">Estamos actualizando la lista de servicios.</p>';
    return;
  }

  services.forEach((svc, idx) => {
    const card = document.createElement('article');
    card.className = 'service-card';
    card.innerHTML = `
      <h3 class="service-title">${String(idx + 1).padStart(2, '0')} — ${
      svc.title
    }</h3>
      <p class="service-text">${svc.text}</p>
    `;
    container.appendChild(card);
  });
}
