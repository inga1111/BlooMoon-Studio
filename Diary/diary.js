const logBtn = document.querySelector("#logBtn");
const popup = document.querySelector("#reviewPopup");
const closePopup = document.querySelector("#closePopup");
const reviewForm = document.querySelector("#reviewForm");
const diaryEntries = document.querySelector("#diaryEntries");

// Load entries when page opens
document.addEventListener("DOMContentLoaded", loadEntries);

// Show popup when "Log Review" is clicked
logBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

// Hide popup
closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

// Form submission
reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#title").value.trim();
  const rating = document.querySelector("#rating").value;
  const reviewText = document.querySelector("#reviewText").value.trim();

  if (!title || !rating || !reviewText) return alert("Please fill in all fields!");

  // Create review object
  const newEntry = {
    title: title,
    rating: rating,
    review: reviewText,
    date: new Date().toLocaleDateString(),
  };

  // Add entry to screen
  addEntryToDOM(newEntry);

  // Save to localStorage
  saveEntry(newEntry);

  // Reset form and close popup
  reviewForm.reset();
  popup.style.display = "none";
});

/* -----------------------------
    Functions below
------------------------------ */

// ⭐ Converts rating number into star icons
function generateStars(num) {
  const maxStars = 5;
  let starsHTML = "";
  for (let i = 1; i <= maxStars; i++) {
    if (i <= num) {
      starsHTML += `<span class="star filled">★</span>`;
    } else {
      starsHTML += `<span class="star">☆</span>`;
    }
  }
  return starsHTML;
}

// Function to display one entry
function addEntryToDOM(entry) {
  const card = document.createElement("div");
  card.classList.add("entry");
  card.innerHTML = `
    <h3>${entry.title.toUpperCase()}</h3>
    <p><strong>Rating:</strong> ${generateStars(entry.rating)}</p>
    <p>"${entry.review}"</p>
    <p><em>Logged on: ${entry.date}</em></p>
    <button class="deleteBtn">Delete</button>
  `;

  // Add delete button functionality
  card.querySelector(".deleteBtn").addEventListener("click", () => {
    card.remove();
    deleteEntry(entry.title);
  });

  // Add to top of diary
  diaryEntries.prepend(card);
}

// Function to save entries
function saveEntry(entry) {
  const entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
  entries.push(entry);
  localStorage.setItem("diaryEntries", JSON.stringify(entries));
}

// Function to load all entries
function loadEntries() {
  const entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
  entries.forEach((entry) => addEntryToDOM(entry));
}

// Function to delete an entry
function deleteEntry(title) {
  let entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
  entries = entries.filter((entry) => entry.title !== title);
  localStorage.setItem("diaryEntries", JSON.stringify(entries));
}
