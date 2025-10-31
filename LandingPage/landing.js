// LANDING PAGE INTERACTIVITY & LOGIN REDIRECT

// Wait for DOM to load before running code
document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signInBtn");
  const modal = document.getElementById("authModal");
  const closeModal = document.getElementById("closeModal");
  const toggleFormLink = document.getElementById("toggleForm");
  const formTitle = document.getElementById("formTitle");
  const formContainer = document.getElementById("formContainer");
  const signInForm = document.getElementById("signInForm");

  let isSignUp = false; // keeps track if user is signing up or signing in

  // 🌙 Open modal when "Sign-In" button is clicked
  signInBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // 🌙 Close modal when X is clicked
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // 🌙 Toggle between Sign In and Sign Up forms
  toggleFormLink.addEventListener("click", (e) => {
    e.preventDefault();
    isSignUp = !isSignUp;

    if (isSignUp) {
      formTitle.textContent = "Create Account";
      signInForm.innerHTML = `
        <label>Username</label>
        <input type="text" id="newUsername" required>

        <label>Create Password</label>
        <input type="password" id="newPassword" required>

        <button type="submit" class="form-btn">Sign Up</button>
      `;
      document.querySelector(".toggle-text").innerHTML =
        `Already have an account? <a href="#" id="toggleForm">Log in</a>`;
    } else {
      formTitle.textContent = "Sign In";
      signInForm.innerHTML = `
        <label>Username</label>
        <input type="text" id="username" required>

        <label>Password</label>
        <input type="password" id="password" required>

        <button type="submit" class="form-btn">Log In</button>
      `;
      document.querySelector(".toggle-text").innerHTML =
        `Don’t have an account? <a href="#" id="toggleForm">Create one</a>`;
    }

    // Reattach toggle listener after we overwrite innerHTML
    document.getElementById("toggleForm").addEventListener("click", (e) => {
      e.preventDefault();
      toggleFormLink.click(); // reuse toggle logic
    });
  });

  // 🌙 Handle form submission (login OR signup)
  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // We’ll use localStorage to store fake user accounts (just for testing)
    if (isSignUp) {
      const username = document.getElementById("newUsername").value;
      const password = document.getElementById("newPassword").value;

      if (username && password) {
        localStorage.setItem("bloomoonUser", JSON.stringify({ username, password }));
        alert("Account created successfully! You can now log in.");
        isSignUp = false;
        formTitle.textContent = "Sign In";
        signInForm.innerHTML = `
          <label>Username</label>
          <input type="text" id="username" required>

          <label>Password</label>
          <input type="password" id="password" required>

          <button type="submit" class="form-btn">Log In</button>
        `;
      }
  } else {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const storedUser = JSON.parse(localStorage.getItem("bloomoonUser"));

  if (storedUser && storedUser.username === username && storedUser.password === password) {
    alert(`Welcome back, ${username}! 🌙`);

    // 🌸 Save the logged-in username so we can use it in library.html
    localStorage.setItem("loggedInUser", username);

    // ✅ Redirect user to library.html after successful login
    window.location.href = "Library/library.html";
  } else {
    alert("Incorrect username or password.");
  }
}
});


  // 🌙 Small GSAP animation for the "BLOOMOON" logo
  gsap.from("#bloomoon-logo", {
    duration: 1.5,
    y: -40,
    opacity: 0,
    ease: "bounce.out"
  });
});
