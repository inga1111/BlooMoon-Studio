
document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signInBtn");
  const modal = document.getElementById("authModal");
  const closeModal = document.getElementById("closeModal");
  const toggleFormLink = document.getElementById("toggleForm");
  const formTitle = document.getElementById("formTitle");
  const formContainer = document.getElementById("formContainer");
  const signInForm = document.getElementById("signInForm");

  let isSignUp = false; 

 
  signInBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });


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

   
    document.getElementById("toggleForm").addEventListener("click", (e) => {
      e.preventDefault();
      toggleFormLink.click(); 
    });
  });

  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();

  
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

    localStorage.setItem("loggedInUser", username);

    window.location.href = "Library/library.html";
  } else {
    alert("Incorrect username or password.");
  }
}
});

  gsap.from("#bloomoon-logo", {
    duration: 1.5,
    y: -40,
    opacity: 0,
    ease: "bounce.out"
  });

  // FUN LOGO IMAGE ANIMATION (tv-image)
  const tv = document.querySelector('.tv-image');
  if (tv) {
    // entrance with a playful rotation
    gsap.from(tv, { duration: 1.1, scale: 0.85, opacity: 0, rotation: -10, ease: 'back.out(1.6)' });

    // gentle floating + slow rotation to give life
    gsap.to(tv, {
      y: -14,
      rotation: 6,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // hover interaction: pop & spin a little
    tv.addEventListener('mouseenter', () => {
      gsap.to(tv, { scale: 1.08, rotation: 12, duration: 0.35, ease: 'power2.out' });
    });
    tv.addEventListener('mouseleave', () => {
      gsap.to(tv, { scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.6)' });
    });
  }

  // subtle logo text pulse (letter-spacing + color) for playful effect
  gsap.to('#bloomoon-logo', {
    duration: 2.6,
    letterSpacing: '6px',
    color: '#ff6fb1',
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
});
