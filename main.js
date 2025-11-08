/* main.js
   Injects a site-wide navbar and provides basic behavior:
   - inserts navbar HTML into each page
   - highlights the current page link
   - toggles mobile menu
   This file is intended to be included on every page as a shared navbar script.
*/
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const folders = ['Profile','Library','Diary','Watchlist','About','LandingPage'];
    const path = window.location.pathname || window.location.href;
    // determine prefix to reach project root (simple heuristic for this repo layout)
    let prefix = '';
    for (const f of folders) if (path.includes('/'+f+'/')) { prefix = '../'; break; }

    const navHTML = `
      <nav class="site-nav">
        <div class="nav-left">
          <a class="logo" href="${prefix}index.html">🌙 Bloomoon Studio</a>
        </div>
        <button id="nav-toggle" aria-label="Toggle navigation">☰</button>
        <ul class="nav-links">
          <li><a href="${prefix}Library/library.html">Library</a></li>
          <li><a href="${prefix}Diary/diary.html">Diary</a></li>
          <li><a href="${prefix}Watchlist/watchlist.html">Watchlists</a></li>
          <li><a href="${prefix}Profile/profile.html">Profile</a></li>
          <li><a href="${prefix}About/about.html">About</a></li>
        </ul>
      </nav>
    `;

    // insert at the top of the body
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // toggle for small screens
    const toggle = document.getElementById('nav-toggle');
    const links = document.querySelector('.site-nav .nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('open'));
    }

    // highlight active link
    const anchors = document.querySelectorAll('.site-nav a');
    anchors.forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      try {
        const url = new URL(href, location.href);
        // compare normalized pathname
        const linkPath = url.pathname.replace(/\/index\.html$/, '/');
        const current = location.pathname.replace(/\/index\.html$/, '/');
        if (linkPath === current || current.endsWith(href)) a.classList.add('active');
      } catch (e) {
        // ignore malformed URLs
      }
    });

    // close mobile menu when clicking a link
    document.querySelectorAll('.site-nav .nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        if (links) links.classList.remove('open');
      });
    });
  });
})();
