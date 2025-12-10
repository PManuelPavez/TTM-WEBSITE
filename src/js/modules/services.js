// src/js/modules/services.js
// Acordeón para la página Services:
// - Cada servicio empieza colapsado (solo título).
// - Al hacer click, se abre y el párrafo se escribe con efecto "typewriter".
// - Solo se abre un servicio a la vez (acordeón).

const SERVICE_CONTAINER_SELECTOR = '[data-ttm-services]';
const SERVICE_ITEM_SELECTOR = '[data-ttm-service-item]';
const TOGGLE_SELECTOR = '[data-ttm-service-toggle]';
const PANEL_SELECTOR = '[data-ttm-service-panel]';
const TEXT_SELECTOR = '[data-ttm-service-text]';

// Estado global de tipeo actual
let currentTyping = null;
const TYPING_INTERVAL = 18; // ms por carácter (~55 chars/seg)

export function initServices() {
  const container = document.querySelector(SERVICE_CONTAINER_SELECTOR);
  if (!container) return;

  const items = Array.from(container.querySelectorAll(SERVICE_ITEM_SELECTOR));
  if (!items.length) return;

  const state = new WeakMap(); // item -> { toggle, panel, paragraph, fullText, typed }

  items.forEach((item) => {
    const toggle = item.querySelector(TOGGLE_SELECTOR);
    const panel = item.querySelector(PANEL_SELECTOR);
    const paragraph = panel ? panel.querySelector(TEXT_SELECTOR) : null;

    if (!toggle || !panel || !paragraph) {
      // Si falta algo, no rompemos toda la página: solo ignoramos ese item
      return;
    }

    const fullText = paragraph.textContent.trim();
    paragraph.textContent = '';

    // ARIA / accesibilidad básica
    toggle.type = toggle.type || 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', getOrCreateId(panel, 'service-panel'));

    panel.setAttribute('role', 'region');
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
      handleToggle(item, items, state);
    });
  });
}

function handleToggle(targetItem, allItems, state) {
  const data = state.get(targetItem);
  if (!data) return;

  const isOpen = targetItem.classList.contains('is-open');

  // Cerramos todos los demás (acordeón "solo uno abierto")
  allItems.forEach((item) => {
    if (item === targetItem) return;
    collapseItem(item, state);
  });

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

  if (!data.typed) {
    // Primera vez: tipeo animado
    startTyping(paragraph, fullText, () => {
      data.typed = true;
    });
  } else {
    // Ya fue tipeado antes: mostramos el texto completo al toque
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

  // Si justo se estaba tipeando este ítem, terminamos y mostramos el texto completo
  if (currentTyping && currentTyping.paragraph === paragraph) {
    stopTyping(true);
  } else if (!data.typed) {
    // Si nunca terminó de tipear pero estaba cerrado, dejamos el texto vacío
    paragraph.textContent = '';
  } else {
    // Si ya estaba tipeado, dejamos el texto completo (aunque esté oculto)
    paragraph.textContent = fullText;
  }
}

function getOrCreateId(element, prefix) {
  if (element.id) return element.id;
  const id = `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
  element.id = id;
  return id;
}

function startTyping(paragraph, fullText, onComplete) {
  stopTyping(false); // Cancelar cualquier tipeo anterior

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

  // Primer frame instantáneo
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
