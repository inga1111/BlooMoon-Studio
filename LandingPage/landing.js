// -------------------------
// 🌙 BLOOMOON LANDING PAGE SCRIPT
// -------------------------

// 1️⃣ GSAP Logo Animation
gsap.from("#bloomoon-logo", {
  y: -50,
  duration: 1.2,
  ease: "bounce.out",
  opacity: 0
});

// 2️⃣ Select Key Elements
const modal = document.getElementById("authModal");
const signInBtn = document.getElementById("signInBtn");
const closeModal = document.getElementById("closeModal");
const toggleForm = document.getElementById("toggleForm");
const formTitle = document.getElementById("formTitle");
const formContainer = document.getElementById("formContainer");
let isSignUp = false;

// Open modal
signInBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Close modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal if you click outside it
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// 3️⃣ Form Toggle (Switch between Sign-In and Sign-Up)
toggleForm.addEventListener("click", (e) => {
  e.preventDefault();
  isSignUp = !isSignUp;

  if (isSignUp) {
    formTitle.textContent = "Create Account";
    formContainer.innerHTML = `
      <h2 id="formTitle">Create Account</h2>
      <form id="authForm">
        <label>Create Username</label>
        <input type="text" id="newUsername" placeholder="Enter a username" required>

        <label>Create Password</label>
        <input type="password" id="newPassword" placeholder="Enter a password" required>

        <label>Confirm Password</label>
        <input type="password" id="confirmPassword" placeholder="Confirm password" required>

        <p id="feedbackMsg"></p>
        <button type="submit" class="form-btn">Sign Up</button>
      </form>
      <p class="toggle-text">Already have an account? <a href="#" id="toggleForm">Log in</a></p>
    `;
  } else {
    formTitle.textContent = "Sign In";
    formContainer.innerHTML = `
      <h2 id="formTitle">Sign In</h2>
      <form id="authForm">
        <label>Username</label>
        <input type="text" id="username" placeholder="Your username" required>

        <label>Password</label>
        <input type="password" id="password" placeholder="Your password" required>

        <p id="feedbackMsg"></p>
        <button type="submit" class="form-btn">Log In</button>
      </form>
      <p class="toggle-text">Don’t have an account? <a href="#" id="toggleForm">Create one</a></p>
    `;
  }

  // Reattach validation logic every time the form changes
  attachValidation();
});

// 4️⃣ Validation Logic
function attachValidation() {
  const form = document.getElementById("authForm");
  const feedback = document.getElementById("feedbackMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page refresh
    feedback.textContent = ""; // reset old messages

    if (isSignUp) {
      const username = document.getElementById("newUsername").value.trim();
      const pass1 = document.getElementById("newPassword").value;
      const pass2 = document.getElementById("confirmPassword").value;

      if (username === "" || pass1 === "" || pass2 === "") {
        feedback.textContent = "Please fill in all fields 🌙";
        feedback.style.color = "red";
      } else if (pass1.length < 6) {
        feedback.textContent = "Password must be at least 6 characters.";
        feedback.style.color = "red";
      } else if (pass1 !== pass2) {
        feedback.textContent = "Passwords don’t match 💔";
        feedback.style.color = "red";
      } else {
        feedback.textContent = "Account created successfully 🌸";
        feedback.style.color = "green";
        form.reset();
        setTimeout(() => {
          modal.style.display = "none";
        }, 1000);
      }
    } else {
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      if (username === "" || password === "") {
        feedback.textContent = "Please enter both username and password 🌙";
        feedback.style.color = "red";
      } else {
        feedback.textContent = "Welcome back to Bloomoon 🌷";
        feedback.style.color = "green";
        form.reset();
        setTimeout(() => {
          window.location.href = "library.html"; // redirect to next page
        }, 1000);
      }
    }
  });
}

// Initialize once when page loads
attachValidation();
