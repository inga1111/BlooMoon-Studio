gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const logBtn = document.querySelector("#logBtn");
const popup = document.querySelector("#reviewPopup");
const closePopup = document.querySelector("#closePopup");
const reviewForm = document.querySelector("#reviewForm");
const diaryEntries = document.querySelector("#diaryEntries");


document.addEventListener("DOMContentLoaded", () => {
  loadEntries();

  
   gsap.timeline()
    .from("nav", { y: -60, opacity: 0, duration: 1, ease: "power3.out" })
    .from(".page-title", { opacity: 0, y: 30, duration: 1 }, "-=0.6");

logBtn.addEventListener("click", () => popup.style.display = "flex");


closePopup.addEventListener("click", () => popup.style.display = "none");


reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#title").value.trim();
  const rating = document.querySelector("#rating").value;
  const reviewText = document.querySelector("#reviewText").value.trim();

  if (!title || !rating || !reviewText) return alert("Please fill all fields");

  const newEntry = {
    title,
    rating,
    review: reviewText,
    date: new Date().toLocaleDateString(),
  };

  addEntryToDOM(newEntry);
  saveEntry(newEntry);
  reviewForm.reset();
  popup.style.display = "none";
});

function generateStars(num) {
  let starsHTML = "";
  for (let i = 1; i <= 5; i++) {
    starsHTML += `<span class="star ${i <= num ? "filled" : ""}">★</span>`;
  }
  return starsHTML;
}

function addEntryToDOM(entry) {
  const card = document.createElement("div");
  card.classList.add("entry");
  card.innerHTML = `
    <h3>${entry.title.toUpperCase()}</h3>
    <p><strong>Rating:</strong> ${generateStars(entry.rating)}</p>
    <p>"${entry.review}"</p>
    <p><em>${entry.date}</em></p>
    <button class="deleteBtn">Delete</button>
  `;

  card.querySelector(".deleteBtn").addEventListener("click", () => {
    card.remove();
    deleteEntry(entry.title);
  });

  diaryEntries.prepend(card);

  
  gsap.from(card, {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: "power2.out"
  });

  
  ScrollTrigger.create({
    trigger: card,
    start: "top 85%",
    animation: gsap.to(card, {opacity: 1, y: 0, duration: 1}),
  });
}

function saveEntry(entry) {
  const entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
  entries.push(entry);
  localStorage.setItem("diaryEntries", JSON.stringify(entries));
}

function loadEntries() {
  const entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
  entries.forEach(addEntryToDOM);
}

function deleteEntry(title) {
  let entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
  entries = entries.filter(entry => entry.title !== title);
  localStorage.setItem("diaryEntries", JSON.stringify(entries));
}

  gsap.from("#welcome-text", { opacity: 0, y: -20, duration: 1.4, ease: "power2.out" });
  gsap.to("#username", { color: "#e98ab2", repeat: -1, yoyo: true, duration: 2 });