// Animate heading
document.addEventListener("DOMContentLoaded", () => {
  gsap.from("#page-title", { opacity: 0, y: -30, duration: 1, ease: "bounce.out" });
});

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const searchType = document.getElementById("searchType");
const searchResults = document.getElementById("searchResults");

const bloomoonList = document.getElementById("bloomoonList");
const globalList = document.getElementById("globalList");

// Load saved lists
let bloomoonWatchlist = JSON.parse(localStorage.getItem("bloomoonWatchlist")) || [];
let globalWatchlist = JSON.parse(localStorage.getItem("globalWatchlist")) || [];

// Display saved lists
function renderLists() {
  bloomoonList.innerHTML = bloomoonWatchlist.map(item => `
    <li><img src="${item.image}" alt="${item.title}" width="50"> ${item.title}</li>
  `).join("");

  globalList.innerHTML = globalWatchlist.map(item => `
    <li><img src="${item.image}" alt="${item.title}" width="50"> ${item.title}</li>
  `).join("");
}

renderLists();

// Handle search
searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  const type = searchType.value;
  searchResults.innerHTML = "";

  if (!query) {
    searchResults.innerHTML = "<p>Please enter a title to search.</p>";
    return;
  }

  if (type === "global") {
    // Jikan API for anime
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=5`);
    const data = await response.json();

    data.data.forEach(anime => {
      const card = document.createElement("section");
      card.classList.add("result-card");
      card.innerHTML = `
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        <h3>${anime.title}</h3>
        <button>Add to Global Watchlist</button>
      `;
      card.querySelector("button").addEventListener("click", () => {
        globalWatchlist.push({ title: anime.title, image: anime.images.jpg.image_url });
        localStorage.setItem("globalWatchlist", JSON.stringify(globalWatchlist));
        renderLists();
      });
      searchResults.appendChild(card);
    });
  } else {
    // Fake Bloomoon catalog
    const bloomoonData = [
      { title: "Moonlit Melodies", image: "images/moonlit.png" },
      { title: "Starfall Dreams", image: "images/starfall.png" },
      { title: "Petal Parade", image: "images/petal.png" }
    ];

    const results = bloomoonData.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
    if (results.length === 0) {
      searchResults.innerHTML = "<p>No Bloomoon titles found.</p>";
    } else {
      results.forEach(item => {
        const card = document.createElement("section");
        card.classList.add("result-card");
        card.innerHTML = `
          <img src="${item.image}" alt="${item.title}">
          <h3>${item.title}</h3>
          <button>Add to Bloomoon Watchlist</button>
        `;
        card.querySelector("button").addEventListener("click", () => {
          bloomoonWatchlist.push(item);
          localStorage.setItem("bloomoonWatchlist", JSON.stringify(bloomoonWatchlist));
          renderLists();
        });
        searchResults.appendChild(card);
      });
    }
  }
});
