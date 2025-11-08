document.addEventListener("DOMContentLoaded", () => {
  console.log("Profile page loaded");
  
  // Show the body immediately to prevent flash
  document.body.classList.add('loaded');
  
  // Initialize the page
  initProfilePage();
  
  // Set up all event listeners
  setupEventListeners();
  
  // Load user data
  loadUserData();
});

function initProfilePage() {
  console.log("Initializing profile page");
  
  // Initialize empty favorites grid
  renderFavoritesGrid();
}

function setupEventListeners() {
  console.log("Setting up event listeners");
  
  // Profile picture upload
  const profilePic = document.getElementById("profile-pic");
  const uploadInput = document.getElementById("upload-pic");
  
  if (profilePic && uploadInput) {
    profilePic.addEventListener("click", () => {
      console.log("Profile picture clicked");
      uploadInput.click();
    });
    
    uploadInput.addEventListener("change", handleProfilePicUpload);
  }

  // Log Review button
  const logReviewBtn = document.getElementById("log-review-btn");
  if (logReviewBtn) {
    logReviewBtn.addEventListener("click", () => {
      console.log("Log review button clicked");
      window.location.href = "../Diary/diary.html";
    });
  }

  // Add Favorite button
  const addFavBtn = document.getElementById("add-fav-btn");
  if (addFavBtn) {
    addFavBtn.addEventListener("click", openFavModal);
  }

  // Log Out button
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  // Modal functionality
  const favSearchBtn = document.getElementById("fav-search-btn");
  if (favSearchBtn) {
    favSearchBtn.addEventListener("click", searchAnimations);
  }
  
  const favCloseBtn = document.getElementById("fav-close");
  if (favCloseBtn) {
    favCloseBtn.addEventListener("click", closeFavModal);
  }
  
  const closeModalBtn = document.querySelector(".close-modal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeFavModal);
  }
  
  // Close modal when clicking outside
  const favModal = document.getElementById("fav-modal");
  if (favModal) {
    favModal.addEventListener("click", (e) => {
      if (e.target.id === "fav-modal") {
        closeFavModal();
      }
    });
  }
  
  // Save favorite Bloomoon work on input
  const favBloomoon = document.getElementById("fav-bloomoon");
  if (favBloomoon) {
    favBloomoon.addEventListener("input", (e) => {
      localStorage.setItem("favoriteBloomoonWork", e.target.value);
    });
  }
  
  // Allow Enter key to trigger search
  const favSearch = document.getElementById("fav-search");
  if (favSearch) {
    favSearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchAnimations();
      }
    });
  }
}

function handleProfilePicUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const profilePic = document.getElementById("profile-pic");
      profilePic.src = reader.result;
      localStorage.setItem("profilePic", reader.result);
      showNotification("Profile picture updated!", "success");
    };
    reader.readAsDataURL(file);
  }
}

function openFavModal() {
  console.log("Opening favorite modal");
  const modal = document.getElementById("fav-modal");
  if (modal) {
    modal.classList.add("active");
    modal.classList.remove("hidden");
    
    // Clear previous search results
    const resultsContainer = document.getElementById("fav-search-results");
    if (resultsContainer) {
      resultsContainer.innerHTML = "";
    }
    
    const searchInput = document.getElementById("fav-search");
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
  }
}

function closeFavModal() {
  console.log("Closing favorite modal");
  const modal = document.getElementById("fav-modal");
  if (modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }
}

async function searchAnimations() {
  const query = document.getElementById("fav-search").value.trim();
  if (!query) {
    showNotification("Please enter a search term", "error");
    return;
  }
  
  const resultsContainer = document.getElementById("fav-search-results");
  if (!resultsContainer) return;
  
  resultsContainer.innerHTML = "<p>Searching...</p>";
  
  try {
    // Try Jikan API for anime
    console.log("Searching for:", query);
    const jikanResponse = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`);
    const jikanData = await jikanResponse.json();
    
    if (jikanData.data && jikanData.data.length > 0) {
      console.log("Found anime results:", jikanData.data.length);
      displaySearchResults(jikanData.data, 'anime');
      return;
    }
    
    // Try OMDB API for movies
    const omdbResponse = await fetch(`https://www.omdbapi.com/?apikey=564727fa&s=${encodeURIComponent(query)}&type=movie`);
    const omdbData = await omdbResponse.json();
    
    if (omdbData.Response === "True" && omdbData.Search && omdbData.Search.length > 0) {
      console.log("Found movie results:", omdbData.Search.length);
      // Get full details for each movie
      const detailedResults = await Promise.all(
        omdbData.Search.slice(0, 5).map(async (movie) => {
          const detailResponse = await fetch(`https://www.omdbapi.com/?apikey=564727fa&i=${movie.imdbID}`);
          return await detailResponse.json();
        })
      );
      
      displaySearchResults(detailedResults, 'movie');
      return;
    }
    
    resultsContainer.innerHTML = "<p>No results found. Try a different search term.</p>";
  } catch (error) {
    console.error("Search error:", error);
    resultsContainer.innerHTML = "<p>Error searching. Please try again.</p>";
  }
}

