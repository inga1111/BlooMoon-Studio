document.addEventListener("DOMContentLoaded", () => {
  const filmId = localStorage.getItem("selectedFilm");

  // Example film data
  const films = {
    "perfect-sorrow": {
      title: "Perfect Sorrow",
      duration: "1h 45m",
      release: "12 June 2025",
      writer: "A. Bloom",
      director: "S. Luna",
      description: "A 25 year old woman is torn when she must choose between love and destiny.",
      poster: "../images/perfect-sorrow.jpg",
      link: "https://www.youtube.com/channel/UC47qbmpTIuN2vePS-Talhfw"
    }
  };

  const film = films[filmId];

  if (film) {
    document.getElementById("film-title").textContent = film.title;
    document.getElementById("film-name").textContent = film.title;
    document.getElementById("film-duration").textContent = film.duration;
    document.getElementById("film-release").textContent = film.release;
    document.getElementById("film-writer").textContent = film.writer;
    document.getElementById("film-director").textContent = film.director;
    document.getElementById("film-description").textContent = film.description;
    document.getElementById("film-poster").src = film.poster;
    document.getElementById("youtube-link").href = film.link;
  } else {
    document.querySelector(".film-details").innerHTML = `
      <p>Film details not found. Please go back to the <a href='library.html'>library</a>.</p>
    `;
  }

  // 🌸 GSAP animations
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
