// src/js/modules/services.js
// Render dinámico de la página de servicios usando Supabase.
// - Lee la tabla "services" vía loadServices().
// - Crea un bloque por servicio (puede haber varios abiertos a la vez).
// - Al abrir un servicio por primera vez, escribe el texto con efecto "typewriter".

import { loadServices } from './data-services.js';

const TYPING_INTERVAL = 18; // ms por carácter
let currentTyping = null;

const PREFERS_REDUCED_MOTION =
  typeof window !== 'undefined' &&
  'matchMedia' in window &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  if (!services || !services.length) {
    const msg = document.createElement('p');
    msg.className = 'prose';
    msg.textContent =
      'En breve vamos a publicar el detalle de servicios.';
    container.appendChild(msg);
    return;
  }

  const root = document.createElement('div');
  root.className = 'c-services';
  root.setAttribute('data-ttm-services', 'true');

  services.forEach((svc, idx) => {
    const item = document.createElement('article');
    item.className = 'c-service';
    item.setAttribute('data-ttm-service-item', '');

    const header = document.createElement('button');
    header.className = 'c-service__header';
    header.setAttribute('data-ttm-service-toggle', '');
    header.type = 'button';

    const title = document.createElement('h2');
    title.className = 'c-service__title';
    const order =
      typeof svc.order_index === 'number' && !Number.isNaN(svc.order_index)
        ? svc.order_index
        : idx + 1;
    const number = String(order).padStart(2, '0');
    title.textContent = `${number} — ${svc.title || ''}`;

    const icon = document.createElement('span');
    icon.className = 'c-service__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '+'; // El CSS lo puede rotar/cambiar

    header.appendChild(title);
    header.appendChild(icon);

    const panel = document.createElement('div');
    panel.className = 'c-service__body';
    panel.setAttribute('data-ttm-service-panel', '');
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');

    const panelId = `service-panel-${svc.id || number}`;
    panel.id = panelId;
    header.setAttribute('aria-controls', panelId);
    header.setAttribute('aria-expanded', 'false');

    const paragraph = document.createElement('p');
    paragraph.className = 'c-service__text';
    paragraph.setAttribute('data-ttm-service-text', '');
    paragraph.textContent = svc.text || '';

    panel.appendChild(paragraph);
    item.appendChild(header);
    item.appendChild(panel);
    root.appendChild(item);
  });

  container.appendChild(root);

  setupAccordion(root);
}

function setupAccordion(root) {
  const items = Array.from(
    root.querySelectorAll('[data-ttm-service-item]')
  );
  if (!items.length) return;

  const state = new WeakMap();

  items.forEach((item) => {
    const toggle = item.querySelector('[data-ttm-service-toggle]');
    const panel = item.querySelector('[data-ttm-service-panel]');
    const paragraph = panel
      ? panel.querySelector('[data-ttm-service-text]')
      : null;

    if (!toggle || !panel || !paragraph) return;

    const fullText = paragraph.textContent.trim();
    paragraph.textContent = '';

    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    panel.hidden = true;
    item.classList.remove('is-open');

    state.set(item, {
      toggle,
      panel,
      paragraph,
      fullText,
      typed: false,
    });

    toggle.addEventListener('click', () => {
      handleToggle(item, state);
    });
  });
}

/**
 * Ahora NO cerramos los otros servicios.
 * Cada item se abre/cierra de forma independiente.
 */
function handleToggle(targetItem, state) {
  const data = state.get(targetItem);
  if (!data) return;

  const isOpen = targetItem.classList.contains('is-open');

  if (isOpen) {
    collapseItem(targetItem, state);
  } else {
    expandItem(targetItem, state);
  }
}

function expandItem(item, state) {
  const data = state.get(item);
  if (!data) return;
  const { toggle, panel, paragraph, fullText } = data;

  item.classList.add('is-open');
  toggle.setAttribute('aria-expanded', 'true');
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');

  if (!fullText) return;

  if (PREFERS_REDUCED_MOTION) {
    paragraph.textContent = fullText;
    data.typed = true;
    return;
  }

  if (!data.typed) {
    startTyping(paragraph, fullText, () => {
      data.typed = true;
    });
  } else {
    paragraph.textContent = fullText;
  }
}

function collapseItem(item, state) {
  const data = state.get(item);
  if (!data) return;
  const { toggle, panel, paragraph, fullText } = data;

  item.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');

  if (currentTyping && currentTyping.paragraph === paragraph) {
    // Si lo cerrás mientras escribe, completamos el texto igual.
    stopTyping(true);
  } else if (!data.typed) {
    paragraph.textContent = '';
  } else {
    paragraph.textContent = fullText;
  }
}

function startTyping(paragraph, fullText, onComplete) {
  // Si había otro servicio escribiéndose, lo terminamos
  stopTyping(true);

  paragraph.textContent = '';
  let index = 0;

  currentTyping = {
    paragraph,
    fullText,
    timerId: null,
    onComplete,
  };

  const tick = () => {
    if (!currentTyping || currentTyping.paragraph !== paragraph) return;

    if (index >= fullText.length) {
      stopTyping(false);
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    paragraph.textContent += fullText.charAt(index);
    index += 1;
  };

  tick();
  currentTyping.timerId = window.setInterval(tick, TYPING_INTERVAL);
}

function stopTyping(forceShowFull) {
  if (!currentTyping) return;

  if (currentTyping.timerId != null) {
    window.clearInterval(currentTyping.timerId);
  }

  if (forceShowFull && currentTyping.paragraph) {
    currentTyping.paragraph.textContent = currentTyping.fullText;
  }

  currentTyping = null;
}
