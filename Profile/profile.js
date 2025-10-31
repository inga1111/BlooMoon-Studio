document.addEventListener("DOMContentLoaded", () => {
  // Retrieve username from localStorage
  const storedUser = JSON.parse(localStorage.getItem("bloomoonUser"));
  const usernameElement = document.getElementById("username");
  if (storedUser) usernameElement.textContent = storedUser.username;

  // Profile picture upload
  const profilePic = document.getElementById("profile-pic");
  const uploadInput = document.getElementById("upload-pic");

  const savedPic = localStorage.getItem("profilePic");
  if (savedPic) profilePic.src = savedPic;

  uploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        profilePic.src = reader.result;
        localStorage.setItem("profilePic", reader.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // Log Out button
  document.getElementById("logout-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to log out? 🌙")) {
      localStorage.removeItem("bloomoonUser");
      window.location.href = "../index.html";
    }
  });

  // Toggle followers/following lists
  const followingBtn = document.getElementById("following-btn");
  const followersBtn = document.getElementById("followers-btn");
  const followingList = document.getElementById("following-list");
  const followersList = document.getElementById("followers-list");

  followingBtn.addEventListener("click", () => {
    followingList.classList.toggle("hidden");
    followersList.classList.add("hidden");
  });

  followersBtn.addEventListener("click", () => {
    followersList.classList.toggle("hidden");
    followingList.classList.add("hidden");
  });

  // Dummy data (you can later connect this to your own database)
  const sampleFollowers = ["lunalovesfilm", "star_dreamer", "miyazaki_muse"];
  const sampleFollowing = ["ghibliheart", "animationangel", "artbybloom"];

  const followersUl = document.getElementById("followers-users");
  const followingUl = document.getElementById("following-users");

  sampleFollowers.forEach(u => {
    const li = document.createElement("li");
    li.textContent = u;
    followersUl.appendChild(li);
  });

  sampleFollowing.forEach(u => {
    const li = document.createElement("li");
    li.textContent = u;
    followingUl.appendChild(li);
  });

  // Fetch top Studio Ghibli films for “favorites”
  fetch("https://ghibliapi.vercel.app/films")
    .then(res => res.json())
    .then(films => {
      const topFour = films.slice(0, 4);
      const grid = document.getElementById("film-grid");
      topFour.forEach(film => {
        const img = document.createElement("img");
        img.src = film.image;
        img.alt = film.title;
        grid.appendChild(img);
      });
    });

  // Animate page load
  gsap.from(".profile-pic-container", { opacity: 0, y: -20, duration: 1 });
  gsap.from(".film-grid img", { opacity: 0, stagger: 0.2, duration: 1, y: 30, delay: 0.5 });
});
