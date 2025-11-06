document.addEventListener("DOMContentLoaded", () => {
  const usernameSpan = document.getElementById("username");
  const storedUser = localStorage.getItem("loggedInUser");

  if (storedUser) usernameSpan.textContent = storedUser;

  // Animate welcome message
  gsap.from("#welcome-text", { opacity: 0, y: -20, duration: 1.4, ease: "power2.out" });
  gsap.to("#username", { color: "#e98ab2", repeat: -1, yoyo: true, duration: 2 });

  // Film details logic
  document.querySelectorAll(".film-poster").forEach(poster => {
    poster.addEventListener("click", () => {
      const data = poster.dataset;
      localStorage.setItem("selectedFilm", JSON.stringify(data));
      window.location.href = "library-details.html";
    });
  });
});

  gsap.timeline()
    .from("nav", { y: -60, opacity: 0, duration: 1, ease: "power3.out" })
    .from(".page-title", { opacity: 0, y: 30, duration: 1 }, "-=0.6");