
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
let editIndex = null; 


document.addEventListener('DOMContentLoaded', () => {
  loadEntriesFromStorage();
  setupEventListeners();
  updateEntryCount();
});


function setupEventListeners() {
  
  reviewTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      searchSection.classList.toggle('hidden', radio.value !== 'global');
      selectedPoster = null;
    });
  });


  const toggleButtons = document.querySelectorAll('.toggle-btn');
  if (toggleButtons.length) {
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        toggleButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const value = btn.dataset.value;
        const radio = document.querySelector(`input[name="reviewType"][value="${value}"]`);
        if (radio) radio.checked = true;

        searchSection.classList.toggle('hidden', value !== 'global');
        selectedPoster = null;
      });
    });

    
    const checked = document.querySelector('input[name="reviewType"]:checked');
    if (checked) {
      const btn = document.querySelector(`.toggle-btn[data-value="${checked.value}"]`);
      if (btn) {
        toggleButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
        searchSection.classList.toggle('hidden', checked.value !== 'global');
      }
    }
  }

  reviewTextarea.addEventListener('input', () => {
    const count = reviewTextarea.value.length;
    charCount.textContent = count;
    
    
    if (count > 450) {
      charCount.style.color = '#ff6b6b';
    } else if (count > 400) {
      charCount.style.color = '#ffa500';
    } else {
      charCount.style.color = '#777';
    }
  });

  
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

  document.querySelector('.star-rating').addEventListener('mouseleave', () => {
    const currentRating = ratingInput.value || 0;
    highlightStars(currentRating);
  });
}


searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (!query) {
    showNotification('Enter a title first.', 'warning');
    return;
  }

  
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
});


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

  
  entry.querySelector('.delete-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    
    let diary = JSON.parse(localStorage.getItem('bloomoonDiary')) || [];
    diary.splice(index, 1);
    localStorage.setItem('bloomoonDiary', JSON.stringify(diary));
    entry.remove();
    updateEntryCount();
    showNotification('Entry deleted.', 'info');
  });

 
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
    
   
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showNotification('Editing entry...', 'info');
  });
}


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

function setRating(rating) {
  ratingInput.value = rating;
  highlightStars(rating);
}


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
}


function showNotification(message, type) {
  
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}