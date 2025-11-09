
document.addEventListener("DOMContentLoaded", () => {
  
  gsap.from("#welcome-text", { 
    opacity: 0, 
    y: -20, 
    duration: 1.4, 
    ease: "power2.out" 
  });
  
  
  gsap.timeline()
    .from("nav", { y: -60, opacity: 0, duration: 1, ease: "power3.out" })
    .from(".search-bar", { opacity: 0, y: 30, duration: 1 }, "-=0.6");
  
  
  renderLists();
});


const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const searchType = document.getElementById("searchType");
const searchResults = document.getElementById("searchResults");
const bloomoonList = document.getElementById("bloomoonList");
const globalList = document.getElementById("globalList");


let bloomoonWatchlist = JSON.parse(localStorage.getItem("bloomoonWatchlist")) || [];
let globalWatchlist = JSON.parse(localStorage.getItem("globalWatchlist")) || [];

// Small transient notification helper
function showNotification(message) {
  let notif = document.getElementById('wl-notification');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'wl-notification';
    document.body.appendChild(notif);
  }
  notif.textContent = message;
  notif.classList.add('show');
  // hide after 2.2s
  clearTimeout(notif._hideTimer);
  notif._hideTimer = setTimeout(() => {
    notif.classList.remove('show');
  }, 2200);
}


function renderLists() {
  
  if (bloomoonWatchlist.length > 0) {
    bloomoonList.innerHTML = bloomoonWatchlist.map((item, index) => `
      <li>
        <div class="movie-info">
          <img src="${item.image}" alt="${item.title}">
          <span class="movie-title">${item.title}</span>
        </div>
        <button class="delete-btn" data-index="${index}" data-type="bloomoon">×</button>
      </li>
    `).join("");
  } else {
    bloomoonList.innerHTML = '<li class="empty-message">Your Bloomoon watchlist is empty</li>';
  }

  
  if (globalWatchlist.length > 0) {
    globalList.innerHTML = globalWatchlist.map((item, index) => `
      <li>
        <div class="movie-info">
          <img src="${item.image}" alt="${item.title}">
          <span class="movie-title">${item.title}</span>
        </div>
        <button class="delete-btn" data-index="${index}" data-type="global">×</button>
      </li>
    `).join("");
  } else {
    globalList.innerHTML = '<li class="empty-message">Your Global watchlist is empty</li>';
  }

  
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      const type = e.target.dataset.type;
      
      if (type === 'bloomoon') {
        bloomoonWatchlist.splice(index, 1);
        localStorage.setItem("bloomoonWatchlist", JSON.stringify(bloomoonWatchlist));
      } else {
        globalWatchlist.splice(index, 1);
        localStorage.setItem("globalWatchlist", JSON.stringify(globalWatchlist));
      }
      
      renderLists();
    });
  });
}


searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  const type = searchType.value;
  searchResults.innerHTML = "";

  if (!query) {
    searchResults.innerHTML = "<p class='empty-message'>Please enter a title to search.</p>";
    return;
  }

  if (type === "global") {
    
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=5`);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        data.data.forEach(anime => {
          const card = document.createElement("div");
          card.classList.add("result-card");
          card.innerHTML = `
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <h3>${anime.title}</h3>
            <button>Add to Global Watchlist</button>
          `;
          card.querySelector("button").addEventListener("click", () => {
            
            const exists = globalWatchlist.some(item => item.title === anime.title);
            if (!exists) {
              globalWatchlist.push({ 
                title: anime.title, 
                image: anime.images.jpg.image_url 
              });
              localStorage.setItem("globalWatchlist", JSON.stringify(globalWatchlist));
              renderLists();
              
              
              gsap.from(card, {
                scale: 0.8,
                duration: 0.5,
                ease: "back.out(1.7)"
              });
                // notify user and close search results
                showNotification('Added to Global Watchlist');
                searchResults.innerHTML = '';
            } else {
              alert("This title is already in your Global Watchlist!");
            }
          });
          searchResults.appendChild(card);
        });
      } else {
        searchResults.innerHTML = "<p class='empty-message'>No results found.</p>";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      searchResults.innerHTML = "<p class='empty-message'>Error fetching data. Please try again.</p>";
    }
  } else {
    
    const bloomoonData = [
      { title: "Moonlit Melodies", image: "https://via.placeholder.com/150x200/8ba15c/ffffff?text=Moonlit+Melodies" },
      { title: "Starfall Dreams", image: "https://via.placeholder.com/150x200/4f8a8b/ffffff?text=Starfall+Dreams" },
      { title: "Petal Parade", image: "https://via.placeholder.com/150x200/e98ab2/ffffff?text=Petal+Parade" },
      { title: "Whispering Woods", image: "https://via.placeholder.com/150x200/c4d69c/ffffff?text=Whispering+Woods" },
      { title: "Crystal Chronicles", image: "https://via.placeholder.com/150x200/a7b67a/ffffff?text=Crystal+Chronicles" }
    ];

    const results = bloomoonData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    
    if (results.length === 0) {
      searchResults.innerHTML = "<p class='empty-message'>No Bloomoon titles found.</p>";
    } else {
      results.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("result-card");
        card.innerHTML = `
          <img src="${item.image}" alt="${item.title}">
          <h3>${item.title}</h3>
          <button>Add to Bloomoon Watchlist</button>
        `;
        card.querySelector("button").addEventListener("click", () => {
         
          const exists = bloomoonWatchlist.some(watchItem => watchItem.title === item.title);
          if (!exists) {
            bloomoonWatchlist.push(item);
            localStorage.setItem("bloomoonWatchlist", JSON.stringify(bloomoonWatchlist));
            renderLists();
            
          
            gsap.from(card, {
              scale: 0.8,
              duration: 0.5,
              ease: "back.out(1.7)"
            });
            // notify user and close search results
            showNotification('Added to Bloomoon Watchlist');
            searchResults.innerHTML = '';
          } else {
            alert("This title is already in your Bloomoon Watchlist!");
          }
        });
        searchResults.appendChild(card);
      });
    }
  }
});


searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});