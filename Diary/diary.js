// BLOOMOON DIARY SCRIPT WITH LOCALSTORAGE + EDIT/DELETE + GSAP + ENHANCED INTERACTIONS

const reviewTypeRadios = document.querySelectorAll('input[name="reviewType"]');
const searchSection = document.getElementById('searchSection');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('search');
const form = document.getElementById('reviewForm');
const entries = document.getElementById('entries');
const entryCount = document.getElementById('entryCount');
const charCount = document.getElementById('charCount');
const reviewTextarea = document.getElementById('review');
const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('rating');

let selectedPoster = null;
let editIndex = null; // Track which entry is being edited

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadEntriesFromStorage();
  animatePage();
  setupEventListeners();
  updateEntryCount();
});

// Set up event listeners
function setupEventListeners() {
  // Review type radio buttons
  reviewTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      searchSection.classList.toggle('hidden', radio.value !== 'global');
      selectedPoster = null;
      animateSection(searchSection);
    });
  });

  // Character counter for review textarea
  reviewTextarea.addEventListener('input', () => {
    const count = reviewTextarea.value.length;
    charCount.textContent = count;
    
    // Change color when approaching limit
    if (count > 450) {
      charCount.style.color = '#ff6b6b';
    } else if (count > 400) {
      charCount.style.color = '#ffa500';
    } else {
      charCount.style.color = '#777';
    }
  });

  // Star rating interaction
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = star.getAttribute('data-rating');
      setRating(rating);
    });
    
    star.addEventListener('mouseover', () => {
      const rating = star.getAttribute('data-rating');
      highlightStars(rating);
    });
  });

  // Reset stars when mouse leaves the rating container
  document.querySelector('.star-rating').addEventListener('mouseleave', () => {
    const currentRating = ratingInput.value || 0;
    highlightStars(currentRating);
  });
}

// API Search
searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (!query) {
    showNotification('Enter a title first.', 'warning');
    return;
  }

  // Add loading animation to search button
  const originalText = searchBtn.innerHTML;
  searchBtn.innerHTML = '<span class="search-icon">⏳</span> Searching...';
  searchBtn.disabled = true;

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
    const data = await res.json();
    if (data.data?.length) {
      selectedPoster = data.data[0].images.jpg.image_url;
      document.getElementById('title').value = data.data[0].title;
      showNotification(`Found: ${data.data[0].title}`, 'success');
      resetSearchButton(originalText);
      return;
    }
  } catch (error) {
    console.error('Jikan API error:', error);
  }

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=564727fa&t=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.Response === "True") {
      selectedPoster = data.Poster;
      document.getElementById('title').value = data.Title;
      showNotification(`Found: ${data.Title}`, 'success');
      resetSearchButton(originalText);
      return;
    }
  } catch (error) {
    console.error('OMDb API error:', error);
  }

  showNotification("No results found.", 'error');
  resetSearchButton(originalText);
});

function resetSearchButton(originalText) {
  searchBtn.innerHTML = originalText;
  searchBtn.disabled = false;
}

// FORM SUBMIT
form.addEventListener('submit', e => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const review = document.getElementById('review').value.trim();
  const rating = document.getElementById('rating').value.trim();
  const type = document.querySelector('input[name="reviewType"]:checked').value;

  if (!title || !review || !rating) {
    showNotification('Please fill in all fields.', 'warning');
    return;
  }

  const entryData = {
    title,
    review,
    rating,
    poster: selectedPoster || 'https://via.placeholder.com/90x130?text=Bloomoon',
    type,
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };

  let diary = JSON.parse(localStorage.getItem('bloomoonDiary')) || [];

  // EDIT MODE
  if (editIndex !== null) {
    diary[editIndex] = entryData;
    editIndex = null;
    showNotification('Entry updated successfully!', 'success');
  } else {
    diary.push(entryData);
    showNotification('New entry added to your diary!', 'success');
  }

  localStorage.setItem('bloomoonDiary', JSON.stringify(diary));
  entries.innerHTML = "";
  diary.forEach(addEntryToPage);
  form.reset();
  setRating(0); // Reset stars
  selectedPoster = null;
  searchSection.classList.add('hidden');
  updateEntryCount();
  
  // Animate the diary section to draw attention
  animateSection(document.querySelector('.diary-library'));
});

