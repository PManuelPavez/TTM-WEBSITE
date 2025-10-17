// artists.js — monta banner per-letter + tarjetas verticales
document.addEventListener('DOMContentLoaded', () => {
  // ---------- Banner per-letter ----------
  const bannerEl = document.getElementById('rotatingText');
  const baseWord = 'ARTISTS';
  const repeats = 6;             // cuántas repeticiones para poder achicar fuente
  const letterDelay = 0.08;      // segundos entre letras (stagger)
  const animDuration = 2.4;      // segundos (coincidir con CSS)

  if (bannerEl) {
    const full = Array.from({length: repeats}, () => baseWord).join(' • ');
    bannerEl.innerHTML = ''; // clear

    Array.from(full).forEach((char, idx) => {
      const span = document.createElement('span');
      span.textContent = char;
      // spaces keep width but no strong animation
      if (char === ' ') {
        span.style.display = 'inline-block';
        span.style.width = '0.35em';
        span.style.opacity = '1';
      }
      // set inline animation timing to create moving wave A -> R -> T ...
      span.style.animationDelay = `${(idx * letterDelay).toFixed(3)}s`;
      span.style.animationDuration = `${animDuration}s`;
      bannerEl.appendChild(span);
    });

    // optional: duplicate content to simulate horizontal scroll if you enable .repeat-scroll class in CSS
    // bannerEl.classList.add('repeat-scroll');
  }

  // ----- Year -----
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ---------- Artists data (vertical cards) ----------
  // Revisa y reemplaza las rutas de photo por las imágenes reales dentro assets/artists/
  const artists = [
    {
      name: "Servando",
      photo: "assets/artists/servando.jpg",
      bio: `Servando es un DJ y productor argentino en ascenso dentro de la escena global de la música electrónica. Su enfoque sofisticado y versátil le permite moverse entre los géneros...`,
      links: {
        instagram: "https://www.instagram.com/servandomusic?igsh=aWd6OHVyMmxzbGg2",
        soundcloud: "https://soundcloud.com/servando_music",
        youtube: "https://www.youtube.com/@servandomusic",
        presskit: "https://servando.dj-presskit.com/"
      }
    },
    {
      name: "Luciano Bedini",
      photo: "assets/artists/luciano_bedini.jpg",
      bio: `Luciano Bedini es DJ y productor...`,
      links: {
        instagram: "https://www.instagram.com/luciaanobedini",
        soundcloud: "https://soundcloud.com/luciano-bedini",
        presskit: "https://lucianobedini.dj-presskit.com/"
      }
    },
    {
      name: "Manu Pavez",
      photo: "assets/artists/manu_pavez.jpg",
      bio: `Manu Pavez es DJ y productor con una visión moderna...`,
      links: {
        instagram: "https://www.instagram.com/manupavez_",
        soundcloud: "https://soundcloud.com/manupavez",
        youtube: "https://www.youtube.com/@manupavez",
        presskit: "https://drive.google.com/..."
      }
    },
    {
      name: "Fideksen",
      photo: "assets/artists/fideksen.jpg",
      bio: `Fideksen es un DJ y productor argentino con un sonido que combina elegancia y groove...`,
      links: {
        instagram: "https://www.instagram.com/fideksen",
        soundcloud: "https://soundcloud.com/fideksensound"
      }
    },
    {
      name: "Kentavros",
      photo: "assets/artists/kentavros.jpg",
      bio: `Kentavros (Sebastián Mansilla) trabaja dentro del progressive y melodic house...`,
      links: {
        instagram: "https://www.instagram.com/kentavros_music",
        soundcloud: "https://soundcloud.com/kentavros_music",
        youtube: "https://www.youtube.com/..."
      }
    },
    {
      name: "p37ro",
      photo: "assets/artists/p37ro.jpg",
      bio: `p37ro es un DJ y productor argentino con identidad marcada por el progressive...`,
      links: {
        instagram: "https://www.instagram.com/p37r0.fragueiro",
        soundcloud: "https://soundcloud.com/user-560556342"
      }
    }
  ];

  const listEl = document.getElementById('artistsList');
  if (!listEl) return;

  // simple HTML escape
  const esc = (s) => (s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : '');

  listEl.innerHTML = '';
  artists.forEach(art => {
    const card = document.createElement('article');
    card.className = 'artist-card';
    // card inner HTML (photo on top, content below)
    card.innerHTML = `
      <div class="artist-photo" role="img" aria-label="${esc(art.name)}" style="background-image:url('${esc(art.photo)}')"></div>
      <div class="artist-content">
        <h3>${esc(art.name)}</h3>
        <p>${esc(art.bio)}</p>
        <div class="artist-links">
          ${art.links?.instagram ? `<a href="${esc(art.links.instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a>` : ''}
          ${art.links?.soundcloud ? `<a href="${esc(art.links.soundcloud)}" target="_blank" rel="noopener noreferrer">SoundCloud</a>` : ''}
          ${art.links?.youtube ? `<a href="${esc(art.links.youtube)}" target="_blank" rel="noopener noreferrer">YouTube</a>` : ''}
          ${art.links?.presskit ? `<a href="${esc(art.links.presskit)}" target="_blank" rel="noopener noreferrer">Presskit</a>` : ''}
        </div>
      </div>
    `;
    listEl.appendChild(card);
  });
});
