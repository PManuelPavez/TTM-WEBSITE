# IA — Arquitectura de Información · ToTheMoon v2025

## Páginas / vistas

- Home (`/src/pages/home.html`)
- Artists (`/src/pages/artists.html`)
- Artist Detail (modal `modal-artist`, embebido en Artists)
- Services (`/src/pages/services.html`)
- Team (`/src/pages/team.html`)
- Contact (modal `modal-contact`, global)

## Flujo principal

Home → Artists → (Artist Modal) → Contact (modal)

- **Home:** presentación de marca, hero slider, acceso rápido a Artists/Services/Team/Contact.
- **Artists:** descubrimiento del roster (grid), detalle en modal y CTA de contacto contextual.
- **Services:** lista de servicios ofrecidos.
- **Team:** presentación del equipo.
- **Contact Modal:** formulario breve, selecciona artista (opcional) y envía consulta.

## Objetivos

- Descubrir rápidamente el roster y servicios.
- Incentivar el contacto desde contexto de artista.
- Mantener consistencia visual y de navegación entre vistas.

## Reglas de accesibilidad (AA)

- Landmarks claros: `header`, `main`, `footer`, `nav`.
- `skip-link` al inicio para saltar directamente al `main`.
- Headings en orden jerárquico (`h1` por página, `h2` por sección).
- Modales:
  - `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
  - Focus trap interno, cierre con `Esc`, botón close con `aria-label`.
- Formularios:
  - `label` visibles o `aria-label` claros.
  - Mensajes de error asociados al campo.
- Navegación:
  - Todos los elementos interactivos accesibles por teclado.
  - Estados `:focus-visible` visibles y coherentes.