// ADD ONE ENTRY TO PAGE
function addEntryToPage(entryData, index) {
  const entry = document.createElement('article');
  entry.classList.add('entry');

  entry.innerHTML = `
    <img src="${entryData.poster}" alt="${entryData.title} poster">
    <section>
      <h3>${entryData.title}</h3>
      <p><strong>${entryData.type === 'bloomoon' ? 'Bloomoon Original' : 'Global Animation'}</strong></p>
      <p>${generateStarRating(entryData.rating)}</p>
      <p>${entryData.review}</p>
      <p class="date">${entryData.date}</p>

      <div class="entry-actions">
        <button class="edit-btn" data-index="${index}">
          <span class="btn-icon">✏️</span> Edit
        </button>
        <button class="delete-btn" data-index="${index}">
          <span class="btn-icon">🗑️</span> Delete
        </button>
      </div>
    </section>
  `;

  entries.prepend(entry);
  animateEntry(entry);

  // Delete functionality
  entry.querySelector('.delete-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Animation before deletion
    gsap.to(entry, {
      duration: 0.3,
      scale: 0.9,
      opacity: 0,
      onComplete: () => {
        let diary = JSON.parse(localStorage.getItem('bloomoonDiary')) || [];
        diary.splice(index, 1);
        localStorage.setItem('bloomoonDiary', JSON.stringify(diary));
        entry.remove();
        updateEntryCount();
        showNotification('Entry deleted.', 'info');
      }
    });
  });

  // Edit functionality
  entry.querySelector('.edit-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    editIndex = index;
    document.getElementById('title').value = entryData.title;
    document.getElementById('review').value = entryData.review;
    setRating(entryData.rating);
    
    if (entryData.type === 'global') {
      selectedPoster = entryData.poster;
      document.querySelector('input[value="global"]').checked = true;
      searchSection.classList.remove('hidden');
    } else {
      document.querySelector('input[value="bloomoon"]').checked = true;
      searchSection.classList.add('hidden');
    }
    
    // Scroll to form with animation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Highlight the form section
    const formSection = document.querySelector('.review-log');
    gsap.to(formSection, {
      duration: 0.5,
      boxShadow: '0 0 0 3px rgba(241, 79, 168, 0.5)',
      yoyo: true,
      repeat: 1
    });
    
    showNotification('Editing entry...', 'info');
  });

  // Entry click effect
  entry.addEventListener('click', () => {
    gsap.to(entry, {
      duration: 0.2,
      scale: 0.98,
      yoyo: true,
      repeat: 1
    });
  });
}

// Generate star rating display
function generateStarRating(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '★';
    } else {
      stars += '☆';
    }
  }
  return stars;
}

// Set star rating
function setRating(rating) {
  ratingInput.value = rating;
  highlightStars(rating);
}

// Highlight stars based on rating
function highlightStars(rating) {
  stars.forEach(star => {
    if (star.getAttribute('data-rating') <= rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

function loadEntriesFromStorage() {
  const savedEntries = JSON.parse(localStorage.getItem('bloomoonDiary')) || [];
  savedEntries.forEach(addEntryToPage);
}

function updateEntryCount() {
  const count = document.querySelectorAll('.entry').length;
  entryCount.textContent = `${count} ${count === 1 ? 'entry' : 'entries'}`;
  
  // Animate the count change
  gsap.to(entryCount, {
    duration: 0.3,
    scale: 1.2,
    yoyo: true,
    repeat: 1
  });
}

// Show notification
function showNotification(message, type) {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles for notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  // Set background color based on type
  if (type === 'success') {
    notification.style.backgroundColor = '#4caf50';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#f44336';
  } else if (type === 'warning') {
    notification.style.backgroundColor = '#ff9800';
  } else {
    notification.style.backgroundColor = '#2196f3';
  }
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Animate out after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

/* GSAP ANIMATIONS */
function animatePage() {
  // Animate navigation
  gsap.from("nav", { 
    duration: 1, 
    y: -50, 
    opacity: 0, 
    ease: "power3.out" 
  });
  
  // Animate main content with staggered children
  gsap.from(".diary-container > *", { 
    duration: 1, 
    y: 30, 
    opacity: 0, 
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.5
  });
}

function animateEntry(entry) {
  gsap.from(entry, { 
    duration: 0.8, 
    y: 20, 
    opacity: 0, 
    scale: 0.9,
    ease: "back.out(1.7)" 
  });
}

function animateSection(section) {
  gsap.to(section, {
    duration: 0.5,
    y: -10,
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    yoyo: true,
    repeat: 1
  });
}