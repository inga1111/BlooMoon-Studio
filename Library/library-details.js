document.addEventListener("DOMContentLoaded", () => {
  // Get stored film data
  const storedData = localStorage.getItem("selectedFilm");

  // If nothing stored → show fallback message
  if (!storedData) {
    document.querySelector(".film-details").innerHTML = `
      <p>Film details not found. Please go back to the <a href='library.html'>library</a>.</p>
    `;
    return;
  }

  // Parse data object that was saved from dataset attributes
  const film = JSON.parse(storedData);

  // Insert film data into page
  document.getElementById("film-title").textContent = film.title;
  document.getElementById("film-name").textContent = film.title;
  document.getElementById("film-duration").textContent = film.duration;
  document.getElementById("film-release").textContent = film.release;
  document.getElementById("film-writer").textContent = film.writer;
  document.getElementById("film-director").textContent = film.director;
  document.getElementById("film-description").textContent = film.description;
  document.getElementById("film-poster").src = film.src || film.poster || "../images/perfect-sorrow.jpg";

  // Update YouTube link
  const youtubeBtn = document.getElementById("youtube-link");
  if (film.link) youtubeBtn.href = film.link;

  // 🌸 GSAP animations (unchanged)
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
