// artists.js (mejorado)
// - construye el banner per-letter con repeats y stagger
// - rellena la lista vertical de artistas (foto arriba, recuadro azul)
// - respeta prefers-reduced-motion
document.addEventListener('DOMContentLoaded', () => {
  // ----- ROTATING BANNER -----
  const banner = document.getElementById('rotatingText');
  const baseWord = 'ARTISTS';
  const nRepeats = 6;           // ajustar cuántas repeticiones quieres
  const letterDelay = 0.08;     // segundos entre letras
  const perLetterAnimDuration = 2.4; // duración CSS (coincide con styles.css)

  // safety
  if (banner) {
    // construir el repeated string with separators (space dot space)
    let full = [];
    for (let r = 0; r < nRepeats; r++) {
      full.push(baseWord);
    }
    // join with bullet separator for readability
    const rendered = full.join(' • ');
    // split into characters
    banner.innerHTML = ''; // reset
    const chars = Array.from(rendered);
    chars.forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch;
      // spaces should not animate strongly; give them 0 duration / 0 opacity change
      if (ch.trim() === '') {
        span.style.opacity = '1';
        span.style.display = 'inline-block';
        // keep small spacing
        span.style.width = '0.36em';
      }
      // set animation delay inline (seconds)
      const delay = (i * letterDelay).toFixed(3) + 's';
      span.style.animationDelay = delay;
      // ensure animation-duration matches CSS
      span.style.animationDuration = `${perLetterAnimDuration}s`;
      banner.appendChild(span);
    });

    // Optionally add class to cause banner to scroll the repeated block horizontally
    // If you want continuous scroll, uncomment next line (and have CSS .repeat-scroll defined)
    // banner.classList.add('repeat-scroll');
  }

  // set footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ----- ARTISTAS DATA (usé la información que enviaste; revísala y cambia images) -----
  const artists = [
    {
      name: "Servando",
      photo: "assets/artists/servando.jpg",
      bio: `Servando es un DJ y productor argentino en ascenso dentro de la escena global de la música electrónica. Su enfoque sofisticado y versátil le permite moverse entre los géneros, logrando un sonido único y adaptable a cualquier pista. Ha compartido cabina con Ezequiel Arias, Budakid, Emi Galván, John Cosani y más. Sus tracks han sonado en festivales como We Are Lost, Anjuna Deep Explorations y Mirage.`,
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
      bio: `Luciano Bedini es DJ y productor. Su identidad artística se define por la fusión entre progressive house, dub techno y deep house. Ha editado en sellos como Sound Avenue y Future Avenue.`,
      links: {
        instagram: "https://www.instagram.com/luciaanobedini?igsh=MXI1N3A0MnYyYjhrNw==",
        soundcloud: "https://soundcloud.com/luciano-bedini",
        presskit: "https://lucianobedini.dj-presskit.com/"
      }
    },
    {
      name: "Manu Pavez",
      photo: "assets/artists/manu_pavez.jpg",
      bio: `Manu Pavez es DJ y productor con una visión moderna del progressive house. Su sonido conecta emocionalmente con el público y transforma cada set en un viaje.`,
      links: {
        instagram: "https://www.instagram.com/manupavez_?igsh=MWdraWJyaGszbGljdQ==",
        soundcloud: "https://soundcloud.com/manupavez",
        youtube: "https://www.youtube.com/@manupavez",
        presskit: "https://drive.google.com/drive/folders/1VfZLoKmZqqgi8qIFOhhOrmd6fvLi9fsQ?usp=sharing"
      }
    },
    {
      name: "Fideksen",
      photo: "assets/artists/fideksen.jpg",
      bio: `Fideksen combina elegancia, groove y una identidad melódica. Fundador de La Casadiscografica, su música ha sido editada por sellos internacionales.`,
      links: {
        instagram: "https://www.instagram.com/fideksen?igsh=MWZ2cDVsaXhtY2Y0Nw==",
        soundcloud: "https://soundcloud.com/fideksensound"
      }
    },
    {
      name: "Kentavros",
      photo: "assets/artists/kentavros.jpg",
      bio: `Kentavros (Sebastián Mansilla) desarrolla atmósferas inmersivas dentro del progressive y melodic house; ha compartido cabina con artistas de renombre y crece en la escena local.`,
      links: {
        instagram: "https://www.instagram.com/kentavros_music?igsh=MXhmYTNpZjVlMzBrZw==",
        soundcloud: "https://soundcloud.com/kentavros_music",
        youtube: "https://www.youtube.com/channel/UCWkeiQKMZn4GmnZ30VPgiqQ",
        presskit: "https://drive.google.com/file/d/1yV-sDy5wIHp6HhAR5YLrfATwbSPgPHDG/view?usp=drivesdk"
      }
    },
    {
      name: "p37ro",
      photo: "assets/artists/p37ro.jpg",
      bio: `p37ro es un DJ y productor con identidad marcada por el progressive; su música destaca por atmósferas hipnóticas y grooves envolventes.`,
      links: {
        instagram: "https://www.instagram.com/p37r0.fragueiro?igsh=dHFhY21rMWU3MHFu",
        soundcloud: "https://soundcloud.com/user-560556342"
      }
    }
  ];

  // ----- RENDER ARTIST CARDS (vertical) -----
  const list = document.getElementById('artistsList');
  if (!list) return;
  list.innerHTML = '';

  artists.forEach(art => {
    const card = document.createElement('article');
    card.className = 'artist-card';
    card.innerHTML = `
      <div class="artist-photo" role="img" aria-label="${escapeHtml(art.name)}" style="background-image:url('${art.photo}')"></div>
      <div class="artist-content">
        <h3>${escapeHtml(art.name)}</h3>
        <p>${escapeHtml(art.bio)}</p>
        <div class="artist-links">
          ${art.links?.instagram ? `<a href="${art.links.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>` : ''}
          ${art.links?.soundcloud ? `<a href="${art.links.soundcloud}" target="_blank" rel="noopener noreferrer">SoundCloud</a>` : ''}
          ${art.links?.youtube ? `<a href="${art.links.youtube}" target="_blank" rel="noopener noreferrer">YouTube</a>` : ''}
          ${art.links?.presskit ? `<a href="${art.links.presskit}" target="_blank" rel="noopener noreferrer">Presskit</a>` : ''}
        </div>
      </div>
    `;
    list.appendChild(card);
  });

  // helper to avoid XSS if content ever comes from external source
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
});
