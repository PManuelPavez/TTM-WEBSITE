// team.js
// Construye la página de equipo a partir de la tabla "team" en Supabase.

import { loadTeam } from './data-team.js';

export async function initTeam() {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;

  grid.innerHTML = '';

  let team = [];
  try {
    team = await loadTeam();
  } catch (err) {
    console.error('[TTM] Error cargando team desde Supabase', err);
  }

  if (!team.length) {
    grid.innerHTML =
      '<p class="prose">Estamos actualizando la información del equipo.</p>';
    return;
  }

  team.forEach((member) => {
    grid.appendChild(createMemberCard(member));
  });

  // Copy phone to clipboard
  grid.querySelectorAll('[data-tel]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const tel = btn.getAttribute('data-tel');
      if (!tel) return;

      try {
        await navigator.clipboard.writeText(tel);
        showToast('success', 'Teléfono copiado');
      } catch (err) {
        console.error('[TTM] No se pudo copiar el teléfono', err);
        showToast('error', 'No se pudo copiar');
      }
    });
  });
}

function createMemberCard(member) {
  const card = document.createElement('article');
  card.className = 'team-card';

  const contacts = [];

  if (member.links.tel) {
    const tel = member.links.tel;
    contacts.push(
      `<button class="contact-btn" data-tel="${tel}" aria-label="Copiar teléfono de ${member.name}">📞 ${tel}</button>`
    );
  }

  if (member.links.ig) {
    contacts.push(
      `<a class="contact-btn" href="${member.links.ig}" target="_blank" rel="noopener" aria-label="Instagram de ${member.name}">IG</a>`
    );
  }

  if (member.links.email) {
    contacts.push(
      `<a class="contact-btn" href="mailto:${member.links.email}" aria-label="Email a ${member.name}">Email</a>`
    );
  }

  card.innerHTML = `
    <h3 class="team-name">${member.name}</h3>
    <p class="team-role">${member.title || member.role || ''}</p>
    <p class="team-bio">${member.bio || ''}</p>
    <div class="team-contacts">${contacts.join(' ')}</div>
  `;

  return card;
}

function showToast(variant, message) {
  if (window.TTM && typeof window.TTM.showToast === 'function') {
    window.TTM.showToast({ variant, message });
    return;
  }

  const toastEl = document.getElementById('toast');
  if (!toastEl) return;

  toastEl.textContent = message;
  toastEl.classList.remove('hidden');
  setTimeout(() => {
    toastEl.classList.add('hidden');
  }, 3000);
}
