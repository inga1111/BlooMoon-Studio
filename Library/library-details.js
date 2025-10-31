document.addEventListener("DOMContentLoaded", () => {
  const filmId = localStorage.getItem("selectedFilm");

  // Example film data (you can expand this with your actual Bloomoon projects)
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
    },
    // You can add more Bloomoon films here later:
    // "film-2": {...}, "film-3": {...}
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
});
