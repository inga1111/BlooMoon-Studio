document.addEventListener("DOMContentLoaded", () => {
  
  const storedData = localStorage.getItem("selectedFilm");

  
  if (!storedData) {
    document.querySelector(".film-details").innerHTML = `
      <p>Film details not found. Please go back to the <a href='library.html'>library</a>.</p>
    `;
    return;
  }

  
  const film = JSON.parse(storedData);

  
  document.getElementById("film-title").textContent = film.title;
  document.getElementById("film-name").textContent = film.title;
  document.getElementById("film-duration").textContent = film.duration;
  document.getElementById("film-release").textContent = film.release;
  document.getElementById("film-writer").textContent = film.writer;
  document.getElementById("film-director").textContent = film.director;
  document.getElementById("film-description").textContent = film.description;
  const posterEl = document.getElementById("film-poster");
  if (posterEl) posterEl.src = film.src || film.poster || "../images/perfect-sorrow.jpg";


  const youtubeBtn = document.getElementById("youtube-link");
  if (film.link) youtubeBtn.href = film.link;

  // Next button: advance to the next film in the ordered filmList (wrap-around)
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      try {
        const raw = localStorage.getItem('filmList');
        if (!raw) { window.location.href = 'library.html'; return; }
        const list = JSON.parse(raw);
        // find current film by title (dataset stored as title)
        const idx = list.findIndex(f => (f.title && f.title === film.title));
        const nextIndex = idx >= 0 ? (idx + 1) % list.length : 0;
        const nextFilm = list[nextIndex];
        if (nextFilm) {
          localStorage.setItem('selectedFilm', JSON.stringify(nextFilm));
          // navigate to the next details page in the sequence (wrap-around)
          try {
            const detailPages = ['library-details.html','library-details2.html','library-details3.html'];
            const path = window.location.pathname || window.location.href;
            const currentFile = path.split('/').pop();
            const pageIdx = detailPages.indexOf(currentFile);
            const nextPage = detailPages[(pageIdx + 1) % detailPages.length] || detailPages[0];
            window.location.href = nextPage;
          } catch (e) {
            // fallback: reload current details page
            window.location.reload();
          }
        } else {
          window.location.href = 'library.html';
        }
      } catch (err) {
        console.error('Next navigation failed', err);
        window.location.href = 'library.html';
      }
    });
  }

  
  gsap.from("header", {
    duration: 1,
    y: -60,
    opacity: 0,
    ease: "power3.out"
  });

  gsap.to(".poster-section img", {
    duration: 1.3,
    opacity: 1,
    scale: 1.05,
    ease: "power2.out",
    delay: 0.5
  });

  gsap.to(".info-section", {
    duration: 1.2,
    y: 0,
    opacity: 1,
    ease: "power2.out",
    delay: 0.8
  });

  gsap.from(".buttons a, .buttons button", {
    duration: 0.8,
    y: 20,
    opacity: 0,
    stagger: 0.2,
    ease: "back.out(1.7)",
    delay: 1.2
  });
});
