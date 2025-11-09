
(function () {
  
  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  function ensurePlugins() {
    
    const cdnBase = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/';
    const toLoad = [];

    if (typeof ScrollTrigger === 'undefined') {
      toLoad.push(loadScript(cdnBase + 'ScrollTrigger.min.js'));
    }

    if (typeof MotionPathPlugin === 'undefined') {
      toLoad.push(loadScript(cdnBase + 'MotionPathPlugin.min.js'));
    }

    if (toLoad.length === 0) {
     
      gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
      return Promise.resolve();
    }

    return Promise.all(toLoad)
      .then(() => {
        
        try { gsap.registerPlugin(ScrollTrigger); } catch (e) { /* ignore */ }
        try { gsap.registerPlugin(MotionPathPlugin); } catch (e) { /* ignore */ }
      })
      .catch(err => {
        console.warn('Could not load one or more GSAP plugins:', err);
      });
  }

  
  document.addEventListener('DOMContentLoaded', async () => {
   
    const usernameSpan = document.getElementById('username');
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser && usernameSpan) usernameSpan.textContent = storedUser;

    
    try {
      if (typeof gsap !== 'undefined') {
        if (document.getElementById('welcome-text')) {
          gsap.from("#welcome-text", { opacity: 0, y: -20, duration: 1.4, ease: "power2.out" });
        }
        if (document.getElementById('username')) {
          gsap.to("#username", { color: "#ff67a6ff", repeat: -1, yoyo: true, duration: 2 });
        }
      } else {
        console.warn('gsap not found — existing small animations skipped.');
      }
    } catch (err) {
      console.warn('Existing GSAP animations error (non-fatal):', err);
    }

   
    const posters = document.querySelectorAll('.film-poster');

    // Build an ordered list of films (dataset + src + detailPage) so details page can navigate next/prev
    try {
      const detailPages = ['library-details.html','library-details2.html','library-details3.html','library-details4.html'];
      const filmList = Array.from(posters).map((p, i) => Object.assign({}, p.dataset, { src: p.src, detailPage: detailPages[i % detailPages.length] }));
      localStorage.setItem('filmList', JSON.stringify(filmList));

      posters.forEach((poster, i) => {
        poster.addEventListener('click', () => {
          const data = Object.assign({}, poster.dataset, { src: poster.src, detailPage: detailPages[i % detailPages.length] });
          localStorage.setItem('selectedFilm', JSON.stringify(data));
          // navigate to the assigned details page for this film
          const target = data.detailPage || 'library-details.html';
          window.location.href = target;
        });
      });
    } catch (err) {
      console.warn('Could not build filmList for navigation:', err);
    }

   
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const card = btn.closest('.film-card');
        const poster = card ? card.querySelector('.film-poster') : null;
        if (poster) {
          // determine index to pick matching detail page
          const allPosters = Array.from(document.querySelectorAll('.film-poster'));
          const idx = allPosters.indexOf(poster);
          const detailPages = ['library-details.html','library-details2.html','library-details3.html','library-details4.html'];
          const detailPage = detailPages[idx % detailPages.length] || 'library-details.html';
          const data = Object.assign({}, poster.dataset, { src: poster.src, detailPage });
          localStorage.setItem('selectedFilm', JSON.stringify(data));
          window.location.href = detailPage;
        } else {
          window.location.href = 'library-details.html';
        }
      });
    });

    
    await ensurePlugins();

    
    if (typeof gsap === 'undefined') {
      console.warn('gsap missing — enhanced animations skipped.');
      return;
    }

    
    const pageTL = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    const navEl = document.querySelector('nav');
    const welcomeEl = document.querySelector('.library-header');
    const cards = $all('.film-card');

    if (navEl) pageTL.from(navEl, { y: -50, opacity: 0, duration: 0.9 });
    if (welcomeEl) pageTL.from(welcomeEl, { y: -20, opacity: 0, duration: 0.9 }, "-=0.5");

    
    if (cards.length) {
      pageTL.from(cards.slice(0, Math.min(6, cards.length)), {
        y: 20, opacity: 0, duration: 0.6, stagger: 0.08
      }, "-=0.4");
    }

    
    try {
    
      if (typeof ScrollTrigger !== 'undefined') {
        cards.forEach(card => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 24,
            duration: 0.6,
            ease: 'power2.out'
          });
        });
      } else {
        
        gsap.from(cards, { opacity: 0, y: 24, duration: 0.6, stagger: 0.06, ease: 'power2.out' });
      }
    } catch (err) {
      console.warn('ScrollTrigger animations failed (non-fatal):', err);
    }

    
    try {
      if (typeof MotionPathPlugin !== 'undefined') {
        const header = document.querySelector('header') || document.querySelector('.library-header') || document.querySelector('nav');
        if (header) {
          
          const svgNS = "http://www.w3.org/2000/svg";
          const svg = document.createElementNS(svgNS, 'svg');
          svg.setAttribute('width', '180');
          svg.setAttribute('height', '80');
          svg.setAttribute('viewBox', '0 0 180 80');
          svg.style.position = 'absolute';
          svg.style.right = '20px';
          svg.style.top = '10px';
          svg.style.pointerEvents = 'none';
          svg.style.overflow = 'visible';

          
          const path = document.createElementNS(svgNS, 'path');
          path.setAttribute('d', 'M10,60 C50,10 130,10 170,60');
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke', 'rgba(255,255,255,0.0)');
          path.setAttribute('id', 'moonPath');

          
          const circle = document.createElementNS(svgNS, 'circle');
          circle.setAttribute('r', '8');
          circle.setAttribute('cx', '10');
          circle.setAttribute('cy', '60');
          circle.setAttribute('fill', '#ffd6e0');
          circle.setAttribute('stroke', 'rgba(0,0,0,0.05)');
          circle.setAttribute('stroke-width', '1');

          svg.appendChild(path);
          svg.appendChild(circle);

          
          header.style.position = header.style.position || 'relative';
          header.appendChild(svg);

          
          gsap.to(circle, {
            duration: 8,
            repeat: -1,
            ease: 'sine.inOut',
            motionPath: {
              path: path,
              align: path,
              alignOrigin: [0.5, 0.5],
              autoRotate: false
            }
          });

          
          gsap.to(circle, { scale: 0.85, transformOrigin: '50% 50%', repeat: -1, yoyo: true, duration: 2 });
        }
      }
    } catch (err) {
      console.warn('MotionPath decorative animation failed (non-fatal):', err);
    }

   
    $all('.film-poster').forEach(img => {
      img.addEventListener('mouseenter', () => {
        gsap.to(img, { scale: 1.06, duration: 0.4, ease: 'power2.out' });
      });
      img.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
      });
    });

    
  }); 
})();
