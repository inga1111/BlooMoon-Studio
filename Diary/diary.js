// BLOOMOON DIARY SCRIPT WITH LOCALSTORAGE + EDIT/DELETE + GSAP

const reviewTypeRadios = document.querySelectorAll('input[name="reviewType"]');
const searchSection = document.getElementById('searchSection');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('search');
const form = document.getElementById('reviewForm');
const entries = document.getElementById('entries');

let selectedPoster = null;
let editIndex = null; // ✅ Track which entry is being edited

document.addEventListener('DOMContentLoaded', () => {
  loadEntriesFromStorage();
  animatePage();
});

// Show search only if reviewing global
reviewTypeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    searchSection.classList.toggle('hidden', radio.value !== 'global');
    selectedPoster = null;
  });
});

// API Search
searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (!query) return alert('Enter a title first.');

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
    const data = await res.json();
    if (data.data?.length) {
      selectedPoster = data.data[0].images.jpg.image_url;
      document.getElementById('title').value = data.data[0].title;
      return;
    }
  } catch {}

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=564727fa&t=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.Response === "True") {
      selectedPoster = data.Poster;
      document.getElementById('title').value = data.Title;
      return;
    }
  } catch {}

  alert("No results found.");
});

// FORM SUBMIT
form.addEventListener('submit', e => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const review = document.getElementById('review').value.trim();
  const rating = document.getElementById('rating').value.trim();
  const type = document.querySelector('input[name="reviewType"]:checked').value;

  const entryData = {
    title,
    review,
    rating,
    poster: selectedPoster || 'https://via.placeholder.com/90x130?text=Bloomoon',
    type,
    date: new Date().toLocaleDateString()
  };

  let diary = JSON.parse(localStorage.getItem('bloomoonDiary')) || [];

  // EDIT MODE
  if (editIndex !== null) {
    diary[editIndex] = entryData;
    editIndex = null;
  } else {
    diary.push(entryData);
  }

  localStorage.setItem('bloomoonDiary', JSON.stringify(diary));
  entries.innerHTML = "";
  diary.forEach(addEntryToPage);
  form.reset();
  selectedPoster = null;
  searchSection.classList.add('hidden');
});

// ADD ONE ENTRY TO PAGE
function addEntryToPage(entryData, index) {
  const entry = document.createElement('article');
  entry.classList.add('entry');

  entry.innerHTML = `
    <img src="${entryData.poster}">
    <section>
      <h3>${entryData.title}</h3>
      <p><strong>${entryData.type === 'bloomoon' ? 'Bloomoon Original' : 'Global Animation'}</strong></p>
      <p>⭐ ${entryData.rating}/5</p>
      <p>${entryData.review}</p>
      <p class="date">${entryData.date}</p>

      <div class="entry-actions">
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
    </section>
  `;

  entries.prepend(entry);
  animateEntry(entry);

  // Delete
  entry.querySelector('.delete-btn').addEventListener('click', () => {
    let diary = JSON.parse(localStorage.getItem('bloomoonDiary')) || [];
    diary.splice(index, 1);
    localStorage.setItem('bloomoonDiary', JSON.stringify(diary));
    entry.remove();
  });

  // Edit
  entry.querySelector('.edit-btn').addEventListener('click', () => {
    editIndex = index;
    document.getElementById('title').value = entryData.title;
    document.getElementById('review').value = entryData.review;
    document.getElementById('rating').value = entryData.rating;
    if (entryData.type === 'global') {
      selectedPoster = entryData.poster;
      document.querySelector('input[value="global"]').checked = true;
      searchSection.classList.remove('hidden');
    } else {
      document.querySelector('input[value="bloomoon"]').checked = true;
      searchSection.classList.add('hidden');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function loadEntriesFromStorage() {
  const savedEntries = JSON.parse(localStorage.getItem('bloomoonDiary')) || [];
  savedEntries.forEach(addEntryToPage);
}

/* ✨ GSAP ANIMATION */
function animatePage() {
  gsap.from("main", { opacity: 0, y: 30, duration: 1.4, ease: "power3.out" });
}
function animateEntry(entry) {
  gsap.from(entry, { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" });
}
