const logBtn = document.querySelector("#logBtn");
const popup = document.querySelector("#reviewPopup");
const closePopup = document.querySelector("#closePopup");
const reviewForm = document.querySelector("#reviewForm");
const diaryEntries = document.querySelector("#diaryEntries");

// Show popup when "Log Review" button is clicked
logBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

// Hide popup when the close button is clicked
closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

// When user submits the form
reviewForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent reload

  // Get values from form
  const title = document.querySelector("#title").value;
  const rating = document.querySelector("#rating").value;
  const reviewText = document.querySelector("#reviewText").value;

  // Create new entry card
  const entry = document.createElement("div");
  entry.classList.add("entry");
  entry.innerHTML = `
    <h3>${title.toUpperCase()}</h3>
    <p><strong>Rating:</strong> ${rating} Stars</p>
    <p>"${reviewText}"</p>
    <p><em>Logged on: ${new Date().toLocaleDateString()}</em></p>
  `;

  // Add entry to diary
  diaryEntries.prepend(entry); // new entries appear first

  // Clear form and close popup
  reviewForm.reset();
  popup.style.display = "none";
});
