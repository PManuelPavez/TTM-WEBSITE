// artists.js
document.addEventListener("DOMContentLoaded", () => {
  const textElement = document.getElementById("rotatingText");
  const text = textElement.textContent;
  textElement.innerHTML = "";

  // Separar letras para rotar individualmente
  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.animationDelay = `${i * 0.1}s`;
    textElement.appendChild(span);
  });

  // Año dinámico en footer
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // ARTISTAS DATA
  const artists = [
    {
      name: "Servando",
      bio: "DJ y productor argentino con presencia global en la música electrónica. Su sonido sofisticado y adaptable lo ha llevado a escenarios internacionales y a ser apoyado por referentes como Hernán Cattáneo y Budakid.",
      photo: "assets/artists/servando.jpg",
      links: {
        instagram: "https://www.instagram.com/servandomusic",
        soundcloud: "https://soundcloud.com/servando_music",
        youtube: "https://www.youtube.com/@servandomusic",
        presskit: "https://servando.dj-presskit.com/"
      }
    },
    {
      name: "Luciano Bedini",
      bio: "DJ y productor de Pergamino, Buenos Aires. Fusiona progressive house, dub techno y deep house en paisajes sonoros melódicos y emocionales. Ha editado en sellos como Sound Avenue y Future Avenue.",
      photo: "assets/artists/luciano_bedini.jpg",
      links: {
        instagram: "https://www.instagram.com/luciaanobedini",
        soundcloud: "https://soundcloud.com/luciano-bedini",
        presskit: "https://lucianobedini.dj-presskit.com/"
      }
    },
    {
      name: "Manu Pavez",
      bio: "DJ y productor argentino con visión moderna del progressive house. Crea experiencias emocionales únicas en la pista, con técnica y sensibilidad.",
      photo: "assets/artists/manu_pavez.jpg",
      links: {
        instagram: "https://www.instagram.com/manupavez_",
        soundcloud: "https://soundcloud.com/manupavez",
        youtube: "https://www.youtube.com/@manupavez",
        presskit: "https://drive.google.com/drive/folders/1VfZLoKmZqqgi8qIFOhhOrmd6fvLi9fsQ"
      }
    },
    {
      name: "Fideksen",
      bio: "DJ y productor argentino que combina elegancia, groove y una fuerte identidad melódica. Fundador del sello La Casadiscografica, referente de nuevos talentos.",
      photo: "assets/artists/fideksen.jpg",
      links: {
        instagram: "https://www.instagram.com/fideksen",
        soundcloud: "https://soundcloud.com/fideksensound"
      }
    },
    {
      name: "Kentavros",
      bio: "DJ argentino oriundo de 9 de Julio. Su estilo progresivo construye atmósferas inmersivas con una profunda conexión emocional con el público.",
      photo: "assets/artists/kentavros.jpg",
      links: {
        instagram: "https://www.instagram.com/kentavros_music",
        soundcloud: "https://soundcloud.com/kentavros_music",
        youtube: "https://www.youtube.com/channel/UCWkeiQKMZn4GmnZ30VPgiqQ",
        presskit: "https://drive.google.com/file/d/1yV-sDy5wIHp6HhAR5YLrfATwbSPgPHDG/view"
      }
    },
    {
      name: "p37ro",
      bio: "DJ y productor argentino con identidad marcada por el progressive. Su música combina atmósferas hipnóticas y grooves envolventes, avalada por Hernán Cattáneo y otros referentes.",
      photo: "assets/artists/p37ro.jpg",
      links: {
        instagram: "https://www.instagram.com/p37r0.fragueiro",
        soundcloud: "https://soundcloud.com/user-560556342"
      }
    }
  ];

  const list = document.getElementById("artistsList");

  artists.forEach(artist => {
    const card = document.createElement("div");
    card.classList.add("artist-card");
    card.innerHTML = `
      <div class="artist-photo" style="background-image:url('${artist.photo}')"></div>
      <div class="artist-content">
        <h3>${artist.name}</h3>
        <p>${artist.bio}</p>
        <div class="artist-links">
          ${artist.links.instagram ? `<a href="${artist.links.instagram}" target="_blank">Instagram</a>` : ""}
          ${artist.links.soundcloud ? `<a href="${artist.links.soundcloud}" target="_blank">SoundCloud</a>` : ""}
          ${artist.links.youtube ? `<a href="${artist.links.youtube}" target="_blank">YouTube</a>` : ""}
          ${artist.links.presskit ? `<a href="${artist.links.presskit}" target="_blank">Presskit</a>` : ""}
        </div>
      </div>
    `;
    list.appendChild(card);
  });
});