function displaySearchResults(results, type) {
  const resultsContainer = document.getElementById("fav-search-results");
  if (!resultsContainer) return;
  
  resultsContainer.innerHTML = "";
  
  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
    return;
  }
  
  results.forEach(item => {
    const resultItem = document.createElement("div");
    resultItem.className = "search-result-item";
    
    const title = type === 'anime' ? item.title : item.Title;
    const year = type === 'anime' ? item.year : item.Year;
    const image = type === 'anime' ? 
      (item.images?.jpg?.image_url || '../images/default-poster.png') : 
      (item.Poster !== 'N/A' ? item.Poster : '../images/default-poster.png');
    
    resultItem.innerHTML = `
      <img src="${image}" alt="${title}" onerror="this.src='../images/default-poster.png'">
      <div class="search-result-info">
        <div class="search-result-title">${title}</div>
        <div class="search-result-year">${year || 'Unknown year'}</div>
      </div>
    `;
    
    resultItem.addEventListener("click", () => {
      addToFavorites({
        title: title,
        year: year,
        image: image,
        type: type
      });
    });
    
    resultsContainer.appendChild(resultItem);
  });
}

function addToFavorites(animation) {
  // Get current favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem("userFavorites")) || [];
  
  // Check if already in favorites
  const exists = favorites.some(fav => fav.title === animation.title);
  if (exists) {
    showNotification("This animation is already in your favorites!", "error");
    return;
  }
  
  // Check if we have space (max 4)
  if (favorites.length >= 4) {
    showNotification("You can only have 4 favorites. Remove one to add another.", "error");
    return;
  }
  
  // Add to favorites
  favorites.push(animation);
  localStorage.setItem("userFavorites", JSON.stringify(favorites));
  
  // Update the grid
  renderFavoritesGrid();
  
  // Close modal and show success message
  closeFavModal();
  showNotification("Animation added to favorites!", "success");
}

function removeFromFavorite(index) {
  let favorites = JSON.parse(localStorage.getItem("userFavorites")) || [];
  
  if (index >= 0 && index < favorites.length) {
    const removedTitle = favorites[index].title;
    favorites.splice(index, 1);
    localStorage.setItem("userFavorites", JSON.stringify(favorites));
    renderFavoritesGrid();
    showNotification(`"${removedTitle}" removed from favorites`, "info");
  }
}

function renderFavoritesGrid() {
  const grid = document.getElementById("film-grid");
  if (!grid) return;
  
  grid.innerHTML = "";
  
  let favorites = JSON.parse(localStorage.getItem("userFavorites")) || [];
  
  console.log("Rendering favorites:", favorites);
  
  // Render existing favorites
  favorites.forEach((fav, index) => {
    const filmItem = document.createElement("div");
    filmItem.className = "film-item";
    filmItem.innerHTML = `
      <img src="${fav.image}" alt="${fav.title}" onerror="this.src='../images/default-poster.png'">
      <button class="remove-btn" data-index="${index}">×</button>
    `;
    
    // Add remove functionality
    const removeBtn = filmItem.querySelector(".remove-btn");
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFromFavorite(index);
    });
    
    grid.appendChild(filmItem);
  });
  
  // Add empty slots if needed
  const emptySlots = 4 - favorites.length;
  for (let i = 0; i < emptySlots; i++) {
    const emptySlot = document.createElement("div");
    emptySlot.className = "empty-slot";
    emptySlot.textContent = "Empty Slot";
    emptySlot.addEventListener("click", openFavModal);
    grid.appendChild(emptySlot);
  }
  
  // Animate the grid after rendering
  animatePageLoad();
}

function handleLogout() {
  if (confirm("Are you sure you want to log out? 🌙")) {
    localStorage.removeItem("bloomoonUser");
    window.location.href = "../index.html";
  }
}

function loadUserData() {
  console.log("Loading user data");
  
  // Load username
  const storedUser = JSON.parse(localStorage.getItem("bloomoonUser"));
  const usernameElement = document.getElementById("username");
  if (storedUser && usernameElement) {
    usernameElement.textContent = storedUser.username || "Bloomoon User";
  }
  
  // Load profile picture
  const savedPic = localStorage.getItem("profilePic");
  if (savedPic) {
    const profilePic = document.getElementById("profile-pic");
    if (profilePic) {
      profilePic.src = savedPic;
    }
  }
  
  // Load favorite Bloomoon work
  const savedBloomoonWork = localStorage.getItem("favoriteBloomoonWork");
  if (savedBloomoonWork) {
    const favBloomoon = document.getElementById("fav-bloomoon");
    if (favBloomoon) {
      favBloomoon.value = savedBloomoonWork;
    }
  }
  
  // Load initial favorites if none exist (for demo)
  const favorites = JSON.parse(localStorage.getItem("userFavorites")) || [];
  if (favorites.length === 0) {
    // Add some default favorites for demo
    const defaultFavorites = [
      {
        title: "Spirited Away",
        year: "2001",
        image: "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
        type: "movie"
      }
    ];
    localStorage.setItem("userFavorites", JSON.stringify(defaultFavorites));
  }
}

function showNotification(message, type) {
  const notification = document.getElementById("notification");
  if (!notification) return;
  
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add("show");
  
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

function animatePageLoad() {
  // Use GSAP for animations if available
  if (typeof gsap !== 'undefined') {
    // Animate the profile container elements
    gsap.to(".profile-container > *", {
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    });
    
    // Specific animations for different elements
    gsap.fromTo(".profile-pic-container", 
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.2 }
    );
    
    gsap.fromTo(".favorites, .bloomoon-favorite", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, delay: 0.3 }
    );
    
    gsap.fromTo(".action-btn, .logout-btn", 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.5 }
    );
    
    // Animate film grid items
    gsap.fromTo(".film-item, .empty-slot", 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.7 }
    );
  } else {
    // Fallback if GSAP is not available
    const elements = document.querySelectorAll('.profile-container > *');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transition = 'opacity 0.5s, transform 0.5s';
      }, 100 * index);
    });
  }
}