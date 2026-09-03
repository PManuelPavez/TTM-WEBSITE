## 2025-11-25 — L1 — PM
- Inicializa estructura escalable de TTM basada en los archivos originales (ttm-old).
- Crea carpeta `/SPECS` con IA, contrato de componentes, tokens de diseño y eventos.
- Copia assets y backend a la nueva estructura.
- Crea partials `header.html` y `footer.html` en `/src/partials`.
- Crea página inicial `home.html` sin duplicar encabezado ni pie.
- Establece estructura de carpetas para `pages`, `components`, `styles` y `js`.

## 2025-11-25 — L2 — PM
- Completa la separación de componentes y páginas para Artists, Services y Team.
- Añade componentes de modales y tarjetas a `/src/components` (card-artist, modal-artist, modal-contact, hero-slider).
- Divide el CSS en tokens, base, layout y estilos específicos por componente; crea archivos para header, footer, hero slider, tarjeta de artista, modales y toast.
- Implementa módulos JavaScript para la navegación, slider, grid de artistas y modal de artista.

## 2025-11-25 — L3 — PM
- Agrega módulos adicionales para: contacto (`modal-contact.js`), notificaciones (`toast.js`), listado de servicios (`services.js`) y listado de equipo (`team.js`).
- Crea hojas de estilos para servicios y equipo (`services.css` y `team.css`) y las incorpora en las páginas correspondientes.
- Actualiza `app.js` para inicializar todos los módulos nuevos en `DOMContentLoaded`.
- Integra mensajes de confirmación vía toast en envíos de formularios y copia de teléfono.
- Simplifica la página de servicios y equipo con estructuras de tarjeta reutilizables y datos embebidos para facilitar despliegue en entornos estáticos.