// 🌸 Animate welcome text using GSAP
document.addEventListener("DOMContentLoaded", () => {
  const welcomeText = document.getElementById("welcome-text");

  if (welcomeText) {
    gsap.from(welcomeText, {
      duration: 1.2,
      opacity: 0,
      y: -30,
      ease: "power2.out"
    });

    gsap.to("#welcome-text span", {
      repeat: -1,
      yoyo: true,
      color: "#e98ab2",
      duration: 2,
      ease: "sine.inOut"
    });
  }

  // 🌙 Fetch username from login
  const usernameSpan = document.getElementById("username");
  const storedUser = localStorage.getItem("loggedInUser");
  if (storedUser && usernameSpan) {
    usernameSpan.textContent = storedUser;
  }
});

// 🌸 Handle film click and store data
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("film-poster")) {
    const filmData = {
      title: e.target.dataset.title,
      duration: e.target.dataset.duration,
      release: e.target.dataset.release,
      writer: e.target.dataset.writer,
      director: e.target.dataset.director,
      description: e.target.dataset.description,
      link: e.target.dataset.link,
      image: e.target.src,
    };
    localStorage.setItem("selectedFilm", JSON.stringify(filmData));
    window.location.href = "library-details.html";
  }
});

// 🌙 Populate film details page
if (window.location.pathname.includes("library-details.html")) {
  const film = JSON.parse(localStorage.getItem("selectedFilm"));
  if (film) {
    document.getElementById("detail-poster").src = film.image;
    document.getElementById("detail-title").textContent = film.title;
    document.getElementById("detail-duration").textContent = film.duration;
    document.getElementById("detail-release").textContent = film.release;
    document.getElementById("detail-writer").textContent = film.writer;
    document.getElementById("detail-director").textContent = film.director;
    document.getElementById("detail-description").textContent = film.description;
    document.getElementById("watchLink").href = film.link;
  }

  document.getElementById("returnBtn").addEventListener("click", () => {
    window.location.href = "library.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const storedUser = localStorage.getItem("loggedInUser");
  const usernameSpan = document.getElementById("username");

  if (storedUser && usernameSpan) {
    usernameSpan.textContent = storedUser;
  }
});

function viewDetails(filmId) {
  // Store the selected film ID in localStorage
  localStorage.setItem("selectedFilm", filmId);
  
  // Redirect to the details page
  window.location.href = "library-details.html";
}
